# Node Backend

It is the Node Back-end of the project Interview Assistant
It is developed using Node, MongoDb, Mongoose, Node-mailer and many other modules.

## Installing Dependencies

Goto /backend and type npm install in terminal.
It will install all packages mentioned in package.json file.

## Environment Variables

In the project directory, create nodemon.json file and write the following code.
Add your environment variables accordingly.
{
    "env":{
        "DB_USER":"",
        "DB_PASSWORD":"",
        "DB_NAME":"",
        "JWT_KEY":"",
        "GMAIL_EMAIL":"",
        "GMAIL_PASSWORD":"",
        "PORT":5000,
        "LOCALHOST":"http://localhost"
    }
}

## Running Node Backend

Goto /backend and type npm start in the terminal



