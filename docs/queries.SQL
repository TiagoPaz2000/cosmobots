CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS groups (
   group_id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
   group_name VARCHAR (20) NOT NULL,
   group_description VARCHAR (255)
);

CREATE TABLE IF NOT EXISTS users (
   user_id UUID PRIMARY KEY NOT NULL,
   email VARCHAR (255) NOT NULL,
   first_name VARCHAR (50) NOT NULL,
   last_name VARCHAR (50) NOT NULL,
   account_id UUID NOT NULL,
   group_id UUID NOT NULL REFERENCES groups (group_id) ON DELETE CASCADE ON UPDATE CASCADE
);
