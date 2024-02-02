# Race Fanatic Server Documentation

## Overview

This document provides a detailed overview of the Race Fanatic REST service. This service requires MongoDB to be installed locally. For server setup, execute the following commands:
`npm install
npm start`

## Configuration

- **Authentication**: Necessary for most operations. Read operations do not require authentication.
- **Database Connection**: Add MongoDB connection string in `index.js`.
- **Swagger UI**: Access at `http://localhost:3030/swagger/`.

## CRUD Operations

### Base URL

All requests should be sent to `http://localhost:3030`.

### Endpoints

- `/event/`
- `/user/`

### Supported Methods

- `GET`
- `POST`
- `PUT`

## Authentication

### Register

`POST` `/user/register`

- Required fields: `email`, `password`, `repassword`.
- Optional for organizers: `role`, `organizatorName`, `phone`.
- Returns `accessToken`.

### Login

`POST` `/user/login`

- Required fields: `email`, `password`.
- Returns `accessToken`.

## Authorization

Add header `X-Authorization: {token}` for authorized requests.

## CRUD Operations Details

### Event Operations

#### Read Events

- `GET` `/events` - Retrieve all events.
- `GET` `/events/:id` - Retrieve specific event.
- `GET` `/events?category=x&region=y` - Filtered results.
- Pagination: `?page=n&limit=m`.

#### Create Event

- `POST` `/events/register`
- Headers: `Content-Type: application/json`, `X-Authorization: {token}`
- Body: JSON-formatted data.

#### Update Event

- `PUT` `/events/:id`
- Headers: `Content-Type: application/json`, `X-Authorization: {token}`
- Body: JSON-formatted data.

#### Event Approval/Disapproval

- `PUT` `/events/approveDisapproveEvent/:id`
- Headers: `Content-Type: application/json`, `X-Authorization: {token}`
- Body: `isApproved` boolean.

### User Operations

- Various `GET`, `PUT` endpoints like `/user/getApprovedAdmins`, `/user/allUsers`, etc., based on user role and requirements.

## Special Operations

### Like Event

- `POST` `/events/like/:id`
- Header: `X-Authorization: {token}`.

### Password Reset

- `POST` `/user/reset-password`
- Body: JSON-formatted data with `email`.

## Important Notes

- **Approval Requirement**: Viewing an event requires the event to be approved.
- **Role-Based Access**: Access to different endpoints based on user roles.
- **Swagger UI**: For interactive API documentation and testing.

## Conclusion

This document provides guidelines for interacting with the Race Fanatic REST service. Refer to Swagger UI for additional queries and interactive exploration.
