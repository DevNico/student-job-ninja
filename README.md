# ss21-js-backend

## Installation

```bash
$ npm install
```

## Running the app with local mongoDB

- Requirements: 
  1. working docker on local machine
  2. set custom configuration -> remove the .template ending of .env file (Root directory)

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
 └── local-db/ # Contains a docker-compose -> runs a mongoDB service
 │  └──── docker-compose.yml
 └── src/
 │  ├── app.controller.ts # - Root M/C/S -> entry point for modules
 │  ├── app.module.ts     # -|
 │  ├── app.service.ts    # -|
 │  └── common/ #MODULES /SERVIES used in multiple modules 
 │  │  └──── auth/ #TODO Firebase auth
 │  │  └──── mailer/ #TODO mailing service
 │  └── config/ #Future: directiory for more complex configurations
 │  │  └──── enviroment.ts
 │  ├── main.ts # Starts the server
 │  └── models/ # Grouped M/C/S sets
 │  │  └──── companies/
 │  │  │  ├──── companies.controller.ts # API endpoints (REST)
 │  │  │  ├──── companies.module.ts # binds C/S and additional module (DI)
 │  │  │  └──── companies.service.ts # backend logic (DB client)
 │  │  └──── students/
 │  │     ├──── students.controller.ts
 │  │     ├──── students.module.ts
 │  │     └──── students.service.ts
 │  └── providers/
 │     └──── mongodb/
 │        └──── mongo.module.ts #Client module for mongoDB
 │
 ├── tsconfig.build.json
 └── tsconfig.json
```

## Hosting structure
- ``coming soon``