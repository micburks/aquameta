begin;
create schema if not exists widget;

create table if not exists widget.component (
  id uuid not null default public.uuid_generate_v4() primary key,
  name text not null,
  js text default '// import {html} from "/db/widget/core/index.js";',
  docs text
);

create table if not exists widget.common (
  id uuid not null default public.uuid_generate_v4() primary key,
  name text not null,
  js text default '// export default function() {}',
  css text default '/* #root {\n} */',
  docs text
);

create schema if not exists pres;

create table if not exists pres.slide (
  id uuid not null default public.uuid_generate_v4() primary key,
  name text not null,
  number integer not null,
  markdown text
);

create table if not exists pres.component (
  id uuid not null default public.uuid_generate_v4() primary key,
  name text not null,
  js text default '// export default function() {}'
);

commit;
