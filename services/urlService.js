const urlRepository = require('../repositories/urlRepository');
const { generateShortCode } = require('../utils/shortUrlGenerator');

class UrlService {
 async createShortUrl(data, host, app) {
    try {
      const {entity_type,
  entity_id,
  extra_params,
  expiration_date, short_code, user_code } = data;

      const shortCode = short_code || generateShortCode();
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
        short_code: shortCode,
        user_code,
        update_flag: false,
        expiration_date,
        entity_type,
        entity_id,
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

  async getUrlByShortCode(shortCode) {
  try {
  const url = await urlRepository.findByShortCode(shortCode, true); 

    
    if (!url) {
      return { success: false, statusCode: 404, message: 'URL not found' };
    }

    return {
      success: true,
      data: {
        app_name: url.app_id?.name,
        base_url: url.app_id?.base_url,
        entity_type: url.entity_type,
        entity_id: url.entity_id,
        extra_params: url.extra_params,
        user_code: url.user_code,
        short_code: url.short_code,
        created_at: url.created_at
      }
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: 'Error retrieving URL',
      error: error.message
    };
  }
}

  async updateUrlById(id, updateData, app) {
    try {
      const url = await urlRepository.findById(id);
      if (!url) {
      return { success: false, statusCode: 404, message: 'URL not found' };
    }
        if (url.app_id.toString() !== app._id.toString()) {
      return { success: false, statusCode: 403, message: 'Unauthorized app' };
    }
    if (updateData.short_code) {
        const existing = await urlRepository.findByShortCode(updateData.short_code);
        if (existing && existing._id.toString() !== id) {
          return { success: false, statusCode: 409, message: 'Short code already exists' };
        }
      }
      updateData.update_flag = true;
      
      const updated = await urlRepository.updateById(id, updateData);
      if (!updated) {
        return { success: false, statusCode: 404, message: 'URL not found' };
      }

      return { success: true, data: updated, message: 'URL updated successfully' };
    } catch (error) {
      return { success: false, statusCode: 500, message: 'Error updating URL', error: error.message };
    }
  }

  async updateUrlByShortCode(shortCode, updateData, app) {
    try {
      const url = await urlRepository.findByShortCode(shortCode);
       if (!url) {
      return { success: false, statusCode: 404, message: 'URL not found' };
    }
     if (url.app_id.toString() !== app._id.toString()) {
      return { success: false, statusCode: 403, message: 'Unauthorized app' };
    }
      if (updateData.short_code && updateData.short_code !== shortCode) {
        const existing = await urlRepository.findByShortCode(updateData.short_code);
        if (existing) {
          return { success: false, statusCode: 409, message: 'New short code already exists' };
        }
      }
       
      updateData.update_flag = true;
      
      const updated = await urlRepository.updateByShortCode(shortCode, updateData);
      if (!updated) {
        return { success: false, statusCode: 404, message: 'Short URL not found' };
      }
     
      return { success: true, data: updated, message: 'Short URL updated successfully' };
    } catch (error) {
      return { success: false, statusCode: 500, message: 'Error updating URL', error: error.message };
    }
  }

  async deleteUrlById(id, app) {
    try {
      const url = await urlRepository.findById(id);
       if (!url) {
      return { success: false, statusCode: 404, message: 'URL not found' };
    }
     if (url.app_id.toString() !== app._id.toString()) {
      return { success: false, statusCode: 403, message: 'Unauthorized app' };
    }
      const deleted = await urlRepository.deleteById(id);
      if (!deleted) {
        return { success: false, statusCode: 404, message: 'URL not found' };
      }
       
      return { success: true, message: 'URL deleted successfully' };
    } catch (error) {
      return { success: false, statusCode: 500, message: 'Error deleting URL', error: error.message };
    }
  }

  async deleteUrlByShortCode(shortCode, app) {
    try {
         const url = await urlRepository.findByShortCode(shortCode);
          if (!url) {
      return { success: false, statusCode: 404, message: 'URL not found' };
    }
      if (url.app_id.toString() !== app._id.toString()) {
      return { success: false, statusCode: 403, message: 'Unauthorized app' };
    }
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
     const url = await urlRepository.findByShortCode(shortCode, true);
    if (!url) {
      return { success: false, statusCode: 404, message: 'Short URL not found' };
    }

    if (url.expires_at && new Date() > url.expires_at) {
      return { success: false, statusCode: 410, message: 'Short URL has expired' };
    }

    const baseUrl = url.app_id?.base_url;
    if (!baseUrl) {
      return { success: false, statusCode: 500, message: 'Base URL not found in app config' };
    }

    return { success: true, redirectUrl: baseUrl };
  } catch (error) {
    return { success: false, statusCode: 500, message: 'Redirect failed', error: error.message };
  }
}

 }

module.exports = new UrlService();
