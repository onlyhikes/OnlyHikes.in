// ====================================================================
// ONLYHIKES.IN — COMMUNITY VOTING CONTROLLER
// Strict 1 vote per user per round rule enforcement
// ====================================================================

const mockStore = require('../services/mockDataService');
const { supabaseAdmin, isConfigured } = require('../services/supabaseService');

/**
 * Get active voting round with options and counts
 */
async function getActiveRound(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;

    if (isConfigured && supabaseAdmin) {
      const { data: round, error } = await supabaseAdmin
        .from('voting_rounds')
        .select('*, voting_options(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

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
          .single();
        if (userVote) userVotedOptionId = userVote.option_id;
      }

      return res.json({
        success: true,
        data: {
          ...round,
          options: round.voting_options || [],
          hasVoted: Boolean(userVotedOptionId),
          votedOptionId: userVotedOptionId,
          isPlaceholderDemo: false
        }
      });
    }

    // High-fidelity fallback store
    const round = mockStore.getActiveVotingRound();
    const hasVoted = userId ? mockStore.hasUserVoted(round.id, userId) : false;
    const votedOptionId = userId ? mockStore.getUserVotedOption(round.id, userId) : null;

    return res.json({
      success: true,
      data: {
        ...round,
        hasVoted,
        votedOptionId,
        isPlaceholderDemo: true // clearly identify placeholder data
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Cast a vote (Requires authentication, strictly 1 vote per user per round)
 */
async function castVote(req, res, next) {
  try {
    const { round_id, option_id } = req.body;
    const userId = req.user.id;

    if (!round_id || !option_id) {
      return res.status(400).json({ success: false, message: 'Round ID and Option ID are required.' });
    }

    if (isConfigured && supabaseAdmin) {
      // 1. Check if user already voted in this round
      const { data: existingVote } = await supabaseAdmin
        .from('votes')
        .select('id')
        .eq('round_id', round_id)
        .eq('user_id', userId)
        .single();

      if (existingVote) {
        return res.status(400).json({
          success: false,
          message: 'You have already voted in this round. Each student is allowed 1 vote.'
        });
      }

      // 2. Insert vote (database trigger increments options.votes_count)
      const { error: voteErr } = await supabaseAdmin
        .from('votes')
        .insert({
          round_id,
          option_id,
          user_id: userId
        });

      if (voteErr) {
        if (voteErr.code === '23505') { // Unique constraint violation
          return res.status(400).json({
            success: false,
            message: 'You have already voted in this round.'
          });
        }
        throw voteErr;
      }

      // Fetch updated option count
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

    // Fallback store
    try {
      const result = mockStore.castVote(round_id, option_id, userId);
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
 * Admin: Create voting round
 */
async function createRound(req, res, next) {
  try {
    const { title, description, start_date, end_date, options } = req.body;

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
      description: description || 'Jaipur students decide the next adventure trail.',
      start_date: start_date || new Date().toISOString(),
      end_date: end_date || new Date(Date.now() + 5 * 86400000).toISOString(),
      is_active: true,
      options: options.map((opt, idx) => ({
        id: `opt-${roundId}-${idx}`,
        round_id: roundId,
        title: opt.title,
        subtitle: opt.subtitle || '',
        image_url: opt.image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        difficulty: opt.difficulty || 'Moderate',
        votes_count: 0
      }))
    };

    if (isConfigured && supabaseAdmin) {
      const { data: createdRound, error: rErr } = await supabaseAdmin
        .from('voting_rounds')
        .insert({
          title: newRound.title,
          description: newRound.description,
          start_date: newRound.start_date,
          end_date: newRound.end_date,
          is_active: true
        })
        .select()
        .single();

      if (rErr) throw rErr;

      const optionsToInsert = newRound.options.map(o => ({
        round_id: createdRound.id,
        title: o.title,
        subtitle: o.subtitle,
        image_url: o.image_url,
        difficulty: o.difficulty,
        votes_count: 0
      }));

      await supabaseAdmin.from('voting_options').insert(optionsToInsert);
      return res.status(201).json({ success: true, data: createdRound });
    }

    mockStore.votingRounds.unshift(newRound);
    return res.status(201).json({ success: true, data: newRound });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getActiveRound,
  castVote,
  createRound
};
