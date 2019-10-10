alter table
  item_sockets
add
  foreign key (item_id) references items(id);