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
 *     description: Update user email by their ID. Only user who is owner and admin can change email field.
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
 *               email:
 *                 type: string
 *             example:
 *               email: "example@abv.bg"
 *     responses:
 *       200:
 *         description: Details of the user.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/editUserPassword/{id}:
 *   put:
 *     summary: Update password of user.
 *     description: Update user password by their ID. Only user who is owner and admin can change password field.
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
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               newRepassword:
 *                 type: string
 *             example:
 *               oldPassword: "123456"
 *               newPassword: "1234567"
 *               newRepassword: "1234567"
 *     responses:
 *       200:
 *         description: Details of the user.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/editUserRole/{id}:
 *   put:
 *     summary: Update role of user.
 *     description: Update user role by their ID. Only user who is admin can change role field.
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
 *               role:
 *                 type: string
 *             example:
 *               role: "organizer"
 *     responses:
 *       200:
 *         description: Details of the user.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/deleteRestoreUser/{id}:
 *   put:
 *     summary: Delete/Restore user.
 *     description: Update user isDeleted property by their ID. Only user who is admin can change isDeleted field.
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
 *               isDeleted:
 *                 type: boolean
 *             example:
 *               isDeleted: false
 *     responses:
 *       200:
 *         description: Details of the user.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/deleteRestoreUsers:
 *   put:
 *     summary: Delete/Restore users.
 *     description: Update users isDeleted property by their ID. Only user who is admin can change isDeleted field.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isDeleted:
 *                 type: boolean
 *               listOfUsers:
 *                 type: array
 *             example:
 *               isDeleted: false
 *               listOfUsers: [userId, userId]
 *     responses:
 *       200:
 *         description: Details of the user.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/getUserById/{id}:
 *   get:
 *     summary: Certain user.
 *     description: Retrieve a certain user from the `users` collection.
 *      Only active admin and owner can see requested user!
 *     tags:
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Required `id` of the user to retrieve
 *         type: string
 *     responses:
 *       200:
 *         description: Details of the user.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/approveDisapproveUser/{id}:
 *   put:
 *     summary: Approve/Disapprove user.
 *     description: Approve/Disapprove user isApproved property by their ID.
 *      Only active admin can change isApproved field.
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
 *               isApproved:
 *                 type: boolean
 *             example:
 *               isApproved: true
 *     responses:
 *       200:
 *         description: Details of the user.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/approveDisapproveUsers:
 *   put:
 *     summary: Approve/Disapprove users.
 *     description: Update users isApproved property by their ID. Only active admin can change isApproved field.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isApproved:
 *                 type: boolean
 *               listOfUsers:
 *                 type: array
 *             example:
 *               isApproved: true
 *               listOfUsers: [userId, userId]
 *     responses:
 *       200:
 *         description: Details of the user.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/getMyEvents:
 *   get:
 *     summary: Retrieve events of user.
 *     description: Retrieve all events of the logged in user.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Events of the user.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/getMyFavourites:
 *   get:
 *     summary: Retrieve favorite events of user.
 *     description: Retrieve all favorite events of the logged in user.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Events of the user.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/getApprovedAdmins:
 *   get:
 *     summary: Retrieve approved admins.
 *     description: Retrieve all approved admins only active admin can make the request.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Events of the user.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/getAllAdminsForApproval:
 *   get:
 *     summary: Retrieve all unapproved admins.
 *     description: Retrieve all unapproved admins only active admin can make the request.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Events of the user.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/getApprovedOrganizators:
 *   get:
 *     summary: Retrieve all approved organizers.
 *     description: Retrieve all approved organizers only active admin can make the request.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Events of the user.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/getAllOrganizersForApproval:
 *   get:
 *     summary: Retrieve all unapproved organizers.
 *     description: Retrieve all unapproved organizers only active admin can make the request.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Events of the user.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/allOrganizers:
 *   get:
 *     summary: Retrieve all organizers.
 *     description: Retrieve all organizers only active admin can make the request.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Events of the user.
 *       400:
 *         description: Unsuccessful operation.
 */
