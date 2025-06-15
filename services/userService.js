 const userRepository = require('../repositories/userRepository');

class UserService {
  async createUser(userData) {
    try {
      const newUser = await userRepository.create(userData);
      return {
        success: true,
        statusCode: 201,
        message: 'User created successfully',
        data: newUser
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Failed to create user',
        error: error.message
      };
    }
  }

  async getAllUsers() {
    try {
      const users = await userRepository.findAll();
      return {
        success: true,
        data: users
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Failed to fetch users',
        error: error.message
      };
    }
  }

  async getUserById(id) {
    try {
      const user = await userRepository.findById(id);
      if (!user) {
        return {
          success: false,
          statusCode: 404,
          message: 'User not found'
        };
      }
      return {
        success: true,
        data: user
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Failed to fetch user',
        error: error.message
      };
    }
  }

  async updateUserById(id, updateData) {
    try {
      const updatedUser = await userRepository.updateById(id, updateData);
      if (!updatedUser) {
        return {
          success: false,
          statusCode: 404,
          message: 'User not found'
        };
      }
      return {
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Failed to update user',
        error: error.message
      };
    }
  }

  async deleteUserById(id) {
    try {
      const deletedUser = await userRepository.deleteById(id);
      if (!deletedUser) {
        return {
          success: false,
          statusCode: 404,
          message: 'User not found'
        };
      }
      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Failed to delete user',
        error: error.message
      };
    }
  }
}

module.exports = new UserService();
