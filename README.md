<!-- JavaScript,HTML,CSS,Handlebars,Express,NodeJS,PostgreSQL -->

# Fitsta

A full-stack meal-kit ordering website built with Node.js, Express and PostgreSQL. Customers can browse meal packages and manage their account, while data clerks get an admin dashboard to create, edit and delete packages.

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Handlebars](https://img.shields.io/badge/Handlebars-F0772B?logo=handlebarsdotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)

![Screenshot 1](https://github.com/alisedighmoghadam/Fitsta/blob/main/screenshots/1.png?raw=true)
![Screenshot 2](https://github.com/alisedighmoghadam/Fitsta/blob/main/screenshots/2.png?raw=true)
![Screenshot 3](https://github.com/alisedighmoghadam/Fitsta/blob/main/screenshots/3.png?raw=true)

## Features

- **Meal packages** – listing page rendered server-side with Handlebars from the database.
- **Accounts** – registration and login, with passwords hashed using `bcryptjs`.
- **Sessions** – encrypted cookie sessions (`client-sessions`) with a short expiry; protected routes redirect to login.
- **Role-based dashboards** – customers land on their dashboard; data clerks land on an admin panel.
- **Admin CRUD** – clerks can add, update and delete meal packages, including image uploads handled by `multer`.
- **Client-side validation** – registration and login forms are validated before submission.

## Tech stack

| Layer | Tools |
| --- | --- |
| Server | Node.js, Express 4 |
| Views | Handlebars (`express-handlebars`), HTML, CSS |
| Data | PostgreSQL, Sequelize ORM |
| Auth | bcryptjs, client-sessions |
| Uploads | multer |

## Getting started

### Requirements

- Node.js 14+
- A PostgreSQL database

### Setup

```bash
git clone https://github.com/alisedighmoghadam/Fitsta.git
cd Fitsta
npm install
```

Point the Sequelize connection at the top of `server.js` to your PostgreSQL database, then start the server:

```bash
node server.js     # http://localhost:8080
```

Sequelize creates the `User` and `package` tables on first run.

## Project structure

```
├── server.js          # Express app, routes, Sequelize models
├── views/             # Handlebars templates (meal packs, login, dashboard, admin)
├── validations/       # Client-side form validation
├── styles/            # CSS
├── imgs/              # Package and site images
├── home.html
└── RegistrationPage.html
```

## About

Designed and developed as a course project for WEB322 at Seneca College. The original Heroku deployment has been retired.
