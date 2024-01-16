/**
 * @swagger
 * /events/register:
 *   post:
 *     parameters:
 *       - name: x-authorization
 *         in: header
 *         description: JWT token needed for the request
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
 *         type: string
 *     summary: Events waiting for approval.
 *     description: Retrieve all `events` waiting for approval! Available only for active and approved admins!
 *     tags:
 *       - Event  
 *     responses:
 *       200:
 *         description: Details of the Events.
 *       400:
 *         description: Events not found.
 */

/**
 * @swagger
 * /events/upcomingEvents:
 *   get:
 *     summary: Upcoming events
 *     description: If you want to get upcoming `events` send a get request.
 *       Only approved and not deleted events will be shown!
 *     tags:
 *       - Event  
 *     responses:
 *       200:
 *         description: Array of events or empty Array if no events in the Database.
 *       400:
 *         description: Server Error.
 */

/**
 * @swagger
 * /events/pastEvents:
 *   get:
 *     summary: Past events
 *     description: If you want to get past `events` send a get request.
 *       Only approved and not deleted events will be shown!
 *     tags:
 *       - Event  
 *     responses:
 *       200:
 *         description: Array of events or empty Array if no events in the Database.
 *       400:
 *         description: Server Error.
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: All events
 *     description: Retrieve everything inside the `events` collection.
 *       Only approved and not deleted events will be shown!
 *     tags:
 *       - Event  
 *     responses:
 *       200:
 *         description: Array of events or empty Array if no events in the Database.
 *       400:
 *         description: Server Error.
 */

/**
 * @swagger
 * /events?page=&limit=&category=&search=:
 *   get:
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Add `page` number for pagination
 *         type: integer
 *         default: 1
 *       - name: limit
 *         in: query
 *         description: Add `limit` number for pagination
 *         type: integer
 *         default: 2
 *       - name: category
 *         in: query
 *         description: Add `category` number for sorting from 1 to 16
 *         type: integer
 *         default: 2
 *       - name: search
 *         in: query
 *         description: Add `search` string for searching
 *         type: string
 *     summary: Pagination + sorting + search operations on events
 *     description: Only approved and not deleted events will appear. You can use sorting,
 *      pagination and search. For sort by categories you need to pass number values which
 *      corresponds to following category values - 1='Автокрос', 2='Драг', 3='Дрифт',
 *      4='Картинг', 5='Мото Рейс', 6=Мотокрос', 7='Офроуд', 8='Писта', 9='Планинско изкачване',
 *      10='Рали', 11='Рали Крос', 12='Рали Спринт', 13='СИМ Рейс', 14='Събори',
 *      15='Тайм Атак', 16='Други'. Here the Swagger UI do not accept array of categories
 *      in query string, however. In normal application you will be able to pass more categories..
 *     tags:
 *       - Event  
 *     responses:
 *       200:
 *         description: Array of events or empty array if no events in the Database.
 *       400:
 *         description: Server Error.
 */

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Required `id` of the event to retrieve
 *         type: string
 *     summary: Certain event
 *     description: Retrieve a certain event from the `events` collection.
 *       Only approved and not deleted event will be shown. If you are owner of event you will be
 *       able to see it if event is not approved and not deleted. If you are active admin,
 *       you will be able to see not approved and existing deleted event.
 *     tags:
 *       - Event  
 *     responses:
 *       200:
 *         description: Array of events or empty array if no events in the Database.
 *       400:
 *         description: Server Error.
 */