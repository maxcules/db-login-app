Full-Stack Login Application
============================

Overview
--------

This project is a complete full-stack application built as part of a home assignment focusing on development, DevOps, and basic SRE practices.

The system includes:

*   A simple HTML frontend
    
*   A Node.js (Express) backend API
    
*   User authentication with token management
    
*   TiDB as the database
    
*   Database change monitoring using TiDB Change Data Capture (TiCDC)
    
*   Apache Kafka as a message broker
    
*   A Node.js consumer that processes database changes in real time
    
*   Structured JSON logging for observability



High-Level Architecture
-----------------------

User requests flow through the system as follows:

Browser→ Frontend (HTML + JavaScript)→ Backend API (Node.js / Express)→ TiDB (PD + TiKV + TiDB)→ TiCDC→ Kafka→ CDC Consumer (Node.js)

Technology Stack
----------------

Frontend

*   Basic HTML and JavaScript
    
*   Served using Nginx
    

Backend

*   Node.js
    
*   Express.js
    
*   RESTful API
    

Database

*   TiDB (running with PD and TiKV)
    

Monitoring & Messaging

*   TiDB Change Data Capture (TiCDC)
    
*   Apache Kafka
    

Logging

*   log4js
    
*   Structured JSON logs written to stdout
    

Containerization

*   Docker
    
*   Docker Compose

    

Prerequisites
-------------

The only requirements to run this project are:

*   Docker
    
*   Docker Compose
    

No local installation of Node.js, MySQL, Kafka, or TiDB is required.

Setup and Running Instructions
------------------------------

1.  Clone the repository
    

```git clone cd db-login-app```

1.  Start the entire system
    

```docker compose up --build```

This single command:

*   Builds all Docker images
    
*   Starts all services
    
*   Initializes the TiDB database schema
    
*   Creates a default user
    
*   Starts TiCDC
    
*   Automatically creates a CDC changefeed
    
*   Starts the Kafka consumer
    

No manual setup steps are required.

Accessing the Application
-------------------------

Frontend: [http://localhost:8081](http://localhost:8081)

Backend API: http://localhost:8080

Backend health check: http://localhost:8080/health

Default User
------------

A default user is created automatically during startup.

Email: ```admin@example.com``` 

Password: ```Admin123!```

This user can be used to log in through the frontend or via the API.

Authentication
--------------

*   Users authenticate via the /login endpoint
    
*   On successful login, a token is generated and stored in the database
    
*   The token must be sent in authenticated requests using the Authorization header
    


Logging and Monitoring
----------------------

### User Activity Logging

The logs are structured JSON and include:

*   Timestamp
    
*   User ID
    
*   Action (LOGIN)
    
*   Client IP address
    

To view API logs:
```docker compose logs api```

### Database Change Monitoring (TiCDC)

TiDB Change Data Capture (TiCDC) runs as part of the Docker Compose setup.

*   A changefeed is created automatically on startup
    
*   All INSERT, UPDATE, and DELETE operations are captured
    
*   Changes are sent to Kafka
    

To view CDC initialization logs:
```docker compose logs cdc-init```

### Real-Time Data Processing

A Node.js consumer subscribes to Kafka and processes CDC events.

*   Database changes are consumed in real time
    
*   Events are logged to the console in structured JSON format
    

To view consumer logs:
```docker compose logs consumer```

Database Initialization
-----------------------

*   Database schema and seed data are defined in db/init.sql
    
*   Initialization runs automatically via a one-time container
    
*   The backend starts only after the database is ready
    


Stopping the Application
------------------------

To stop all services:
```docker compose down```

To reset the database and all data:
```docker compose down -v```
