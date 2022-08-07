CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS groups (
   group_id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
   group_name VARCHAR (20) NOT NULL,
   group_description VARCHAR (255)
);

INSERT INTO groups(group_id, group_name)
VALUES
  ('b411912c-57a7-43f0-b56d-537676285ddf', 'Support Agents'),
  ('0a87458c-747a-4474-939c-f460524bc741', 'Bot Builders'),
  ('9c3af0d1-4203-428e-9951-e1873f14bb21', 'Bot Admins');


CREATE TABLE IF NOT EXISTS users (
   user_id UUID PRIMARY KEY NOT NULL,
   email VARCHAR (255) NOT NULL,
   first_name VARCHAR (50) NOT NULL,
   last_name VARCHAR (50) NOT NULL,
   account_id UUID NOT NULL,
   group_id UUID NOT NULL REFERENCES groups (group_id) ON DELETE CASCADE ON UPDATE CASCADE
);
