alter table
  item_item_properties
add
  foreign key (item_id) references items(id);