const supabase = require('../config/supabase');
const { logEvent } = require('../services/auditService');

// @desc    Get the user's encrypted vault
// @route   GET /api/vault
exports.getVault = async (req, res) => {
    // console.log("hello");

  try {
    const { data: vault, error } = await supabase
      .from('vaults')
      .select('encryptedBlob')
      .eq('userId', req.user.id)
      .single();

    if (error) {
      throw error;
    }

    if (!vault) {
      return res.status(404).json({ message: 'Vault not found' });
    }
    await logEvent(req.user.id, 'VAULT_FETCH_SUCCESS', req);
    res.status(200).json({ encryptedBlob: vault.encryptedBlob });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update the user's encrypted vault
// @route   PUT /api/vault
exports.updateVault = async (req, res) => {
  const { encryptedBlob } = req.body;
  // console.log(encryptedBlob);
  // console.log("hello");
  
  
  if (typeof encryptedBlob !== 'string') {
      return res.status(400).json({ message: 'encryptedBlob must be a string.' });
  }
  
  try {
    const { error } = await supabase
      .from('vaults')
      .update({ encryptedBlob })
      .eq('userId', req.user.id);

    if (error) {
      throw error;
    }

    await logEvent(req.user.id, 'VAULT_UPDATE_SUCCESS', req);
    res.status(200).json({ message: 'Vault updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
