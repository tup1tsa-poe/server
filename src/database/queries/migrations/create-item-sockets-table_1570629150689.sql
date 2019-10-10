create table item_sockets (
  id int unsigned not null auto_increment,
  item_id binary(32) not null,
  socket_id smallint unsigned not null,
  primary key (id),
  foreign key (socket_id) references sockets(id)
);