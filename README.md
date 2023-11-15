# Race Fanatics-App Documentation!

## Usage: 
This is a REST service, created for 'Race Fanatics' APP. To properly work the server need installed mongoDB on local machine for database. Add the connection string in the `index.js` file.
To build the server, run the following commands in the terminal:
```
npm install
npm start
```
## Configuration:
The service are using authentication, not everything is accessible trough the DB, you need to pass credentials! Only read requests are accessible without authentication. The server is dynamicly load collections from the mongoDB if any.

##CRUD Operations:
All requestsa re send to: `http://localhost:3030`: /events/,  /user/, /organization/. Supported requests are `GET`, `POST`, `PUT`, `DELETE`. Only user with role "`admin`" can delete!

## Authentication:
The service is not initialized with any data. You need to create it by yourself.

Register:
Create a new "user" by sending a POST request to "http://localhost:3030:" + "/user/registerUser" with properties: "email" and "password". The service automatically creates a session and returns object with "accessToken" inside, that can be used for authorized requests. You can also register "Organization" by sending a POST request to "http://localhost:3030:" + "/organization/registerOrganization" with properties: "name", "email", "managerFirstName", "managerLastName", "phone", "region", "password". The service automatically creates a session and returns object with "accessToken" inside, that can be used for authorized requests.

Login:
Login by sending a POST request with "email" and "password" to "http://localhost:3030:" +  "/user/loginUser" or "/organization/loginOrganization". The service will respond with object with details containing a standard "accessToken", that can be used for authorized requests.

Logout:
TODO: Add info about "logout" when is done on the Back-End!

Authorized Requests:
To make an authorized request, add the following header, where {token} is the "accessToken", returned by the service upon successful login or registration: "X-Authorization: {token}"
