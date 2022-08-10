\c cosmo_database;

INSERT INTO groups(group_id, group_name)
VALUES
  ('b411912c-57a7-43f0-b56d-537676285ddf', 'Support Agents'),
  ('0a87458c-747a-4474-939c-f460524bc741', 'Bot Builders'),
  ('9c3af0d1-4203-428e-9951-e1873f14bb21', 'Bot Admins');

INSERT INTO users(user_id, group_id, account_id, first_name, last_name, email)
VALUES
('644e7649-d63c-4ca4-8bb0-5c48d8a167f2', 'b411912c-57a7-43f0-b56d-537676285ddf', 'f00af341-655c-4763-a46e-01e42cc69d1f', 'teste', 'teste', 'teste@mail.com'),
('5522be17-597e-45e9-b042-62ce6b76b9df', '9c3af0d1-4203-428e-9951-e1873f14bb21', '5522be17-597e-45e9-b042-62ce6b76b9df', 'teste', 'teste', 'teste@mail.com');