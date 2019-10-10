alter table
  item_mods
add
  foreign key (item_id) references items(id);