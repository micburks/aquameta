begin;
create schema if not exists widget;

create table widget.component (
  id uuid not null default public.uuid_generate_v4() primary key,
  name text not null,
  js text default '// import {html} from "/db/widget/core/index.js";',
  docs text
);

create table widget.core (
  id uuid not null default public.uuid_generate_v4() primary key,
  name text not null,
  js text default '// export default function() {}',
  docs text
);

insert into widget.core (name, js) values ('index', 'export {html,Component,render} from "https://unpkg.com/htm/react/standalone.mjs";');

commit;
