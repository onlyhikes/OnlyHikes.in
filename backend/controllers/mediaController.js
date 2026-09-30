const { supabase, supabaseAdmin, isConfigured } = require('../services/supabaseService');
const { mockDataService } = require('../services/mockDataService');

/**
 * List media assets
 * Public / Admin
 */
async function getMedia(req, res) {
  try {
    const { placement } = req.query;

    if (isConfigured && supabase) {
      let query = supabase.from('media_library').select('*').order('created_at', { ascending: false });
      if (placement) {
        query = query.eq('placement', placement);
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.json({ success: true, data: data || [] });
    }

    const data = mockDataService.getMedia(placement);
    return res.json({ success: true, data });
  } catch (err) {
    console.error('[Media] Get media error:', err);
    const data = mockDataService.getMedia(req.query.placement);
    return res.json({ success: true, data, fallback: true });
  }
}

/**
 * Save media record into library
 * Admin protected
 */
async function saveMedia(req, res) {
  try {
    const { title, file_url, file_type, file_size, placement } = req.body;

    if (!file_url || !title) {
      return res.status(400).json({ success: false, message: 'Title and file_url are required.' });
    }

    const mediaPayload = {
      title,
      file_url,
      file_type: file_type || 'image',
      file_size: file_size || 0,
      placement: placement || 'unassigned',
      is_active: true
    };

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('media_library')
        .insert([mediaPayload])
        .select()
        .single();

      if (error) throw error;
      mockDataService.addMedia(data);
      return res.status(201).json({ success: true, data, message: 'Media saved successfully.' });
    }

    const saved = mockDataService.addMedia(mediaPayload);
    return res.status(201).json({ success: true, data: saved, message: 'Media saved successfully.' });
  } catch (err) {
    console.error('[Media] Save media error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to save media.' });
  }
}

/**
 * Delete media asset
 * Admin protected
 */
async function deleteMedia(req, res) {
  try {
    const { id } = req.params;

    if (isConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin.from('media_library').delete().eq('id', id);
      if (error) throw error;
      mockDataService.deleteMedia(id);
      return res.json({ success: true, message: 'Media removed from library.' });
    }

    mockDataService.deleteMedia(id);
    return res.json({ success: true, message: 'Media removed from library.' });
  } catch (err) {
    console.error('[Media] Delete media error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to delete media.' });
  }
}

module.exports = {
  getMedia,
  saveMedia,
  deleteMedia
};
