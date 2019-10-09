create table item_item_properties (
  id int unsigned not null auto_increment,
  item_id binary(32) not null,
  item_property_id int unsigned not null,
  primary key (id),
  foreign key (item_property_id) references item_properties(id)
);