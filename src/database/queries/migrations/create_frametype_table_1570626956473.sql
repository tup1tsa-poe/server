create table frametypes (
  id tinyint(2) unsigned not null,
  name varchar(255) not null unique,
  primary key (id)
);