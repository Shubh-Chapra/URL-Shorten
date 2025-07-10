const appService = require('../services/appService');

exports.registerApp = async (req, res) => {
  try {
    const app = await appService.registerApp(req.body);
    res.status(201).json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
  }
};
