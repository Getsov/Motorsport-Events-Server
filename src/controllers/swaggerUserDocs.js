/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register user.
 *     description: Create a new user. If you register as admin, you need to pass "role". If you register as organizator you need to add to request role, organizatorName, phone. The service automatically creates a session and returns object with accessToken inside, that can be used for authorized requests. Admins and organizаtors will be active after approval by active admin.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: email for registration
 *         schema:
 *         type: string
 *
 *       - in: path
 *         name: password
 *         required: true
 *         description: password for registration
 *         schema:
 *         type: string
 * 
 *       - in: path
 *         name: repassword
 *         required: true
 *         description: repetition of password
 *         schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Details of the user.
 *       404:
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
 *                email: example@abv.bg
 *                password: "123456"
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
 * /editUserEmail/{id}:
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
 * /editUserPassword/{id}:
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
 * /editUserRole/{id}:
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
 * /editDeleted/{id}:
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
 * /getUserById/{id}:
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
 * /getMyEvents:
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
 * /getMyFavourites:
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
 * /organizersForApproval:
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
 * /allOrganizers:
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
 * /allRegularUsers:
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
 * /allAdmins:
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
 * /allUsers:
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
 * /resetPassword:
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