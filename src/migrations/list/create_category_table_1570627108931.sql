create table categories (
  id tinyint(3) unsigned not null auto_increment,
  name varchar(255) not null unique,
  primary key (id)
);