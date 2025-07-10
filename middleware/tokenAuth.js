const App = require('../models/App');

module.exports = async (req, res, next) => {
  const token = req.headers['x-app-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token missing" });
  }

  const app = await App.findOne({ token });
  if (!app) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  req.appInfo = app; 
  next();
};
