const { supabase, supabaseAdmin, isConfigured } = require('../services/supabaseService');
const { mockDataService } = require('../services/mockDataService');

/**
 * Get current brand settings (Logo, WhatsApp URL, Instagram, Colors, etc.)
 * Public endpoint
 */
async function getBrandSettings(req, res) {
  try {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('brand_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        return res.json({ success: true, data });
      }
    }

    const data = mockDataService.getBrandSettings();
    return res.json({ success: true, data });
  } catch (err) {
    console.error('[Brand] Get settings error:', err);
    const data = mockDataService.getBrandSettings();
    return res.json({ success: true, data, fallback: true });
  }
}

/**
 * Update brand settings
 * Admin protected
 */
async function updateBrandSettings(req, res) {
  try {
    const updates = req.body;

    if (isConfigured && supabaseAdmin) {
      // Fetch existing record ID
      const { data: existing } = await supabaseAdmin.from('brand_settings').select('id').limit(1).maybeSingle();
      
      let query;
      if (existing) {
        query = supabaseAdmin.from('brand_settings').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', existing.id);
      } else {
        query = supabaseAdmin.from('brand_settings').insert([updates]);
      }

      const { data, error } = await query.select().single();
      if (error) throw error;

      mockDataService.updateBrandSettings(data);
      return res.json({ success: true, data, message: 'Brand settings updated successfully.' });
    }

    const updated = mockDataService.updateBrandSettings(updates);
    return res.json({ success: true, data: updated, message: 'Brand settings updated successfully.' });
  } catch (err) {
    console.error('[Brand] Update error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to update brand settings.' });
  }
}

module.exports = {
  getBrandSettings,
  updateBrandSettings
};
