/**
 * @swagger
 * /events/register:
 *   post:
 *     summary: Register Event
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
 *              categories: ["Драг", Дрифт]
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

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Required `id` of the event to update
 *         type: string
 *     summary: Update Event
 *     description: Important! Event here is not returned by the data!
 *          In order to properly edit event check the data in hardcoded event.
 *          The shape of the body is restricted.
 *          The service will respond with the object, edited in the DB,
 *          In this event example only needed fields are provided for editing it.
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
 *              categories: ["Драг", Дрифт]
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
 * /events/deleteRestoreEvent/{id}:
 *   put:
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Required `id` of the event to delete/restore
 *         type: string
 *     summary: Delete/Restore Event
 *     description: Delete event, event's `isDeleted` property can be changed only to true,
 *      by admin and owner only! If event is deleted `isApproved` property will be changed
 *      to false. Event also can be restored only by active admin.
 *     tags:
 *       - Event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isDeleted:
 *                 type: string
 *             example:
 *              isDeleted: false
 *     responses:
 *       200:
 *         description: Successful message.
 *       400:
 *         description: Error message.
 */

/**
 * @swagger
 * /events/approveDisapproveEvent/{id}:
 *   put:
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Required `id` of the event to approve/disapprove
 *         type: string
 *     summary: Approve/Disapprove Event
 *     description: Approve event, event's `isApproved` property can be changed,
 *       by active admin only! Admins can change the property to true or false. Whenever
 *       they decide
 *     tags:
 *       - Event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isApproved:
 *                 type: string
 *             example:
 *              isApproved: false
 *     responses:
 *       200:
 *         description: Successful message.
 *       400:
 *         description: Error message.
 */

/**
 * @swagger
 * /events/like/{id}:
 *   post:
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Required `id` of the event to be liked/unliked
 *         type: string
 *     summary: Like/Unlike Event
 *     description: Like event, event's `likes` property is changind when you like event user's
 *       ID is set to the array with likes on the event, if user unlike the event the ID
 *       is removed from the array.
 *     tags:
 *       - Event
 *     responses:
 *       200:
 *         description: Successful message.
 *       400:
 *         description: Error message.
 */

/**
 * @swagger
 * /events/month/{year}/{month}:
 *   get:
 *     parameters:
 *       - name: year
 *         in: path
 *         description: Required `year` of the events to be found
 *         type: string
 *       - name: month
 *         in: path
 *         description: Required `month` of the events to be found
 *         type: string
 *     summary: Events by month
 *     description: Find events by month, you need to provide the year and month
 *       in format `2024` for year and `01` - `12` for month.
 *     tags:
 *       - Event
 *     responses:
 *       200:
 *         description: Array with events.
 *       400:
 *         description: Error message.
 */