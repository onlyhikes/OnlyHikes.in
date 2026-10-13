// ====================================================================
// ONLYHIKES.IN — COMMUNITY VOTING CONTROLLER
// Admin ON/OFF toggle + 1 vote per student per round enforcement
// ====================================================================

const { mockDataService } = require('../services/mockDataService');
const { supabaseAdmin, isConfigured } = require('../services/supabaseService');

/**
 * Get active voting round (or latest round for admin)
 */
async function getActiveRound(req, res, next) {
  try {
    const userId = req.user ? req.user.id : (req.query.voter_id || null);
    const isAdmin = Boolean(req.user?.is_admin || req.headers['x-admin-key'] || req.query.admin === 'true');

    if (isConfigured && supabaseAdmin) {
      let query = supabaseAdmin
        .from('voting_rounds')
        .select('*, voting_options(*)')
        .order('created_at', { ascending: false })
        .limit(1);

      if (!isAdmin) {
        query = query.eq('is_active', true);
      }

      const { data: round, error } = await query.maybeSingle();

      if (error || !round) {
        return res.json({ success: true, data: null, message: 'No active voting round at the moment.' });
      }

      let userVotedOptionId = null;
      if (userId) {
        const { data: userVote } = await supabaseAdmin
          .from('votes')
          .select('option_id')
          .eq('round_id', round.id)
          .eq('user_id', userId)
          .maybeSingle();
        if (userVote) userVotedOptionId = userVote.option_id;
      }

      return res.json({
        success: true,
        data: {
          ...round,
          options: round.voting_options || [],
          hasVoted: Boolean(userVotedOptionId),
          votedOptionId: userVotedOptionId
        }
      });
    }

    // Fallback store
    const round = isAdmin ? mockDataService.getLatestVotingRound() : mockDataService.getActiveVotingRound();
    if (!round) {
      return res.json({ success: true, data: null, message: 'Voting is currently turned off.' });
    }

    const hasVoted = userId ? mockDataService.hasUserVoted(round.id, userId) : false;
    const votedOptionId = userId ? mockDataService.getUserVotedOption(round.id, userId) : null;

    return res.json({
      success: true,
      data: {
        ...round,
        hasVoted,
        votedOptionId
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Cast a vote
 */
async function castVote(req, res, next) {
  try {
    const { round_id, option_id, voter_id } = req.body;
    const userId = req.user ? req.user.id : (voter_id || `anon_${req.ip}`);

    if (!round_id || !option_id) {
      return res.status(400).json({ success: false, message: 'Round ID and Option ID are required.' });
    }

    if (isConfigured && supabaseAdmin) {
      const { data: existingVote } = await supabaseAdmin
        .from('votes')
        .select('id')
        .eq('round_id', round_id)
        .eq('user_id', userId)
        .maybeSingle();

      if (existingVote) {
        return res.status(400).json({
          success: false,
          message: 'You have already voted in this round.'
        });
      }

      const { error: voteErr } = await supabaseAdmin
        .from('votes')
        .insert({
          round_id,
          option_id,
          user_id: userId
        });

      if (voteErr) {
        if (voteErr.code === '23505') {
          return res.status(400).json({
            success: false,
            message: 'You have already voted in this round.'
          });
        }
        throw voteErr;
      }

      const { data: updatedOption } = await supabaseAdmin
        .from('voting_options')
        .select('*')
        .eq('id', option_id)
        .single();

      return res.json({
        success: true,
        message: 'Your vote has been counted!',
        data: updatedOption
      });
    }

    try {
      const result = mockDataService.castVote(round_id, option_id, userId);
      return res.json({
        success: true,
        message: 'Your vote has been counted!',
        data: result
      });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Toggle voting visibility on public website (is_active: true/false)
 */
async function toggleRound(req, res, next) {
  try {
    const { is_active } = req.body;

    if (isConfigured && supabaseAdmin) {
      const { data: latest } = await supabaseAdmin
        .from('voting_rounds')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latest) {
        const { data: updated, error } = await supabaseAdmin
          .from('voting_rounds')
          .update({ is_active: Boolean(is_active) })
          .eq('id', latest.id)
          .select('*, voting_options(*)')
          .single();
        if (error) throw error;
        mockDataService.toggleVotingRound(is_active);
        return res.json({
          success: true,
          data: { ...updated, options: updated.voting_options || [] },
          message: is_active ? 'Voting enabled on website!' : 'Voting hidden from website!'
        });
      }
    }

    const updatedRound = mockDataService.toggleVotingRound(is_active);
    return res.json({
      success: true,
      data: updatedRound,
      message: is_active ? 'Voting enabled on website!' : 'Voting hidden from website!'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Create new voting round
 */
async function createRound(req, res, next) {
  try {
    const { title, description, start_date, end_date, options, is_active = true } = req.body;

    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Title and at least 2 destination options are required.'
      });
    }

    const roundId = `round-${Date.now()}`;
    const newRound = {
      id: roundId,
      title,
      description: description || 'Which trail should we hike next Sunday? Cast your vote!',
      start_date: start_date || new Date().toISOString(),
      end_date: end_date || new Date(Date.now() + 5 * 86400000).toISOString(),
      is_active: Boolean(is_active),
      options: options.map((opt, idx) => ({
        id: `opt-${roundId}-${idx}`,
        round_id: roundId,
        title: opt.title,
        subtitle: opt.subtitle || '',
        image_url: opt.image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        votes_count: 0
      }))
    };

    if (isConfigured && supabaseAdmin) {
      await supabaseAdmin.from('voting_rounds').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000');

      const { data: createdRound, error: rErr } = await supabaseAdmin
        .from('voting_rounds')
        .insert({
          title: newRound.title,
          description: newRound.description,
          start_date: newRound.start_date,
          end_date: newRound.end_date,
          is_active: Boolean(is_active)
        })
        .select()
        .single();

      if (rErr) throw rErr;

      const optionsToInsert = newRound.options.map(o => ({
        round_id: createdRound.id,
        title: o.title,
        subtitle: o.subtitle,
        image_url: o.image_url,
        votes_count: 0
      }));

      const { data: insertedOpts } = await supabaseAdmin.from('voting_options').insert(optionsToInsert).select();
      mockDataService.votingRounds.unshift(newRound);
      return res.status(201).json({
        success: true,
        data: { ...createdRound, options: insertedOpts || newRound.options }
      });
    }

    mockDataService.votingRounds.forEach(r => { r.is_active = false; });
    mockDataService.votingRounds.unshift(newRound);
    return res.status(201).json({ success: true, data: newRound });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getActiveRound,
  castVote,
  toggleRound,
  createRound
};
