create table item_properties (
  id int not null auto_increment,
  name varchar(255) not null,
  first_value varchar(255) not null,
  second_value float not null,
  type float not null default 0,
  progress float not null default 0,
  primary key (id),
  unique key property_contstraint (name, first_value, second_value, type, progress)
);