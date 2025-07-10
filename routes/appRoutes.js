const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');
const validateDto = require('../middleware/validationDto');
const { RegisterAppDto } = require('../dtos/appDto');

/**
 * @swagger
 * /api/app/register:
 *   post:
 *     summary: Register a new app
 *     tags: [Apps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appName
 *               - baseUrl
 *             properties:
 *               appName:
 *                 type: string
 *               baseUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: App registered successfully
 *       409:
 *         description: App already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', validateDto(RegisterAppDto), appController.registerApp);


module.exports = router;