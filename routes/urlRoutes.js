const express = require('express');
const urlController = require('../controllers/urlController');
const router = express.Router();
const tokenAuth = require('../middleware/tokenAuth');
/**
 * @swagger
 * tags:
 *   name: URLs
 *   description: All operations related to shortening, updating, and deleting URLs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ShortUrl:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *           example: "507f1f77bcf86cd799439011"
 *         short_code:
 *           type: string
 *           description: The short code for the URL
 *           example: "abc123"
 *         userCode:
 *           type: string
 *           description: "User Code or ID"
 *           example: "Shadow"
 *         updateFlag:
 *           type: boolean
 *           description: "Flag indicating if the URL was updated"
 *           example: false
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *           example: "2023-01-01T00:00:00.000Z"
 *         __v:
 *           type: integer
 *           description: MongoDB version key
 *           example: 0
 *     
 *     UrlResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Operation success status
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ShortUrl'
 *         statusCode:
 *           type: integer
 *           description: HTTP status code
 *           example: 200
 *         count:
 *           type: integer
 *           description: Number of URLs returned
 *           example: 5
 *     
 *     SingleUrlResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Operation success status
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/ShortUrl'
 *         statusCode:
 *           type: integer
 *           description: HTTP status code
 *           example: 200
 *     
 *     CreateUrlRequest:
 *       type: object
 *       required:
 *         - url
 *       properties:
 *         url:
 *           type: string
 *           description: The URL to be shortened
 *           example: "https://www.google.com"
 *     
 *     CreateUrlResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Operation success status
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             shortUrl:
 *               type: string
 *               description: The shortened URL
 *               example: "http://localhost:8080/api/shorten/redirect/abc123"
 *             originalUrl:
 *               type: string
 *               description: The original URL
 *               example: "https://www.google.com"
 *             shortCode:
 *               type: string
 *               description: The short code
 *               example: "abc123"
 *         statusCode:
 *           type: integer
 *           description: HTTP status code
 *           example: 201
 *         message:
 *           type: string
 *           description: Success message
 *           example: "URL shortened successfully"
 *     
 *     UpdateUrlRequest:
 *       type: object
 *       properties:
 *         originalUrl:
 *           type: string
 *           description: New original URL
 *           example: "https://www.updated-example.com"
 *     
 *     UpdateUrlResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Operation success status
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/ShortUrl'
 *         statusCode:
 *           type: integer
 *           description: HTTP status code
 *           example: 200
 *         message:
 *           type: string
 *           description: Success message
 *           example: "URL updated successfully"
 *     
 *     DeleteUrlResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Operation success status
 *           example: true
 *         statusCode:
 *           type: integer
 *           description: HTTP status code
 *           example: 200
 *         message:
 *           type: string
 *           description: Success message
 *           example: "URL deleted successfully"
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Operation success status
 *           example: false
 *         error:
 *           type: string
 *           description: Error message
 *           example: "URL not found"
 *         statusCode:
 *           type: integer
 *           description: HTTP status code
 *           example: 404
 */

