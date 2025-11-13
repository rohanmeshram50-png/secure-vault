const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { logEvent } = require('../services/auditService');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  const { email, password } = req.body;

  // IMPORTANT: ZERO-KNOWLEDGE EXPLANATION
  // The 'authKey' is DERIVED on the client-side from the user's Master Password.
  // authKey = PBKDF2(masterPassword, email, iterations)
  // The Master Password ITSELF is NEVER sent to the server.
  // We hash and store this derived key for authentication purposes.
  // The gold standard is SRP, but this is a secure and simpler alternative.

  try {
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (findError && findError.code !== 'PGRST116') { // PGRST116: "The result contains 0 rows"
      throw findError;
    }
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const authKeyHash = await bcrypt.hash(password, salt);

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        { email, authKeyHash, salt, mfaEnabled: false },
      ])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }
    
    // Create an empty vault for the new user
    const { error: vaultError } = await supabase
      .from('vaults')
      .insert([
        { userId: newUser.id, encryptedBlob: '' },
      ]);

    if (vaultError) {
      throw vaultError;
    }
    
    await logEvent(newUser.id, 'REGISTER_SUCCESS', req);

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      message: 'Registration successful.'
    });

  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: 'Server error1', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (findError && findError.code !== 'PGRST116') {
        throw findError;
    }

    if (!user || !(await bcrypt.compare(password, user.authKeyHash))) {
      const userId = user ? user.id : null;
      await logEvent(userId, 'LOGIN_FAILURE_INVALID_CREDENTIALS', req);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // If MFA is enabled, don't issue a token yet.
    // Signal to the client that an MFA step is required.
    if (user.mfaEnabled) {
      await logEvent(user.id, 'LOGIN_MFA_REQUIRED', req);
      return res.status(200).json({ mfaRequired: true, email: user.email });
    }

    // MFA is not enabled, issue token directly.
    const token = generateToken(user.id);
    await logEvent(user.id, 'LOGIN_SUCCESS', req);

    res.status(200).json({ token });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
