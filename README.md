# Interview_Assistant
A MERN based web App to conduct online interviews.  
The directory structure of the project is as follows:

# 1. Frontend

> It is the front-end of the project Interview Assistant  
It is developed using Reactjs, Material UI and many other modules.

## Installing Dependencies

#### Goto ```/frontend``` and type ```npm install``` in terminal.
#### It will install all packages mentioned in ```package.json``` file.

## Environment Variables

#### In the project directory, create ```.env``` file and write the following code.

```
REACT_APP_BACKEND_NODE_URL=YOUR_BAKEND_URL          e.g. http://localhost:5000/api
REACT_APP_BACKEND_ASSET_URL=YOUR_ASSET_URL          e.g. http://localhost:5000/
REACT_APP_BACKEND_PYTHON_URL=YOUR_PYTHON_URL        e.g. http://localhost:5001
```

## Running Frontend

#### Goto ```/frontend``` and type ```npm start``` in the terminal

# 2. Backend

>It is the Node Back-end of the project Interview Assistant  
It is developed using Node, MongoDb, Mongoose, Node-mailer and many other modules.

## Installing Dependencies

#### Goto ```/backend``` and type ```npm install``` in terminal.
#### It will install all packages mentioned in ```package.json``` file

## Environment Variables

#### In the project directory, create ```nodemon.json``` file and write the following code.
#### Add your environment variables accordingly.
```
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
```
## Running Node Backend

#### Goto ```/backend``` and type ```npm start``` in the terminal

# 3. Python Server

> It is the python backend of the project Interview Assistant  
> It is developed using Python 3.7 and flask, socketio, tensorflow and many other modules.

## Create Python Virtual Environment

#### Goto ```/Python-Server``` and type following commands in terminal.

```
 python -m venv project_env
 .\project_env\Scripts\activate
```

## Installing Dependencies

#### Goto ```/Python_Server``` and type following command in terminal.
```
pip install -r requirements.txt
```

## Running Python Server

#### Goto ```/Python_Server``` and type following commands in the terminal
```
python app.py
```
or 
```
./run
```




