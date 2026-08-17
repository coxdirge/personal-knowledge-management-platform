# Database Design


Database:

PostgreSQL


## Entity Relationship


User

1

|

N

Note


Note

N

|

N

Tag



---

# Tables


## users


Purpose:

存储用户信息。


Schema:

```sql
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(64),
    password_hash TEXT,
    created_at TIMESTAMP
);
