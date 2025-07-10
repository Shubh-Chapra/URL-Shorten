// models/ShortUrl.js
const mongoose = require('mongoose');


const shortUrlSchema = new mongoose.Schema({
  app_id: { type: mongoose.Schema.Types.ObjectId, ref: 'App', required: true },
  original_url: { type: String, required: true },
  short_code: { type: String, unique: true },
  expiration_date: { type: Date },
  entity_type: { type: String },
  user_code : {type: String, unique: true},
  update_flag: {type : Boolean},
  entity_id: { type: String },
  product_type: { type: String },
  extra_params: { type: Map, of: String }, // OR just use Mixed
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ShortUrl', shortUrlSchema);