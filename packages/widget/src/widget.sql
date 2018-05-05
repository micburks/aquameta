begin;
create schema if not exists widget;

create table widget.widget (
  id uuid not null default public.uuid_generate_v4() primary key,
  name text not null,
  css text default 'div {
  }'::text not null,
  html text default '<div>
  </div>'::text not null,
  docs text
);

create table widget.event (
  id uuid not null default public.uuid_generate_v4() primary key,
  name text not null,
  js text default E'export default function () {
    console.log(\'New widget ready!\')
  }'::text not null
);

select endpoint.set_mimetype('widget', 'event', 'js', 'text/javascript');
-- select semantics.source_identifier('widget', 'event', 'name');

create table widget.widget_event (
  id uuid not null default public.uuid_generate_v4() primary key,
  widget_id uuid not null references widget.widget(id) on delete cascade on update cascade,
  event_id uuid not null references widget.event(id) on delete cascade on update cascade,
  unique(widget_id, event_id)
);

create table widget.input (
  id uuid not null default public.uuid_generate_v4() primary key,
  widget_id uuid not null references widget.widget(id) on delete cascade on update cascade,
  name varchar(255) not null,
  css boolean default false not null,
  required boolean default true not null,
  "default" text,
  test_value text,
  docs text,
  unique(widget_id, name)
);

create table widget.widget_view (
  id uuid not null default public.uuid_generate_v4() primary key,
  widget_id uuid not null references widget.widget(id) on delete cascade on update cascade,
  view_id meta.relation_id,
  unique(widget_id, view_id)
);

create table widget.css_dep (
  id uuid not null default public.uuid_generate_v4() primary key,
  name text not null,
  version text not null,
  css text not null,
  unique(name, version)
);

select endpoint.set_mimetype('widget', 'css_dep', 'css', 'text/css');
-- select semantics.source_identifier('widget', 'css_dep', 'name');

create table widget.js_dep (
  id uuid not null default public.uuid_generate_v4() primary key,
  name text not null,
  version text not null,
  js text not null,
  unique(name, version)
);

select endpoint.set_mimetype('widget', 'js_dep', 'js', 'text/javascript');
-- select semantics.source_identifier('widget', 'js_dep', 'name');

-- create table widget.lang();

create view widget.render as
select
  w.*,
  event_names.names as events,
  input_options.inputs as inputs,
  v.view_id
from widget.widget w
  join
    (
      select w.id, array_agg(e.name::text) as names
      from widget.event e
        join widget.widget_event we on we.event_id=e.id
        join widget.widget w on w.id=we.widget_id
      group by w.id
    ) as event_names
  on event_names.id=w.id
  join
  (
    select
      w.id, 
      row_to_json(
        (select d from
          (select i.name, i.required, i."default") d
        )
      ) as inputs
    from widget.widget w
      join widget.input i on i.widget_id=w.id
  ) as input_options
  on input_options.id=w.id
  join widget.widget_view v on v.widget_id=w.id;

commit;
