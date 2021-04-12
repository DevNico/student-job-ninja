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
    ```/ss21-js-backend/firebase-admin-credentials.json```

-  First Step: 
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

### Directory:
```bash
 ├── Dockerfile #For dockerizing the nest app
 ├── local-db/ # Contains a docker-compose -> runs a mongoDB service
 │  └──── docker-compose.yml
 ├── src/
 |  |   # Entrypoints equal for students and companies (e.g. login)
 │  ├── app.controller.ts 
 |  |   # Root Module contains imports of available modules
 │  ├── app.module.ts
 |  |   # Db operations equal for multiple entities
 │  ├── shared-data-access.service.ts    
 │  └── common/ #MODULES /SERVIES used in multiple modules 
 │  │  └──── auth/ # Firebase auth guard and strategy for jwt encoding
 │  │  └──── mailer/ #TODO mailing service
 │  └── config/ #Future: directiory for more complex configurations
 │  │  └──── enviroment.ts
 │  ├── main.ts # Starts the server
 │  └── modules/ # Grouped M/C/S sets
 │  │  └──── companies/
 │  │  │  ├──── companies.controller.ts # API endpoints (REST)
 │  │  │  ├──── companies.module.ts # binds C/S and additional module (DI)
 │  │  │  └──── companies.service.ts # backend logic (DB client)
 │  │  └──── students/
 │  │     ├──── students.controller.ts
 │  │     ├──── students.module.ts
 │  │     └──── students.service.ts
 │  └── providers/
 │     ├──── mongodb/
 │     |  └──── mongo.module.ts #Client module for mongoDB
 │     └──── firebase/
 │        └──── firebase-admin.module.ts #Global firebase app initialisation
 │
 ├── tsconfig.build.json
 └── tsconfig.json
```

## Hosting structure
- ``coming soon``

## endpoints ( SWAGGER AVAILABLE -> /api)

- GET /user/me: returns the currently logged in user
- POST /students/signup: signup endpoint for a new student
- POST /companies/signup: signup endpoint for a new company

-----
## Firebase Auth
<center><img src="https://docs.nestjs.com/assets/Guards_1.png"></center>

### Authentification flow
1. Requests for Endpoints secured by AuthGuard get checked for token in header
    - ``-H 'Authorization: Bearer eyJhbG...``
  (throws notAuthorized if N/a)
2. In case Token is available the validate Method of FirebaseAuthStrategy extracts it and tries to validate and decode token by using the firebase admin

3. After validation the token payload will be chained to the Request object and is reachable with the user key ``req.user``

## Mail Module
- Technologies: 
  - @nest-modules/mailer for connecting to provider and send mails
  - Handlebars as template engine for replacing text and url in email

### Configuration
- Class with configuation: ``mail-config.service.ts`` (mailConfigService)
- Initialise mailer in root ``app.module.ts``
  ```typescript
  MailerModule.forRootAsync({
      useClass: MailConfigService,
  }),
  ```
- Use MailModule in Students/companies service
  ```typescript
  //Import Module in student/company module
  @Module({
  imports: [MailModule],
  })

  //inject in service class via constructor
  constructor(
    private mailService: MailService,
  ) {}
  ```
### Usage example
```typescript
await this.mailService.sendJobOffer({
        to: email,
        title: 'mail title',
        url: 'accept offer url',
        text1: 'template text1',
        text2: 'template text2'
    });
```


