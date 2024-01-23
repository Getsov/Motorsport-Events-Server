/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register "regular or organizer" user
 *     description: Create a new user. The service automatically creates a session
 *       and returns object with accessToken inside, that can be used for authorized requests.
 *       If user is regular you can leave the field with empty strings unfilled. If you want to
 *       create "organizer" User, you need ti fill `role` field with `organizer` value.
 *       And all other empty fields are necessary except the `firstName` and `lastName`.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               organizatorName:
 *                 type: string
 *               role:
 *                 type: string
 *               region:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               repassword:
 *                 type: string
 *             example:
 *               email: example@abv.bg
 *               firstName: ""
 *               lastName: ""
 *               organizatorName: ""
 *               role: ""
 *               region: ""
 *               phone: ""
 *               password: "123456"
 *               repassword: "123456"
 *     responses:
 *       200:
 *         description: Details of the user.
 *       400:
 *         description: Unsuccessful request.
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login user
 *     description: Return user with access token.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: e-mail of the user
 *               password:
 *                 type: string
 *                 description: password of the user
 *             example:
 *               email: example@abv.bg
 *               password: "123456"
 *     responses:
 *       200:
 *         description: Details of the user.
 *       400:
 *         description: Unsuccessful request.
 */

/**
 * @swagger
 * /user/editUserInfo/{id}:
 *   put:
 *     summary: Update fields of user.
 *     description: Edit user by their ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         description: Required `_id` of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organizatorName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               region:
 *                 type: string
 *               phone:
 *                 type: string
 *             example:
 *               organizatorName: "Example Name"
 *               firstName: "Example"
 *               lastName: "Example"
 *               region: "Пловдив"
 *               phone: "0895344323"
 *     responses:
 *       200:
 *         description: Details of the user.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/editUserEmail/{id}:
 *   put:
 *     summary: Update email of user.
 *     description: Update user by their ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         description: Required `_id` of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organizatorName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               region:
 *                 type: string
 *               phone:
 *                 type: string
 *             example:
 *               organizatorName: "Example Name"
 *               firstName: "Example"
 *               lastName: "Example"
 *               region: "Пловдив"
 *               phone: "0895344323"
 *     responses:
 *       200:
 *         description: Details of the user.
 *       400:
 *         description: Unsuccessful operation.
 */