/**
 * @swagger
 * /api/shorten:
 *   get:
 *     summary: Get all shortened URLs
 *     description: Retrieve a list of all shortened URLs in the system
 *     tags: [URLs]
 *     responses:
 *       200:
 *         description: Successfully retrieved all URLs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UrlResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', (req, res) => urlController.getAllUrls(req, res));

/**
 * @swagger
 * /api/shorten/{id}:
 *   get:
 *     summary: Get a URL by its ID
 *     description: Retrieve a specific shortened URL using its MongoDB ObjectId
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the URL
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Successfully retrieved URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleUrlResponse'
 *       404:
 *         description: URL not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', (req, res) => urlController.getUrlById(req, res));
/**
 * @swagger
 * /api/shorten/code/{shortCode}:
 *   get:
 *     summary: Get full details of a shortened URL by short code
 *     description: Retrieve full details of a shortened URL using its short code, including app name, base URL, entity info, user code, and extra parameters.
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The short code generated for the URL
 *         example: "abc1234"
 *     responses:
 *       200:
 *         description: Successfully retrieved short URL details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     app_name:
 *                       type: string
 *                       example: "Docquity"
 *                     base_url:
 *                       type: string
 *                       example: "https://docquity.com"
 *                     entity_type:
 *                       type: string
 *                       example: "user"
 *                     entity_id:
 *                       type: string
 *                       example: "USER123"
 *                     extra_params:
 *                       type: object
 *                       additionalProperties:
 *                         type: string
 *                       example: { "utm_source": "email", "ref": "invite" }
 *                     user_code:
 *                       type: string
 *                       example: "abhishek@123"
 *                     short_code:
 *                       type: string
 *                       example: "4cFHNWE"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-17T06:00:00.000Z"
 *       404:
 *         description: Short code not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get('/code/:shortCode', (req, res) => urlController.getUrlByShortCode(req, res));


/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create a shortened URL
 *     description: Generate a new shortened URL from a long URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUrlRequest'
 *     responses:
 *       201:
 *         description: URL shortened successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUrlResponse'
 *       400:
 *         description: Invalid request body or malformed URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.post('/', tokenAuth, (req, res) => urlController.createShortUrl(req, res));

/**
 * @swagger
 * /api/shorten/{id}:
 *   put:
 *     summary: Update a URL by its ID
 *     description: Update the original URL of an existing shortened URL using its MongoDB ObjectId
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []

 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the URL to update
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUrlRequest'
 *     responses:
 *       200:
 *         description: URL updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUrlResponse'
 *       400:
 *         description: Invalid request body or malformed URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: URL not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
//router.put('/:id', (req, res) => urlController.updateUrlById(req, res));
router.put('/:id', tokenAuth, (req, res) => urlController.updateUrlById(req, res));

// Update by shortCode
/**
 * @swagger
 * /api/shorten/short/{shortCode}:
 *   put:
 *     summary: Update a URL by its short code
 *     description: Update the original URL of an existing shortened URL using its short code
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []

 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The short code of the URL to update
 *         example: "abc123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUrlRequest'
 *     responses:
 *       200:
 *         description: URL updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUrlResponse'
 *       400:
 *         description: Invalid request body or malformed URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Short code not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
//router.put('/short/:shortCode', (req, res) => urlController.updateUrlByShortCode(req, res));
router.put('/short/:shortCode', tokenAuth, (req, res) => urlController.updateUrlByShortCode(req, res));
/**
 * @swagger
 * /api/shorten/{id}:
 *   delete:
 *     summary: Delete a URL by its ID
 *     description: Remove a shortened URL from the system using its MongoDB ObjectId
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []

 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the URL to delete
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: URL deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteUrlResponse'
 *       404:
 *         description: URL not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
//router.delete('/:id', (req, res) => urlController.deleteUrlById(req, res));
router.delete('/:id', tokenAuth, (req, res) => urlController.deleteUrlById(req, res));


/**
 * @swagger
 * /api/shorten/short/{shortCode}:
 *   delete:
 *     summary: Delete a URL by its short code
 *     description: Remove a shortened URL from the system using its short code
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []

 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The short code of the URL to delete
 *         example: "abc123"
 *     responses:
 *       200:
 *         description: URL deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteUrlResponse'
 *       404:
 *         description: Short code not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
//router.delete('/short/:shortCode', (req, res) => urlController.deleteUrlByShortCode(req, res));
router.delete('/short/:shortCode', tokenAuth, (req, res) => urlController.deleteUrlByShortCode(req, res));

/**
 * @swagger
 * /api/shorten/redirect/{shortCode}:
 *   get:
 *     summary: Redirect to the original URL from the short code
 *     description: |
 *       Redirect to the original URL using the short code and increment the click counter.
 *       
 *       **Note:** This endpoint performs a 302 redirect. Swagger UI may show "Failed to fetch" 
 *       but the redirect works perfectly in browsers and HTTP clients.
 *       
 *       **Testing this endpoint:**
 *       1. Copy the URL and paste directly in your browser
 *       2. Use curl: `curl -L http://localhost:8080/api/shorten/redirect/{shortCode}`
 *       3. The redirect happens server-side and increments the click count
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The short code of the URL to redirect to
 *         example: "abc123"
 *     responses:
 *       302:
 *         description: |
 *           Successfully redirecting to original URL. 
 *           
 *           **Note:** Swagger UI may show "Failed to fetch" for redirect responses. 
 *           This is normal behavior - the redirect works fine in browsers.
 *         headers:
 *           Location:
 *             description: The original URL to redirect to
 *             schema:
 *               type: string
 *               example: "https://www.google.com"
 *       404:
 *         description: Short code not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/redirect/:shortCode', (req, res) => urlController.redirectToOriginal(req, res));


const { validateUserRegistration, validateUrlLogin, validateUrlCreation, validateUrlUpdate } = require('../middleware/validation');




// Apply validation middleware
 router.post('/create', validateUrlCreation, urlController.createShortUrl);
router.post('/update', validateUrlUpdate, urlController.updateUrlById);

// module.exports = router;
module.exports = router;