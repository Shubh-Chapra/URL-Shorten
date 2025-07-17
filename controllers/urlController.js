const urlService = require('../services/urlService');

class UrlController {
  handleResponse(result, res) {
    const status = result.statusCode || (result.success ? 200 : 500);
    res.status(status).json(result);
  }

 async createShortUrl(req, res) {
  const host = `${req.protocol}://${req.get('host')}`;
  const result = await urlService.createShortUrl(req.body, host, req.appInfo);

  // Extract only needed fields
  const { app_id, short_code, user_code, created_at } = result.data;
  const short_url = result.short_url;

  const minimalData = {
    app_id,
    short_code,
    user_code,
    created_at
  };

  this.handleResponse({
    ...result,
    data: minimalData,
    short_url
  }, res);
}

  async getAllUrls(req, res) {
    const result = await urlService.getAllUrls();
    this.handleResponse(result, res);
  }

  async getUrlById(req, res) {
    const result = await urlService.getUrlById(req.params.id);
    this.handleResponse(result, res);
  }

  async getUrlByShortCode(req, res) {
  const result = await urlService.getUrlByShortCode(req.params.shortCode);
  this.handleResponse(result, res);
}

  async updateUrlById(req, res) {
    const result = await urlService.updateUrlById(req.params.id, req.body, req.appInfo);
    this.handleResponse(result, res);
  }

  async updateUrlByShortCode(req, res) {
    const result = await urlService.updateUrlByShortCode(req.params.shortCode, req.body, req.appInfo);
    this.handleResponse(result, res);
  }

  async deleteUrlById(req, res) {
    const result = await urlService.deleteUrlById(req.params.id, req.appInfo);
    this.handleResponse(result, res);
  }

  async deleteUrlByShortCode(req, res) {
    const result = await urlService.deleteUrlByShortCode(req.params.shortCode, req.appInfo);
    this.handleResponse(result, res);
  }

  async redirectToOriginal(req, res) {
    const result = await urlService.redirectToOriginal(req.params.shortCode);
    result.success ? res.redirect(result.redirectUrl) : this.handleResponse(result, res);
  }
}

module.exports = new UrlController();