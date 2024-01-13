/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register "regular" user
 *     description: Create a new user. If you register as admin, you need to pass "role". If you register as organizator you need to add to request role, organizatorName, phone. The service automatically creates a session and returns object with accessToken inside, that can be used for authorized requests. Admins and organizаtors will be active after approval by active admin.
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
 *               password: "123456"
 *               repassword: "123456"
 *     responses:
 *       200:
 *         description: Details of the user.
 *       400:
 *         description: User not found.
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
 *         description: User not found.
 */

/**
 * @swagger
 * /user/editUserInfo/{id}:
 *   put:
 *     summary: Registry of user.
 *     description: Retrieve a user by their ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the user.
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /user/editUserEmail/{id}:
 *   put:
 *     summary: Registry of user.
 *     description: Retrieve a user by their ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the user.
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /user/editUserPassword/{id}:
 *   put:
 *     summary: Registry of user.
 *     description: Retrieve a user by their ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the user.
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /user/editUserRole/{id}:
 *   put:
 *     summary: Registry of user.
 *     description: Retrieve a user by their ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the user.
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /user/editDeleted/{id}:
 *   put:
 *     summary: Registry of user.
 *     description: Retrieve a user by their ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the user.
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /user/getUserById/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a user by their ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the user.
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /user/getMyEvents:
 *   get:
 *     summary: Registry of user.
 *     description: Retrieve a user by their ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the user.
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /user/getMyFavourites:
 *   get:
 *     summary: Registry of user.
 *     description: Retrieve a user by their ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the user.
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /user/organizersForApproval:
 *   get:
 *     summary: Registry of user.
 *     description: Retrieve a user by their ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the user.
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /user/allOrganizers:
 *   get:
 *     summary: Registry of user.
 *     description: Retrieve a user by their ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the user.
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /user/allRegularUsers:
 *   get:
 *     summary: Registry of user.
 *     description: Retrieve a user by their ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the user.
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /user/allAdmins:
 *   get:
 *     summary: Registry of user.
 *     description: Retrieve a user by their ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the user.
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /user/allUsers:
 *   get:
 *     summary: Registry of user.
 *     description: Retrieve a user by their ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the user.
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /user/resetPassword:
 *   post:
 *     summary: Registry of user.
 *     description: Retrieve a user by their ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the user.
 *       404:
 *         description: User not found.
 */