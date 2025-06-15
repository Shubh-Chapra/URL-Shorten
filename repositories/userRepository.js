const User = require('../models/User');

class UserRepository {
 create(userData) {
      const user = new User(userData);
      return user.save();
  }

  findAll() {
    return User.find().sort({ createdAt: -1 });
  }

  findById(id) {
    return User.findById(id);
  }

  updateById(id, updateData) {
    return User.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      );
  }

 deleteById(id) {
    return User.findByIdAndDelete(id);
}
}

module.exports = new UserRepository();