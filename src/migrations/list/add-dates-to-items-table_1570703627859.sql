alter table
  items
add
  (
    created timestamp not null default current_timestamp,
    updated timestamp not null default current_timestamp
  )