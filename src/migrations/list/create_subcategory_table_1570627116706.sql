create table subcategories (
  id smallint unsigned not null auto_increment,
  name varchar(255) not null unique,
  primary key (id)
);