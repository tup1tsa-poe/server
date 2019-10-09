create table item_item_properties (
  id int not null auto_increment,
  item_id binary not null,
  item_property_id int not null,
  primary key (id),
  foreign key (item_property_id) references item_properties(id)
);