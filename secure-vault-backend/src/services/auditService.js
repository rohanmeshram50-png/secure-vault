const supabase = require('../config/supabase');

const logEvent = async (userId, action, req) => {
  try {
    const { error } = await supabase.from('audit_logs').insert([
      {
        userId,
        action,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      },
    ]);
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Failed to write to audit log:', error);
  }
};

module.exports = { logEvent };
