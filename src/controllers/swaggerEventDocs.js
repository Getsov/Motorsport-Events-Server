/**
 * @swagger
 * /event/register:
 *   post:
 *     summary: Register Event.
 *     description: Create a new Event. If you register as admin, you need to pass "role". If you register as organizator you need to add to request role, organizatorName, phone. The service automatically creates a session and returns object with accessToken inside, that can be used for authorized requests. Admins and organizаtors will be active after approval by active admin.
 *     tags:
 *       - Event
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