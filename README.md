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

Create a new `user` by sending a POST request to `http://localhost:3030`: + `/user/register` with properties: `email`, `password`, `repassword`.If you register as admin, you need to pass `role`. If you register as organizator you need to add to request `role`, `organizatorName`, `phone`. The service automatically creates a session and returns object with `accessToken` inside, that can be used for authorized requests.
Admins and organizаtors will be active after approval by active admin.

### Login:

Login by sending a POST request with `email` and `password` to `http://localhost:3030` + `/user/login`. If the profile is approved and is not deleted, the service will respond with object with details containing a standard `accessToken`,that can be used for authorized requests.


### Authorized Requests:

To make an authorized request, add the following header, where {token} is the `accessToken`, returned by the service upon successful login or registration: `X-Authorization: {token}`

### Read:

Important!: Event must be approved to see it!

- **_Event_**:
  Send a `GET` request to the endpoint. The response will be in JSON format.
  Examples: `http://localhost:3030` + `/events`;

  Retrieve everything inside the `events` collection:
- **Method:** `GET`
- **Endpont:** `/events`

Retrieve entry with ID: `:id` from the events collection:
- **Method:** `GET`
- **Endpont:** `/events/:id`

Filter entries using multiple `category` and `region` values from the events collection:
If you want to use filtering you must provide a query string with `category`, `region` or both properties to filter entries.
- **Method:** `GET`
- **Endpont:** `/events?category=2&region=16`

If you want to use pagination provide `page` and `limit` options to the queryString, the service automatically limits the result based on `limit` entries.
Append `page={n}&limit={n}` to the query parameters, where {page} is the number of entries to skip and {limit} is the number of entries to return.
Example: To take the third page from the events collection, assuming 5 entries per page (entries 11 to 15):
- **Method:** `GET`
- **Endpoint:** `/events?page=3&limit=5`

IMPORTANT: You can use search filtering and pagination with multiple passed values, when using pagination always use `page` and `limit` properties!
- **Method:** `GET`
- **Endpoint:** `/events?page=1&limit=2&category=1&region=16&category=9&search=2`

Calendar: If you want to retrieve the data for the calendar, you must send a `GET` request.
Response will be All events according to provided year and month: `2024/1`
- **Method:** `GET`
- **Endpoint:** `/events/month/2024/1`

Upcoming Events: If you want to get upcoming events send a get request.
- **Method:** `GET`
- **Endpoint:** `/events/upcomingEvents`

Past Events: If you want to get past events send a get request.
- **Method:** `GET`
- **Endpoint:** `/events/pastEvents`

Retrieve all events waiting for approval! Available only for active and approved admins!
- **Method:** `GET`
- **Endpont:** `/events/eventsForApproval`

- **_User_**:

Retrieve all approved admins which are not deleted! Available only for active and approved admins!
- **Method:** `GET`
- **Endpont:** `/user/getApprovedAdmins`

Retrieve all admins waiting for approval which are not deleted! Available only for active and approved admins!
- **Method:** `GET`
- **Endpont:** `/user/getAllAdminsForApproval`

Retrieve all approved organizers which are not deleted! Available only for active and approved admins!
- **Method:** `GET`
- **Endpont:** `/user/getApprovedOrganizators`

Retrieve all organizers waiting for approval which are not deleted! Available only for active and approved admins!
- **Method:** `GET`
- **Endpont:** `/user/getAllOrganizersForApproval`

Retrieve all organizers! Available only for active and approved admins!
- **Method:** `GET`
- **Endpont:** `/user/allOrganizers`

Retrieve all regular users! Available only for active and approved admins!
- **Method:** `GET`
- **Endpont:** `/user/allRegularUsers`

Retrieve all admins! Available only for active and approved admins!
- **Method:** `GET`
- **Endpont:** `/user/allAdmins`

Retrieve all users! Available only for active and approved admins!
- **Method:** `GET`
- **Endpont:** `/user/allUsers`

Retrieve single user. Only admin and owner can get the requested user info.
- **Method:** `GET`
- **Endpont:** `/user/getUserById/:id`

Retrieve all events created from current user!
- **Method:** `GET`
- **Endpont:** `/user/getMyEvents`

Retrieve all events added to favourites from current user!If you want to use filtering you must provide a query string with `category`, `region` or both properties to filter entries.
- **Method:** `GET`
- **Endpont:** `/user/getMyFavourites?category=2&region=16`

### Create:

Important!: Event must be approved to see it!

    Send a `POST` request to the endpoint. The shape of the body is restricted. The service will respond with the object, created in the DB, which will have an added ` _id` property, that is automatically generated.
    Examples: `http://localhost:3030/events/register` +
    Create a new entry inside the `events` collection:

- **_Event_**:

- **Method:** `POST`
- **Endpont:** `/events/register`
  Headers: `Content-Type: application/json`
  `X-Authorization: {token}`
  Body: JSON-formatted data

### Update:

Important!: Event must be approved to see it!

