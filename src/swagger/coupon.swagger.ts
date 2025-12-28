/**
 * @openapi
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the coupon
 *         code:
 *           type: string
 *           description: The unique code of the coupon
 *         discount:
 *           type: integer
 *           description: The discount value
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           description: The expiry date of the coupon
 *         type:
 *           type: string
 *           description: The type of coupon
 *         discountType:
 *           type: string
 *           enum: [PERCENTAGE, AMOUNT]
 *           default: PERCENTAGE
 *           description: The type of discount
 *         usageLimit:
 *           type: integer
 *           description: Max usage limit
 *         details:
 *           type: object
 *           description: Additional details (JSON)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - code
 *         - discount
 *         - expiryDate
 *         - type
 *         - usageLimit
 */

/**
 * @openapi
 * /api/v1/coupons:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discount
 *               - expiryDate
 *               - type
 *               - usageLimit
 *             properties:
 *               code:
 *                 type: string
 *               discount:
 *                 type: integer
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *               type:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [PERCENTAGE, AMOUNT]
 *               usageLimit:
 *                 type: integer
 *               details:
 *                 type: object
 *     responses:
 *       201:
 *         description: The coupon was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *       409:
 *         description: Coupon code already exists
 *       500:
 *         description: Some server error
 *   get:
 *     summary: Returns the list of all coupons
 *     tags: [Coupons]
 *     responses:
 *       200:
 *         description: The list of the coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Coupon'
 *
 * /api/v1/coupons/{code}:
 *   get:
 *     summary: Get a coupon by code
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: The coupon code
 *     responses:
 *       200:
 *         description: The coupon description by code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *       404:
 *         description: The coupon was not found
 */
