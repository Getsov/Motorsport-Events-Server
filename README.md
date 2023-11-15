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