This requests requires authorization and content-type: `application/json`. Only owner of the resource and `admin` can edit it. Admin can change `isDeleted`, `isApproved`, `creator` and `likes` properties, while owner can't change them.
Send a PUT request to the endpoint, appending the Id or any appropriate property name. The existing resource will be fully replaced! The service will respond with the updated object.

Examples:
Update entry with ID `654651caf696083cab72ab1c` in the `events` collection:

- **_Event_**:

Update event. Event can be changed by admin and owner only!
- **Method:** `PUT`
- **Endpont:** `/events/:id`
  Headers: `Content-Type: application/json`
  `X-Authorization: {token}`
  Body: JSON-formatted data

Delete event, event's `isDeleted` property can be changed only to true, by admin and owner only! If event is deleted `isApproved` property will be changed to false. Event also can be restored only by active admin.
Request body will expect `isDeleted` property with boolean value.
- **Method:** `PUT`
- **Endpont:** `/events/deleteRestoreEvent/:id`
  Headers: `Content-Type: application/json`
  `X-Authorization: {token}`
  Body: JSON-formatted data

Approve event, event's `isApproved` property can be changed to true or false, only admin can approve event! If event is approved, `isApproved` property will be changed to true.
Request body will expect `isApproved` property with boolean value
- **Method:** `PUT`
- **Endpont:** `/events/approveDisapproveEvent/:id`
  Headers: `Content-Type: application/json`
  `X-Authorization: {token}`
  Body: JSON-formatted data

- **_User_**:

Only optional data of User(firstName, lastName, region, organizationName, phone). Admin and User itself can change the data, but only if the requester of changes is not deleted or is approved.
- **Method:** `PUT`
- **Endpont:** `/user/editUserInfo/:id`
  Headers: `Content-Type: application/json`
  `X-Authorization: {token}`
  Body: JSON-formatted data

Admin and User itself can change the email, but only if the requester of this change is approved and not deleted.
To fulfill the request, the user must send the new email.
- **Method:** `PUT`
- **Endpont:** `/user/editUserEmail/:id`
  Headers: `Content-Type: application/json`
  `X-Authorization: {token}`
  Body: JSON-formatted data

Admin and User itself can change password, but only if the requester of this change is approved and not deleted.
To fulfill the request, the user must send the old password, a new password and a repetition of the new password. The administrator must send a new password and repetition the new password.
- **Method:** `PUT`
- **Endpont:** `/user/editUserPassword/:id`
  Headers: `Content-Type: application/json`
  `X-Authorization: {token}`
  Body: JSON-formatted data

Only the administrator who is approved and not deleted can change the role of an individual user.
To fulfill the request, the admin must send role. If new role is 'organizer', the fields 'organizatorName' and 'phone' also should be fulfilled if there was empty before update.
- **Method:** `PUT`
- **Endpont:** `/user/editUserRole/:id`
  Headers: `Content-Type: application/json`
  `X-Authorization: {token}`
  Body: JSON-formatted data

Only the administrator who is approved and not deleted can approve/disapprove an individual user.
To fulfill the request, the admin must send {"isApproved": false/true}.
- **Method:** `PUT`
- **Endpont:** `/user/approveDisapproveUser/:id`
  Headers: `Content-Type: application/json`
  `X-Authorization: {token}`
  Body: JSON-formatted data

Only the administrator who is approved and not deleted can approve/disapprove multiple users.
To fulfill the request, the admin must send {"isApproved": false/true, "listOfUsers" : [id,id]}.
- **Method:** `PUT`
- **Endpont:** `/user/approveDisapproveUsers/:id`
  Headers: `Content-Type: application/json`
  `X-Authorization: {token}`
  Body: JSON-formatted data
 
Only the administrator who is approved and not deleted can change the "isDeleted" property of an individual user.
To fulfill the request, the admin must send {"isDeleted": false/true}.
- **Method:** `PUT`
- **Endpont:** `/user/deleteRestoreUser/:id`
  Headers: `Content-Type: application/json`
  `X-Authorization: {token}`
  Body: JSON-formatted data

Only the administrator who is approved and not deleted can change the "isDeleted" property of multiple users.
To fulfill the request, the admin must send {"isDeleted": false/true, "listOfUsers" : [id,id]}.
- **Method:** `PUT`
- **Endpont:** `/user/deleteRestoreUsers`
  Headers: `Content-Type: application/json`
  `X-Authorization: {token}`
  Body: JSON-formatted data


Like-Event: Every user can like an Event. To do it, 'authorized' user must send a `POST` request with event `id`. When user liked some event, the event itself keep information about liked users and also every user keep information about events which he liked.
Example: `/events/like/:id`

- **Method:** `POST`
- **Endpont:** `/events/like/:id`

Every user can recover their password. To fulfill the request, the `user` must provide `email`. A new `password` will be send to the given email address.
- **Method:** `POST`
- **Endpont:** `/user/reset-password`
  Body: JSON-formatted data

