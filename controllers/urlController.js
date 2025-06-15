const urlService = require('../services/urlService');

class UrlController {
  handleResponse(result, res) {
    const status = result.statusCode || (result.success ? 200 : 500);
    res.status(status).json(result);
  }

  async createShortUrl(req, res) {
    const host = `${req.protocol}://${req.get('host')}`;
    const result = await urlService.createShortUrl(req.body, host);
    this.handleResponse(result, res);
  }

  async getAllUrls(req, res) {
    const result = await urlService.getAllUrls();
    this.handleResponse(result, res);
  }

  async getUrlById(req, res) {
    const result = await urlService.getUrlById(req.params.id);
    this.handleResponse(result, res);
  }

  async updateUrlById(req, res) {
    const result = await urlService.updateUrlById(req.params.id, req.body);
    this.handleResponse(result, res);
  }

  async updateUrlByShortCode(req, res) {
    const result = await urlService.updateUrlByShortCode(req.params.shortCode, req.body);
    this.handleResponse(result, res);
  }

  async deleteUrlById(req, res) {
    const result = await urlService.deleteUrlById(req.params.id);
    this.handleResponse(result, res);
  }

  async deleteUrlByShortCode(req, res) {
    const result = await urlService.deleteUrlByShortCode(req.params.shortCode);
    this.handleResponse(result, res);
  }

  async redirectToOriginal(req, res) {
    const result = await urlService.redirectToOriginal(req.params.shortCode);
    result.success ? res.redirect(result.redirectUrl) : this.handleResponse(result, res);
  }
}

module.exports = new UrlController();