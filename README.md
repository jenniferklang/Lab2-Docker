## Lab 2. Software Lifecycle Management

# En mini fullstack-applikation med användning av en IaaS-lösning som Microsoft Azure och Docker Compose.

[http://172.201.2.225:3000]
[http://172.201.2.225:80]

[https://github.com/jenniferklang/Lab2-Docker]

Använd docker compose cp för att överföra init.sql från den lokala datorn till databascontainern på den virtuella datorn. Använd följande kommando.

**docker compose cp init.sql fullstack-ish-database-1:/docker-entrypoint-initdb.d/init.sql**

Använd docker compose exec för att köra psql och läsa in init.sql-filens innehåll i databasen på den virtuella datorn. Då behövs username till psql.

**docker compose exec -it fullstack-ish-database-1 psql --username=postgres -d postgres -f /docker-entrypoint-initdb.d/init.sql**

Dessa kommandon underlättar kopiering och exekvering av SQL-fil i Docker-miljön på den virtuella datorn för databasinitialisering.
