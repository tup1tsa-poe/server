create table texts (
  id mediumint unsigned not null auto_increment,
  name varchar(255) not null unique,
  primary key (id)
);