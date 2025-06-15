const ShortUrl = require('../models/ShortUrl');

class UrlRepository {
 create(urlData) {
      const url = new ShortUrl(urlData);
      return url.save();
    }
  

 findAll() {
      return ShortUrl.find().sort({ created_at: -1 });
    }

 findById(id) {
     return ShortUrl.findById(id);
    }

 updateById(id, updateData) {
    return ShortUrl.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      );
  }

 updateByShortCode(shortCode, updateData) {
    return ShortUrl.findOneAndUpdate(
        { short_code: shortCode },
        updateData,
        { new: true, runValidators: true }
      );
  }

 deleteById(id) {
    return ShortUrl.findByIdAndDelete(id);
  }

 deleteByShortCode(shortCode) {
    return ShortUrl.findOneAndDelete({ short_code: shortCode });
  }

 findByShortCode(shortCode) {
   return ShortUrl.findOne({ short_code: shortCode });
    }
}
module.exports = new UrlRepository();