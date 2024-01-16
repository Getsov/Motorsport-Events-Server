/**
 * @swagger
 * /events/register:
 *   post:
 *     parameters:
 *       - name: x-authorization
 *         in: header
 *         description: JWT token needed for the request
 *         required: true
 *         type: string
 *     summary: Register Event.
 *     description: Important!
 *          Event must be approved to be seen from other users than owner and admin!
 *          The shape of the body is restricted. 
 *          The service will respond with the object, created in the DB, which will have an added
 *          ` _id` property, that is automatically generated.
 *          In this event example only needed fields are provided for creating it.
 *     tags:
 *       - Event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shortTitle:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               dates:
 *                 type: array
 *               contacts:
 *                 type: object
 *               categories:
 *                 type: array
 *               visitorPrices:
 *                 type: array
 *             example:
 *              shortTitle: Hissar Motocross
 *              shortDescription: Motocross in Hissar..
 *              dates: [{
 *                  "date": "2024-12-25",
 *                  "startTime": "10:59",
 *                  "endTime": "22:40"
 *              }]
 *              contacts: {
 *                  "coordinates": {
 *                       "lat": "42.52911093579847",
 *                       "lng": "24.707900125838766"
 *                   },
 *                  "region": "Пловдив",
 *                  "address": "Хайдут Генчо N1",
 *                  "phone": "0123456789",
 *                  "email": "peter@abv.bg"
 *              }
 *              categories: ["Драг"]
 *              visitorPrices: [
 *                  {
 *                      "price": 15,
 *                      "description": "Цена за зрители"
 *                  }
 *              ]                       
 *     responses:
 *       200:
 *         description: Details of the Event.
 *       400:
 *         description: Event not found.
 */

/**
 * @swagger
 * /events/eventsForApproval:
 *   get:
 *     parameters:
 *       - name: x-authorization
 *         in: header
 *         description: JWT token needed for the request
 *         required: true
 *         type: string
 *     summary: Events waiting for approval.
 *     description: Retrieve all events waiting for approval! Available only for active and approved admins!
 *     tags:
 *       - Event  
 *     responses:
 *       200:
 *         description: Details of the Events.
 *       400:
 *         description: Events not found.
 */