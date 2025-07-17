const mongoose = require('mongoose');

const AppSchema = new mongoose.Schema({
  name: { type: String, required: true },
  base_url: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model('App', AppSchema, 'apps');
