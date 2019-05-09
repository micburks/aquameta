begin;

create schema if not exists test;

create table test.user (
  id integer unique,
  age integer,
  name text
);

commit;
