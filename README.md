# 'Race Fanatic' Server-Documentation!

## Usage:

This is a REST service, created for 'Race Fanatic' APP. To properly work the server need installed mongoDB on local machine for database. Add the connection string in the `index.js` file.
To build the server, run the following commands in the terminal:
`npm install
npm start`

## Configuration:

The service are using authentication, not everything is accessible trough the DB, you need to pass credentials! Only read requests are accessible without authentication. The server is dynamicly load collections from the mongoDB if any.

## CRUD Operations:

All requests are send to: `http://localhost:3030`: /event/, /user/. Supported requests are `GET`, `POST`, `PUT`!

## Authentication:

The service is not initialized with any data. You need to create it by yourself. To register an event you must register yourself as `user` with `role`: `organizer`! If you register as `role`: `regular`, you will only able to read data and edit your profile.

### Register:

Create a new `user` by sending a POST request to `http://localhost:3030`: + `/user/register` with properties: `email`, `password`, `repassword`. If you register as organizator you need to pass `email`, `password`, `repass`, `role`, `organizatorName`, `phone`. The service automatically creates a session and returns object with `accessToken` inside, that can be used for authorized requests.

### Login:

Login by sending a POST request with `email` and `password` to `http://localhost:3030` + `/user/login`. The service will respond with object with details containing a standard `accessToken`, that can be used for authorized requests.

### Logout:

TODO: Add info about `logout` when is done on the Back-End!

### Authorized Requests:

To make an authorized request, add the following header, where {token} is the `accessToken`, returned by the service upon successful login or registration: `X-Authorization: {token}`

### Read:

-   **_Event_**:
    Send a `GET` request to the endpoint. The response will be in JSON format.
    Examples: `http://localhost:3030` + `/events`
    Retrieve everything inside the `events` collection:

-   **Method:** `GET`
-   **Endpont:** `/events`

Retrieve entry with ID: `654651caf696083cab72ab1c` from the events collection:

-   **Method:** `GET`
-   **Endpont:** `/events/654651caf696083cab72ab1c`

Filtering entries by `category` and `region` from the events collection:
If you want to use filtering you must provide a query string with `category`, `region` or both properties to filter entries.

-   **Method:** `GET`
-   **Endpont:** `/events?category=Rally&region=16`

If you want to use pagination provide `page` and `limit` options to the queryString, the service automatically limits the result based on `limit` entries.
Append `page={n}&limit={n}` to the query parameters, where {page} is the number of entries to skip and {limit} is the number of entries to return.
Example: To take the third page from the events collection, assuming 5 entries per page (entries 11 to 15):

-   **Method:** `GET`
-   **Endpoint:** `/events?page=3&limit=5`

IMPORTANT: You can use search filtering and pagination with multiple passed values, when using pagination always use `page` and `limit` properties!

-   **Method:** `GET`
-   **Endpoint:** `/events?page=1&limit=2&category=1&region=16&category=9&search=2`

Calendar: If you want to retrieve the data for the calendar, you must send a `GET` request.
Response will be All events according to provided year and month: `2024/1`
-   **Method:** `GET`
-   **Endpoint:** `/events/month/2024/1`

-   **_User_**:

-   **Method:** `GET`
-   **Endpont:** `/user/getMyEvents`

Retrieve all events created from current user!

-   **Method:** `GET`
-   **Endpont:** `/user/getMyFavourites`

Retrieve all events added to favourites from current user!

### Create:

    Send a `POST` request to the endpoint. The shape of the body is restricted. The service will respond with the object, created in the DB, which will have an added ` _id` property, that is automatically generated.
    Examples: `http://localhost:3030/events/register` +
    Create a new entry inside the `events` collection:

-   **_Event_**:

-   **Method:** `POST`
-   **Endpont:** `/events/register`
    Headers: Content-Type: application/json
    `X-Authorization: {token}`
    Body: JSON-formatted data

### Update:

This requests requires authorization and content-type: `application/json`. Only owner of the resource and `admin` can edit it. Admin can change `isDeleted`, `creator`and `likes` properties, while owner can't change them.
Send a PUT request to the endpoint, appending the Id or any appropriate property name. The existing resource will be fully replaced! The service will respond with the updated object.

Examples:
Update entry with ID `654651caf696083cab72ab1c` in the `events` collection:

-   **_Event_**:

-   **Method:** `PUT`
-   **Endpont:** `/event/654651caf696083cab72ab1c`
    Headers: `Content-Type: application/json`
    Body: JSON-formatted data

-   **_User_**:

-   **Method:** `PUT`
-   **Endpont:** `/user/editUserInfo/:id`
    Headers: `Content-Type: application/json`
    Body: JSON-formatted data
    Changes: Only optional data of User(firstName, lastName, region, organizationName, phone). Admin can change also "isDeleted" and "role" property.

-   **Method:** `PUT`
-   **Endpont:** `/user/editUserEmail/:id`
    Headers: `Content-Type: application/json`
    Body: JSON-formatted data
    Changes: Admin and User itself can change the email.

-   **Method:** `PUT`
-   **Endpont:** `/user/editUserPassword/:id`
    Headers: `Content-Type: application/json`
    Body: JSON-formatted data
    Changes: Admin and User itself can change password.
    To fulfill the request, the user must send the old password, a new password and a repetition of the new password. The administrator must send a new password and repetition the new password.

-   **Method:** `PUT`
-   **Endpont:** `/user/editUserRole/:id`
    Headers: `Content-Type: application/json`
    Body: JSON-formatted data
    Changes: Admin only can change the role of single user.
    To fulfill the request, the admin must send role. If new role is 'organizer', the fields 'organizatorName' and 'phone' also should be fulfilled if there was empty before update.

Like-Event: Every user can like an Event. To do it, 'authorized' user must send a `POST` request with event `id`. When user liked some event, the event itself keep information about liked users and also every user keep information about events which he liked.
Example: `/events/like/:id`
-   **Method:** `POST`
-   **Endpont:** `/events/like/6563804d62f4145aefcc2e01`

Password-reset: Every user can recover their password. To fulfill the request, the `user` must provide `email`. A new `password` will be send to the given email address. 
-   **Method:** `POST`
-   **Endpont:** `/user/reset-password`
    Body: JSON-formatted data