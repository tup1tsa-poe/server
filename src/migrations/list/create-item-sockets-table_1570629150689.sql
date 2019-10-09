create table item_sockets (
  id int not null auto_increment,
  item_id binary not null,
  socket_id int not null,
  primary key (id),
  foreign key (socket_id) references sockets(id)
);