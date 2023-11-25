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

The service is not initialized with any data. You need to create it by yourself. To register an event you must register yourself as `organization`! If you register as `user`, you wil only able to read data and edit your profile.

### Register:

Create a new `user` by sending a POST request to `http://localhost:3030`: + `/user/registerUser` with properties: `email` and `password`. The service automatically creates a session and returns object with `accessToken` inside, that can be used for authorized requests. You can also register `Organization` by sending a POST request to `http://localhost:3030:` + `/organization/registerOrganization` with properties: `name`, `email`, `managerFirstName`, `managerLastName`, `phone`, `region`, `password`. The service automatically creates a session and returns object with `accessToken` inside, that can be used for authorized requests.

### Login:

Login by sending a POST request with `email` and `password` to `http://localhost:3030` + `/user/loginUser` or `/organization/loginOrganization`. The service will respond with object with details containing a standard `accessToken`, that can be used for authorized requests.

### Logout:

TODO: Add info about `logout` when is done on the Back-End!

### Authorized Requests:

To make an authorized request, add the following header, where {token} is the `accessToken`, returned by the service upon successful login or registration: `X-Authorization: {token}`

### Read:

Send a `GET` request to the endpoint. The response will be in JSON format.
Examples: `http://localhost:3030` + `/event`
Retrieve everything inside the `events` collection:

-   **Method:** `GET`
-   **Endpont:** `/event`

Retrieve entry with ID: `654651caf696083cab72ab1c` from the events collection:

-   **Method:** `GET`
-   **Endpont:** `/event/654651caf696083cab72ab1c`

Retrieve entries by `category` from the events collection:

-   **Method:** `GET`
-   **Endpont:** `/event/:category`

If you want to use pagination provide `page` and `limit` options to the queryString, the service automatically limits the result based on `limit` entries.
Append `page={n}&limit={n}` to the query parameters, where {page} is the number of entries to skip and {limit} is the number of entries to return.
Example: To take the third page from the events collection, assuming 5 entries per page (entries 11 to 15):

-   **Method:** GET
-   **Endpoint:** `/event/?page=3&limit=5`

### Create:

Send a `POST` request to the endpoint. The shape of the body is restricted. The service will respond with the object, created in the DB, which will have an added ` _id` property, that is automatically generated.
Examples: `http://localhost:3030/event` +
Create a new entry inside the `events` collection:

-   **Method:** `POST`
-   **Endpont:** `/event`
    Headers: Content-Type: application/json
    `X-Authorization: {token}`
    Body: JSON-formatted data

### Update:

This requests requires authorization and content-type: `application/json`. Only owner of the resource and `admin` can edit it. Admin can change `isDeleted`, `creator`and `likes` properties, while owner can't change them.
Send a PUT request to the endpoint, appending the Id or any appropriate property name. The existing resource will be fully replaced! The service will respond with the updated object.

Examples:
Update entry with ID `654651caf696083cab72ab1c` in the `events` collection:

-   **Method:** `PUT`
-   **Endpont:** `/event/654651caf696083cab72ab1c`
    Headers: `Content-Type: application/json`
    Body: JSON-formatted data

`Users` and `Organizations` also can update ther properties.

Examples on `Users` collection:
Update entries with ID `:id` in the `Users` collection:

-   **Method:** `PUT`

-   **Endpont:** `/editUserInfo/:id`
    Headers: `Content-Type: application/json`
    Body: JSON-formatted data
    Changes: Only optional data of User(firstName, lastName, region). Admin can change also "isDeleted" and "role" property.

-   **Endpont:** `/editUserEmail/:id`
    Headers: `Content-Type: application/json`
    Body: JSON-formatted data
    Changes: Admin and User itself can change the email.

-   **Endpont:** `/editUserPassword/:id`
    Headers: `Content-Type: application/json`
    Body: JSON-formatted data
    Changes: Admin and User itself can change password.
    To fulfill the request, the user must send the old password, a new password and a repetition of the new password. The administrator must send a new password and repetition the new password.

Examples on `Organizations` collection:
Update entry with ID `:id` in the `Organizations` collection:

-   **Method:** `PUT`

-   **Endpont:** `/editOrganizationInfo/:id`
    Headers: `Content-Type: application/json`
    Body: JSON-formatted data
    Changes: Only optional data of Organization(name, managerFirstName, managerLastName, phone,region, address). Admin can change also "isDeleted" property.

-   **Endpont:** `/editOrganizationEmail/:id`
    Headers: `Content-Type: application/json`
    Body: JSON-formatted data
    Changes: Admin and Organization itself can change the email.

-   **Endpont:** `/editOrganizationPassword/:id`
    Headers: `Content-Type: application/json`
    Body: JSON-formatted data
    Changes: Admin and Organization itself can change password.
    To fulfill the request, the Organization must send the old password, a new password and a repetition of the new password. The administrator must send a new password and repetition the new password.

<!-- ### Update: -->
<!-- TODO: add documentation for like functionality -->
