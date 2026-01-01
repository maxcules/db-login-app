Full-Stack Login App
====================

Overview
--------

A simple full-stack application with an HTML frontend, a Node.js (Express) backend, and a TiDB database.The project includes user authentication, structured logging, and database change monitoring using TiDB Change Data Capture (TiCDC) with Kafka.

Requirements
------------

*   Docker
    
*   Docker Compose
    

Run
---

```docker compose up --build```

Access
------

Frontend: [http://localhost:8081](http://localhost:8081)
API: http://localhost:8080
Health check: http://localhost:8080/health

Default User
------------

Email: ```admin@example.com```
Password: ```Admin123!```

Logs
----

User activity logs (API):
```docker compose logs api```

Database change logs (CDC consumer):
```docker compose logs consumer```

Stop & Cleanup
--------------

```docker compose down```

Reset all data:
```docker compose down -v```
