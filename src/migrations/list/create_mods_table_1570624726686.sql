create table mods (
  id int not null auto_increment,
  name varchar(255) not null,
  value float not null default 0,
  min_value float not null default 0,
  max_value float not null default 0,
  primary key (id),
  unique key modifier (name, value, min_value, max_value)
);