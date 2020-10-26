# Products and Orders REST API Project

The idea of this project is to create and demonstrate usage of REST API over 
related resources. Full description of project requirements can be found in **test**
directory of the project.

## Before using, please make sure that you have:
 - Node.js installed (https://nodejs.org/)
 - MongoDB installed and running locally (https://www.mongodb.com/)
   - Using Windows, just open the terminal at where you installed mongo and run `mongod.exe`
- Configure node server and jwt params in **/common/config/env-config.js**
- Configure mongoose connection in **/common/services/mongoose-starter.js** 
 - Run `npm install` or `yarn` in your root project folder

## Usage

To run the project, please use a command line the following:
 - `npm start`
 - You can find Postman collection in **/test** directory.
 
 # Notes 
 - Since I decided to use MongoDB for this project, the ids of the resources are the original mongo's _id for better performence
 - For autoincrement ids, you can use mongo-autoincrement package (https://www.npmjs.com/package/mongo-autoincrement), but this is not good regarding DB performance as after every insert, an update request will be invoked. 