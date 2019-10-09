create table item_mods (
  id int not null auto_increment,
  item_id binary not null,
  mod_id int not null,
  primary key (id),
  foreign key (mod_id) references mods(id)
);