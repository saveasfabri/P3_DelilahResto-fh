# DelilahResto
Delilah Restó is the 3rd project of Web Development Full Stack course of Acámica.

This project proposes the creation of an online ordering system for a restaurant. It consists of assembling a REST API that allows CRUD operations to be carried out on a data structure.

## Resources and technologies used
- Node JS

- Express js

- Sequelize

- MySQL

- JWT for authentication through Token

- Postman to test API Endpoints

- Swagger to build API Documentation

## Installation :octocat:
Clone the project from a terminal

`git clone https://github.com/saveasfabri/P3_DelilahResto-fh.git`

## Dependencies
Install the required dependencies for the correct operation of the application

`npm install`

## Database
Use the *delilah_resto.sql* file to import it into your Database client, it will provide the entire structure.

## :warning: Important
Remember to modify the file *db.js* with the data of your environment.

## Start the Server 
In the package.json folder replace the line:

`"scripts": {"test": "echo \"Error: no test specified\" && exit 1"},`

For this line:

`"scripts": {"start": "node index","dev": "nodemon index"},`

Position yourself in the *Backend* folder from a terminal and execute the following Script:

`npm run dev`

## Documentation 
Check the file  *spec.yaml*, here you will find the endpoints and requirements to use the API.

## Repository
Link to the repository on GitHub:

`https://github.com/saveasfabri/P3_DelilahResto-fh.git`
