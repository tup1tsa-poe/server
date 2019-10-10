create table item_names (
  id int unsigned not null auto_increment,
  name varchar(255) not null unique,
  primary key (id)
);