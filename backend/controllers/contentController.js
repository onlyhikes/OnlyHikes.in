const { supabase, supabaseAdmin, isConfigured } = require('../services/supabaseService');
const { mockDataService } = require('../services/mockDataService');

/**
 * Get Site Content (Hero, Why Jaipur, Why Adventure, How It Works, Announcements, Footer, SEO)
 * Public endpoint
 */
async function getSiteContent(req, res) {
  try {
    const { section } = req.params;

    if (isConfigured && supabase) {
      if (section) {
        const { data, error } = await supabase
          .from('site_content')
          .select('content')
          .eq('section_key', section)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          return res.json({ success: true, data: data.content });
        }
      } else {
        const { data, error } = await supabase
          .from('site_content')
          .select('section_key, content');

        if (error) throw error;
        if (data && data.length > 0) {
          const contentMap = {};
          data.forEach(item => {
            contentMap[item.section_key] = item.content;
          });
          return res.json({ success: true, data: contentMap });
        }
      }
    }

    const data = mockDataService.getSiteContent(section);
    return res.json({ success: true, data });
  } catch (err) {
    console.error('[Content] Get content error:', err);
    const data = mockDataService.getSiteContent(req.params.section);
    return res.json({ success: true, data, fallback: true });
  }
}

/**
 * Update Site Content Section
 * Admin protected
 */
async function updateSiteContent(req, res) {
  try {
    const { section } = req.params;
    const newContent = req.body;

    if (!section) {
      return res.status(400).json({ success: false, message: 'Section key is required.' });
    }

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('site_content')
        .upsert(
          { section_key: section, content: newContent, updated_at: new Date().toISOString() },
          { onConflict: 'section_key' }
        )
        .select()
        .single();

      if (error) throw error;

      mockDataService.updateSiteContent(section, newContent);
      return res.json({ success: true, data: data.content, message: `Section '${section}' updated successfully.` });
    }

    const updated = mockDataService.updateSiteContent(section, newContent);
    return res.json({ success: true, data: updated, message: `Section '${section}' updated successfully.` });
  } catch (err) {
    console.error('[Content] Update error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to update section content.' });
  }
}

module.exports = {
  getSiteContent,
  updateSiteContent
};
