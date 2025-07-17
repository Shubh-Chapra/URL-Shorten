# Universal URL Shortener & App Linking Platform

A modular, scalable backend platform for shortening URLs and seamlessly redirecting users to app-specific destinations using secure, token-based authentication and deep linking. Built with Node.js, Express, MongoDB, and Redis.

---

## Table of Contents

* [Overview](#overview)
* [Architecture Highlights](#architecture-highlights)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Authentication & Authorization](#authentication--authorization)
* [Data Validation](#data-validation)
* [Swagger API Docs](#swagger-api-docs)
* [Database Schemas](#database-schemas)
* [Folder Structure](#folder-structure)
* [Setting Up Locally](#setting-up-locally)
* [Sample Payloads & Test Cases](#sample-payloads--test-cases)
* [Error Handling](#error-handling)

---

## Overview

This backend service enables registered applications to:

*  Generate short, memorable links for deep linking
*  Redirect users to native app routes using base URLs
*  Secure endpoints using token-based authentication
*  Allow updates/deletion of URLs with ownership validation
*  View interactive Swagger documentation
*  Validate request payloads via DTOs

It’s designed with modern backend patterns and modular architecture to scale efficiently.

---

## Architecture Highlights

* **Clean MVC Design**
* **MongoDB** for persistent URL and app storage
* **Redis** support for caching and faster redirect resolution
* **Swagger (OpenAPI 3)** integrated at `/api-docs`
* **DTO + Middleware** for structured validation and error handling
* **Token-based App Auth** for secure operations

---

## Features

| Feature                | Description                                          |
| ---------------------- | ---------------------------------------------------- |
|  Short URL generation | Random/custom codes                                  |
|  App-based redirects | Uses `base_url` of registered app                    |
|  Token-based auth    | Each app receives a unique token                     |
|  Expiration supported | Set TTL for temporary links                          |
|  Metadata storage    | Attach `entity_id`, `entity_type`, `user_code`, etc. |
|  Update/delete logic | Validated using app ownership                        |
|  Swagger interface   | Developer-friendly API playground                    |

---

## Tech Stack

| Layer      | Tech                    |
| ---------- | ----------------------- |
| Backend    | Node.js + Express       |
| DB         | MongoDB                 |
| Caching    | Redis        |
| Validation | Joi DTO Middleware      |
| Auth       | Bearer Token            |
| Docs       | Swagger / OpenAPI       |
| Dev Tools  | Nodemon, Dotenv, ESLint |

---

## Authentication & Authorization

All protected endpoints require a valid app token:

```
Authorization: Bearer <your-app-token>
```

* Each registered app is issued a **unique token**
* The token maps requests to a specific `app_id`
* Update/Delete actions require matching `app_id`

---

## Data Validation

Implemented via DTO middleware:

* Ensures correct types (e.g. `extra_params` must be an object)
* Prevents missing/invalid data
* Follows consistent structure across endpoints

Sample Error:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "error": "\"entity_type\" is required"
}
```

---

## Swagger API Docs

Interactive API documentation available at:

```
http://localhost:8080/api-docs
```

Includes:

* Parameter descriptions
* Response examples
* Try-it-out console
* Auth headers integration

---

## Database Schemas

###  App Schema (`models/App.js`)

```js
{
  name: String,        // e.g. 'Docquity'
  base_url: String,    // e.g. 'https://docquity.com'
  token: String,       // Auto-generated and unique
  created_at: Date
}
```

---

###  ShortUrl Schema (`models/ShortUrl.js`)

```js
{
  app_id: ObjectId,         // Ref to App
  short_code: String,       // Unique key
  user_code: String,        // e.g. creator ID/email
  entity_type: String,      // e.g. 'user', 'campaign'
  entity_id: String,        // Entity reference (like AUD123)
  extra_params: Object,     // Custom query metadata
  expiration_date: Date,    // Optional TTL
  update_flag: Boolean,     // Set to true if modified
  created_at: Date
}
```

---

###  User Schema (`models/User.js`)

This can be added later for multi-user dashboard:

```js
{
  username: String,
  email: String
}
```

---

## Folder Structure

```
.
├── controllers/          # Route handlers
├── services/             # Business logic
├── repositories/         # DB queries
├── models/               # Mongoose schemas
├── routes/               # Route definitions
├── middlewares/          # Auth, DTO, Error handling
├── utils/                # Generators, helpers
├── docs/                 # Swagger config
├── .env                  # Env variables
├── index.js              # Entry point
└── README.md
```

---

## Setting Up Locally

### 1. Prerequisites

* Node.js v18+
* MongoDB
* Redis (optional, for caching)

### 2. Clone and Install

```bash
git clone https://github.com/Godssidekick1/Docquity.git
cd Docquity
npm install
```

### 3. Configure Environment

`.env`

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/urlshortener
REDIS_URL=redis://localhost:6379
```

### 4. Start the App

```bash
node index.js
```

### 5. Check Swagger Docs

```bash
http://localhost:8080/api-docs
```

---

## Sample Payloads & Test Cases

###  App Registration

```bash
curl -X POST http://localhost:8080/api/app/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Practo", "base_url": "https://www.practo.com"}'
```

###  Create Short URL

```bash
curl -X POST http://localhost:8080/api/shorten \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "short_code": "vid2025",
    "entity_type": "video",
    "entity_id": "VID025",
    "user_code": "user@abc",
    "extra_params": { "ref": "yt", "utm": "summer" }
  }'
```

###  Get URL Metadata

```bash
curl http://localhost:8080/api/shorten/code/vid2025
```

### Redirect

```bash
curl -i http://localhost:8080/urls/redirect/vid2025
```

---

## Error Handling

Unified error structure:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Short code not found",
  "error": "No matching URL in DB"
}
```

Common errors:

* `400`: Bad DTO / missing fields
* `403`: Unauthorized app
* `404`: Not found (invalid short code)
* `409`: Conflict (duplicate short code)

---


