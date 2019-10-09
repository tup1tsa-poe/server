create table sockets (
  id int not null auto_increment,
  socket_group tinyint not null,
  attr varchar(5) not null,
  colour varchar(5) not null,
  primary key (id),
  unique key socket (socket_group, attr, colour)
);