const urlRepository = require('../repositories/urlRepository');
const { generateShortCode } = require('../utils/shortUrlGenerator');

class UrlService {
  async createShortUrl(data, host) {
    try {
      const { original_url,
  entity_type,
  entity_id,
  product_type,
  extra_params,
  expiration_date, userCode } = data;

      if (!original_url) {
        return { success: false, statusCode: 400, message: 'Original URL is required' };
      }

      const shortCode = short_code || generateShortCode();
      const app = req.appInfo;
      const existing = await urlRepository.findByShortCode(shortCode);

      if (existing) {
        return {
          success: false,
          statusCode: 409,
          message: 'Short code already exists'
        };
      }

      const newUrl = await urlRepository.create({
        app_id: app._id,
        original_url,
        short_code: shortCode,
        user_code,
        update_flag: false,
        expiration_date,
        entity_type,
        entity_id,
        product_type,
        extra_params,
        created_at: new Date()
      });

      return {
        success: true,
        statusCode: 201,
        message: 'Short URL created successfully',
        data: newUrl,
        short_url: `${host}/urls/redirect/${shortCode}`
      };

    } catch (error) {
      return { success: false, statusCode: 500, message: 'Server error', error: error.message };
    }
    const token = req.headers['x-app-token'];
if (!token) {
  return res.status(401).json({ success: false, message: "Missing app token" });
}

  }

  async getAllUrls() {
    try {
      const urls = await urlRepository.findAll();
      return {
        success: true,
        data: urls,
        statusCode: 200,
        count: urls.length
      };
    } catch (error) {
      return { success: false, statusCode: 500, message: 'Error fetching URLs', error: error.message };
    }
  }

  async getUrlById(id) {
    try {
      const url = await urlRepository.findById(id);
      if (!url) {
        return { success: false, statusCode: 404, message: 'URL not found' };
      }
      return { success: true, data: url };
    } catch (error) {
      return { success: false, statusCode: 500, message: 'Error retrieving URL', error: error.message };
    }
  }

  async updateUrlById(id, updateData) {
    try {
      if (updateData.short_code) {
        const existing = await urlRepository.findByShortCode(updateData.short_code);
        if (existing && existing._id.toString() !== id) {
          return { success: false, statusCode: 409, message: 'Short code already exists' };
        }
      }
      updateData.updateFlag = true;

      const updated = await urlRepository.updateById(id, updateData);
      if (!updated) {
        return { success: false, statusCode: 404, message: 'URL not found' };
      }

      return { success: true, data: updated, message: 'URL updated successfully' };
    } catch (error) {
      return { success: false, statusCode: 500, message: 'Error updating URL', error: error.message };
    }
  }

  async updateUrlByShortCode(shortCode, updateData) {
    try {
      if (updateData.short_code && updateData.short_code !== shortCode) {
        const existing = await urlRepository.findByShortCode(updateData.short_code);
        if (existing) {
          return { success: false, statusCode: 409, message: 'New short code already exists' };
        }
      }
      updateData.updateFlag = true;
      
      const updated = await urlRepository.updateByShortCode(shortCode, updateData);
      if (!updated) {
        return { success: false, statusCode: 404, message: 'Short URL not found' };
      }

      return { success: true, data: updated, message: 'Short URL updated successfully' };
    } catch (error) {
      return { success: false, statusCode: 500, message: 'Error updating URL', error: error.message };
    }
  }

  async deleteUrlById(id) {
    try {
      const deleted = await urlRepository.deleteById(id);
      if (!deleted) {
        return { success: false, statusCode: 404, message: 'URL not found' };
      }

      return { success: true, message: 'URL deleted successfully' };
    } catch (error) {
      return { success: false, statusCode: 500, message: 'Error deleting URL', error: error.message };
    }
  }

  async deleteUrlByShortCode(shortCode) {
    try {
      const deleted = await urlRepository.deleteByShortCode(shortCode);
      if (!deleted) {
        return { success: false, statusCode: 404, message: 'Short URL not found' };
      }

      return { success: true, message: 'Short URL deleted successfully' };
    } catch (error) {
      return { success: false, statusCode: 500, message: 'Error deleting short URL', error: error.message };
    }
  }

  async redirectToOriginal(shortCode) {
    try {
      const url = await urlRepository.findByShortCode(shortCode);
      if (!url) {
        return { success: false, statusCode: 404, message: 'Short URL not found' };
      }

      if (url.expires_at && new Date() > url.expires_at) {
        return { success: false, statusCode: 410, message: 'Short URL has expired' };
      }

      return { success: true, redirectUrl: url.original_url };
    } catch (error) {
      return { success: false, statusCode: 500, message: 'Redirect failed', error: error.message };
    }
  }

  async getUrlStats() {
    try {
      const urls = await urlRepository.findAll();
      const stats = {
        total: urls.length,
        active: urls.filter(u => !u.expires_at || new Date() < u.expires_at).length,
        expired: urls.filter(u => u.expires_at && new Date() > u.expires_at).length
      };

      return { success: true, data: stats };
    } catch (error) {
      return { success: false, statusCode: 500, message: 'Failed to fetch stats', error: error.message };
    }
  }
}

module.exports = new UrlService();
