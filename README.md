# ss21-js-backend

## Installation

```bash
$ npm install
```

## Running the app with local mongoDB

- Requirements:

  1. working docker on local machine
  2. set custom configuration -> remove the .template ending of .env file (Root directory)
  3. Get firebase admin credentials json file from firebase console and save it to root directory as:  
     `/ss21-js-backend/firebase-admin-credentials.json`

- First Step:

  ```bash
  #Start mongoDB with docker compose
  $ npm run start:mongodb

  #After testing stop the container with
  $ npm run stop:mongodb
  ```

- Second step:

  ```bash
  # development
  $ npm run start

  # watch mode
  $ npm run start:dev

  # production mode
  $ npm run start:prod
  ```

## Project structure

- Main Modules:

  - Student Module -> handles Student specific actions (e.g. handle bookmarks)
  - Company Module -> handles Company specific actions
  - Job Module -> handles Job specific actions (e.g. search job) and Processors
  - App Module -> handles global available endpoints (e.g. user/me)

- Shared Modules:
  - MongoDb Module -> MongoDB connection and indexing
  - Mailer Module -> Sending Mails
  - Caching Module -> Redis Cache initialization and connection

## Hosting structure (Production)

- Traefik reverse Proxy with ssl configuration
- Portainer for docker management (basic auth)
- Docker-compose for the api and redis container
- Docker-compose for MongoDb and MongoExpress(MongoDB GUI client, Basic auth)

## Openapi

- Swagger OpenAPI documentation

- Available:
  - localhost:3000/api/
  - https://ss21.api.kse-dev.de/api/

---

## Firebase Auth

<center><img src="https://docs.nestjs.com/assets/Guards_1.png"></center>

### Authentification flow

1. Requests for Endpoints secured by AuthGuard get checked for token in header
   - `-H 'Authorization: Bearer eyJhbG...`
     (throws notAuthorized if N/a)
2. In case Token is available the validate Method of FirebaseAuthStrategy extracts it and tries to validate and decode token by using the firebase admin

3. After validation the token payload will be chained to the Request object and is reachable with the user key `req.user`

4. If endpoint requires **RolesGuard**: Get roles From MongoDB and append to `req.user object`

## Mail Module

- Technologies:
  - @nest-modules/mailer for connecting to provider and send mails
  - Handlebars as template engine for replacing text and url in email

## Job Handling

- Technologies:

  - @nestjs/schedule for scheduling tasks
  - @nestjs/bull queue for queue jobs with delay

- Steps a job runs through:

  1. After Create: Search for matching students
  2. if no match found: Push Job to queue with delay of one day
  3. Retry step 2 until Match found oder student requested job by himself

- Job Date validation:
  - Daily check if date of job is still valid with cron job
