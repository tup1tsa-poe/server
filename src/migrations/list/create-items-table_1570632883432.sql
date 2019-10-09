create table items (
  id binary(32) not null,
  abyss_jewel tinyint not null default 0,
  art_filename_id mediumint unsigned default null,
  corrupted tinyint not null default 0,
  delve tinyint not null default 0,
  descr_text_id mediumint unsigned default null,
  duplicated tinyint not null default 0,
  elder tinyint not null default 0,
  category_id tinyint(3) unsigned default null,
  subcategory_id smallint unsigned default null,
  prefixes tinyint default null,
  suffixes tinyint default null,
  flavour_text varchar(1000) default null,
  frame_type_id tinyint(2) unsigned not null,
  h tinyint not null,
  hybrid text default null,
  icon_id mediumint unsigned not null,
  identified tinyint not null,
  ilvl tinyint(3) unsigned not null,
  incubated_item text default null,
  inventory_id varchar(255) not null,
  is_relic tinyint not null default 0,
  league_id tinyint(3) unsigned not null,
  lockedToCharacter tinyint not null default 0,
  max_stack_size smallint unsigned default null,
  name_id int unsigned not null,
  note_id int unsigned default null,
  prophecy_diff_text_id mediumint unsigned default null,
  prophecy_text_id mediumint unsigned default null,
  sec_desct_text_id mediumint unsigned default null,
  shaper tinyint not null default 0,
  socketed_items text default null,
  stack_size smallint unsigned default null,
  support tinyint not null default 0,
  synthesised tinyint not null default 0,
  talisman_tier tinyint(3) unsigned default null,
  typeline_id mediumint unsigned default null,
  veiled tinyint not null default 0,
  verified tinyint not null default 0,
  w tinyint not null,
  x tinyint(3) unsigned not null,
  y tinyint(3) unsigned not null,
  primary key (id),
  foreign key (art_filename_id) references texts(id),
  foreign key (descr_text_id) references texts(id),
  foreign key (category_id) references categories(id),
  foreign key (subcategory_id) references subcategories(id),
  foreign key (frame_type_id) references frametypes(id),
  foreign key (icon_id) references icons(id),
  foreign key (league_id) references leagues(id),
  foreign key (name_id) references item_names(id),
  foreign key (note_id) references notes(id),
  foreign key (prophecy_diff_text_id) references texts(id),
  foreign key (prophecy_text_id) references texts(id),
  foreign key (sec_desct_text_id) references texts(id),
  foreign key (typeline_id) references typelines(id)
);