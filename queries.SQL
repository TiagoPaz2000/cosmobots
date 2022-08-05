CREATE TABLE IF NOT EXISTS users (
   user_id UUID PRIMARY KEY,
   email VARCHAR (255) NOT NULL,
   first_name VARCHAR (50) NOT NULL,
   last_name VARCHAR (50) NOT NULL,
   account_id UUID NOT NULL,
   group_id UUID NOT NULL
);