/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user (either regular or organizer) and create a session
 *      with an access token for authorized requests.
 *     description: Create a new user account, automatically generating a session
 *      and returning an object containing an accessToken. To register a regular user,
 *      leave optional fields empty. For an organizer, fill in the `role` field with the value
 *      `organizer`, and provide necessary information except for `firstName` and `lastName`.
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
 *         description: Details of the created user.
 *       400:
 *         description: Unsuccessful request.
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Log in a user and return user details with an access token.
 *     description: Authenticate a user and return user details along with an access token.
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
 *     summary: Update user fields by ID.
 *     description: Edit user information identified by their unique ID.
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
 *     summary: Update user email by ID.
 *     description: Update user email identified by their unique ID.
 *      Only the user who is the owner and admin can change the email field.
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
 *     summary: Update user password by ID.
 *     description: Update user password identified by their unique ID.
 *      Only the user who is the owner and admin can change the password field.
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
 *     summary: Update user role by ID.
 *     description: Update user role identified by their unique ID.
 *      Only the user who is an admin can change the role field.
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
 *     description: Update user `isDeleted` property by their ID.
 *      Only the user who is an admin can change the `isDeleted` field.
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
 *     description: Update users `isDeleted` property by their ID.
 *      Only the user who is an admin can change the `isDeleted` field.
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
 *         description: Details of the users.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/getUserById/{id}:
 *   get:
 *     summary: Retrieve a certain user.
 *     description: Retrieve details of a certain user from the `users` collection.
 *      Only active admin and owner can see the requested user.
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
 *     description: Approve/Disapprove user `isApproved` property by their ID.
 *      Only active admin can change `isApproved` field.
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
 *     description: Update users `isApproved` property by their ID.
 *      Only active admin can change `isApproved` field.
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
 *         description: Details of the users.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/getMyEvents:
 *   get:
 *     summary: Retrieve events of user.
 *     description: Retrieve all events of the logged-in user.
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
 *     description: Retrieve all favorite events of the logged-in user.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Favorite events of the user.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/getApprovedAdmins:
 *   get:
 *     summary: Retrieve approved admins.
 *     description: Retrieve all approved admins, only an active admin can make the request.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: All approved admins.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/getAllAdminsForApproval:
 *   get:
 *     summary: Retrieve all unapproved admins.
 *     description: Retrieve all unapproved admins, only an active admin can make the request.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: All admins for approval.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/getApprovedOrganizators:
 *   get:
 *     summary: Retrieve all approved organizers.
 *     description: Retrieve all approved organizers, only an active admin can make the request.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: All approved organizers.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/getAllOrganizersForApproval:
 *   get:
 *     summary: Retrieve all unapproved organizers.
 *     description: Retrieve all unapproved organizers, only an active admin can make the request.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: All unapproved organizers.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/allOrganizers:
 *   get:
 *     summary: Retrieve all organizers.
 *     description: Retrieve all organizers, only an active admin can make the request.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: All organizers.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/allRegularUsers:
 *   get:
 *     summary: Retrieve all regular users.
 *     description: Retrieve all regular users, only an active admin can make the request.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Regular users.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/allAdmins:
 *   get:
 *     summary: Retrieve all admin users.
 *     description: Retrieve all admin users, only an active admin can make the request.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Found admins.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/allUsers:
 *   get:
 *     summary: Retrieve all users.
 *     description: Retrieve all users, only an active admin can make the request.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Found users.
 *       400:
 *         description: Unsuccessful operation.
 */

/**
 * @swagger
 * /user/resetPassword:
 *   post:
 *     summary: Request Password Reset
 *     description: Initiates the process to reset the password for a user
 *      associated with the provided email address.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *             example:
 *               to: example@abv.bg
 *     responses:
 *       200:
 *         description: Successful message.
 *       400:
 *         description: Unsuccessful operation.
 */