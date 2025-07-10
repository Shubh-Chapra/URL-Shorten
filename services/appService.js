const App = require('../models/App');
const { nanoid } = require('nanoid');

exports.registerApp = async ({ name, base_url }) => {
  let app = await App.findOne({ name, base_url });

  if (app) return app;

  const token = nanoid(24);
  app = await App.create({ name, base_url, token });

  return app;
};

exports.getAllApps = async () => {
  return await App.find({});
};

exports.getAppByToken = async (token) => {
  return await App.findOne({ token });
};

exports.getAppById = async (id) => {
  return await App.findById(id);
};
