# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. You'll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## Description

This is a RESTful API backend server for the WTWR (What to Wear?) application. The server provides endpoints for user authentication, user profile management, and clothing item management. Users can create accounts, log in, update their profiles, create clothing items, like/unlike items, and delete their own items.

## Technologies and Techniques Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework for Node.js
- **MongoDB** - NoSQL database for storing user and clothing item data
- **Mongoose** - MongoDB object modeling tool
- **JWT (JSON Web Tokens)** - For user authentication and authorization
- **bcryptjs** - For password hashing
- **Celebrate** - Request validation middleware using Joi
- **Validator** - For email and URL validation
- **Winston** - For logging requests and errors
- **CORS** - Cross-origin resource sharing middleware
- **ESLint** - Code linting with Airbnb configuration
- **Prettier** - Code formatting

## Features

- User registration and authentication
- JWT-based authorization
- User profile management (update name and avatar)
- Clothing item CRUD operations
- Like/unlike functionality for clothing items
- Centralized error handling
- Request and error logging
- Input validation using Celebrate
- Password hashing for security

## Running the Project

`npm run start` — to launch the server on localhost:3001

`npm run dev` — to launch the server on localhost:3001 with hot reload enabled

`npm run lint` — to run the linter from the command line

### Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12

## Screenshots and Demo

Check out this video (https://drive.google.com/file/d/1A2FPT52qKKYhKdmZc3IVhaY5ulXLbEsX/view?usp=sharing), where I describe my project and some challenges I faced while building it.

_Note: Screenshots and GIFs demonstrating the project features can be added here._

## Deployed Server

The server is deployed and accessible at: https://api.bestbudwtwr.ignorelist.com

_Note: Please update this with your actual deployed server URL._
