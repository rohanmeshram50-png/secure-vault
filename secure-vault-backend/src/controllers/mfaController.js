const speakeasy = require('speakeasy');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { logEvent } = require('../services/auditService');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Setup MFA for a user
// @route   POST /api/mfa/setup
exports.setupMfa = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `SecureVault (${req.user.email})`,
    });
    
    const { error } = await supabase
      .from('users')
      .update({ mfaSecret: secret.ascii })
      .eq('id', req.user.id);

    if (error) {
      throw error;
    }

    res.json({
      secret: secret.base32, // To be shown to the user
      otpauth_url: secret.otpauth_url, // For the QR code
    });
  } catch (error) {
     res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify the token and enable MFA
// @route   POST /api/mfa/verify
exports.verifyAndEnableMfa = async (req, res) => {
  const { token } = req.body;
  
  if (!req.user.mfaSecret) {
    return res.status(400).json({ message: 'MFA not set up. Please set up first.' });
  }

  const verified = speakeasy.totp.verify({
    secret: req.user.mfaSecret,
    encoding: 'ascii',
    token,
  });

  if (verified) {
    const { error } = await supabase
      .from('users')
      .update({ mfaEnabled: true })
      .eq('id', req.user.id);

    if (error) {
      return res.status(500).json({ message: 'Server error' });
    }

    await logEvent(req.user.id, 'MFA_ENABLE_SUCCESS', req);
    res.status(200).json({ message: 'MFA has been enabled successfully.' });
  } else {
    await logEvent(req.user.id, 'MFA_ENABLE_FAILURE', req);
    res.status(400).json({ message: 'Invalid token, verification failed.' });
  }
};

// @desc    Validate MFA token during login
// @route   POST /api/mfa/validate
exports.validateLoginMfa = async (req, res) => {
  const { email, token } = req.body;
  try {
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (findError) {
      throw findError;
    }
    
    if (!user || !user.mfaEnabled || !user.mfaSecret) {
      await logEvent(user ? user.id : null, 'MFA_VALIDATE_FAILURE_NOT_ENABLED', req);
      return res.status(400).json({ message: 'MFA not enabled for this user.' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'ascii',
      token,
      window: 1, // Allow for a 30-second clock skew
    });

    if (verified) {
      const jwtToken = generateToken(user.id);
      await logEvent(user.id, 'LOGIN_SUCCESS_MFA', req);
      res.status(200).json({ token: jwtToken });
    } else {
      await logEvent(user.id, 'LOGIN_FAILURE_MFA_INVALID', req);
      res.status(401).json({ message: 'Invalid MFA token.' });
    }
  } catch (error) {
     res.status(500).json({ message: 'Server error' });
  }
};
