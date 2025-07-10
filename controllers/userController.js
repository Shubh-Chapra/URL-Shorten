const userService = require('../services/userService');
class UserController {
  handleResponse(result, res) {
    const status = result.statusCode || (result.success ? 200 : 500);
    res.status(status).json(result);
  }

  async createUser(req, res) {
    const result = await userService.createUser(req.body);
    this.handleResponse(result, res);
  }

  async getAllUsers(req, res) {
    const result = await userService.getAllUsers();
    this.handleResponse(result, res);
  }

  async getUserById(req, res) {
    const result = await userService.getUserById(req.params.id);
    this.handleResponse(result, res);
  }

  async updateUserById(req, res) {
    const result = await userService.updateUserById(req.params.id, req.body);
    this.handleResponse(result, res);
  }

  async deleteUserById(req, res) {
    const result = await userService.deleteUserById(req.params.id);
    this.handleResponse(result, res);
  }

  async register(req, res) {
    const { username, email, password } = req.body;
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { username, email }
    });
  }

  async login(req, res) {
    const { email, password } = req.body;
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: { email }
    });
  }
}

module.exports = new UserController();
