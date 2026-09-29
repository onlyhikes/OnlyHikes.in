// ====================================================================
// ONLYHIKES.IN — AUTHENTICATION & AUTHORIZATION MIDDLEWARE
// ====================================================================

const { supabase, supabaseAdmin, isConfigured } = require('../services/supabaseService');
require('dotenv').config();

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'onlyhikes_jaipur_admin_2026';

/**
 * Optional / Soft Auth: extracts user if token provided, otherwise leaves req.user = null
 */
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  if (isConfigured && supabase) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        req.user = user;
      }
    } catch (err) {
      console.warn('[Auth] Token decode error:', err.message);
    }
  } else {
    // Local / Dev mode fallback token decoding
    try {
      if (token.startsWith('demo_user_')) {
        req.user = { id: token, email: `${token}@demo.onlyhikes.in` };
      }
    } catch (e) {}
  }

  next();
}

/**
 * Required Auth for student actions (e.g. voting)
 */
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in with your student account.'
    });
  }

  const token = authHeader.split(' ')[1];

  if (isConfigured && supabase) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired session. Please log in again.'
        });
      }
      req.user = user;
      return next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Authentication verification failed.'
      });
    }
  }

  // Local / Dev fallback mode: accepts demo tokens
  if (token.length > 5) {
    req.user = {
      id: token.startsWith('demo_') ? token : `student_${token.slice(0, 8)}`,
      email: 'student@jaipur.demo.in'
    };
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid authorization token.'
  });
}

/**
 * Admin Route Guard
 */
async function requireAdmin(req, res, next) {
  // 1. Direct admin master header check (for local dev / automated verification)
  const masterKey = req.headers['x-admin-key'];
  if (masterKey && masterKey === ADMIN_SECRET) {
    req.user = { id: 'admin-master', role: 'superadmin', is_admin: true };
    return next();
  }

  // 2. Token based admin check
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin credentials or token required.'
    });
  }

  const token = authHeader.split(' ')[1];

  // Dev admin token
  if (token === 'admin_token_demo' || token === ADMIN_SECRET) {
    req.user = { id: 'admin-master', role: 'superadmin', is_admin: true };
    return next();
  }

  if (isConfigured && supabaseAdmin) {
    try {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
      if (error || !user) {
        return res.status(403).json({ success: false, message: 'Invalid admin credentials' });
      }

      // Check admin_roles table
      const { data: adminRecord } = await supabaseAdmin
        .from('admin_roles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!adminRecord) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Your account does not have admin privileges.'
        });
      }

      req.user = { ...user, role: adminRecord.role, is_admin: true };
      return next();
    } catch (err) {
      return res.status(403).json({ success: false, message: 'Admin verification error' });
    }
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied: Admin authorization failed.'
  });
}

module.exports = {
  optionalAuth,
  requireAuth,
  requireAdmin
};
