create table item_mods (
  id int unsigned not null auto_increment,
  item_id binary(32) not null,
  mod_id mediumint unsigned not null,
  primary key (id),
  foreign key (mod_id) references mods(id)
);