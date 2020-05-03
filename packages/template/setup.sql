begin;

drop schema template cascade;

create schema if not exists template;

create table if not exists template.widget (
  id uuid not null default public.uuid_generate_v4() primary key,
  name text not null
);

insert into template.widget (name) values ('first_widget'), ('second_widget');

create table if not exists template.node (
  id uuid not null default public.uuid_generate_v4() primary key,
  node_name text not null,
  tag_name text,
  value text,
  widget_id uuid references template.widget(id),
  namespace_uri text,
  cardinality smallint default 0,
  parent_id uuid references template.node(id)
);

insert into template.node (node_name, tag_name, value, widget_id, parent_id, cardinality) values
  ('h5', 'h5', null, (select id from template.widget where name = 'second_widget'), null, 0)
  , ('h1', 'h1', null, (select id from template.widget where name = 'first_widget'), null, 0)
  , ('#text', null, '\n   ', (select id from template.widget where name = 'first_widget'), null, 1)
  , ('p', 'p', null, (select id from template.widget where name = 'first_widget'), null, 2)
;

insert into template.node (node_name, tag_name, value, widget_id, parent_id) values
  ('div', 'div', null, null, (select id from template.node where node_name='h1'))
;

insert into template.node (node_name, tag_name, value, widget_id, parent_id) values
  ('#text', null, 'some div text', null, (select id from template.node where node_name='div'))
;

create table if not exists template.attr (
  id uuid not null default public.uuid_generate_v4() primary key,
  name text,
  value text
);

insert into template.attr (name, value) values
  ('data-widget', 'something_id')
  , ('data-table', 'widget.something')
  , ('style', 'background-color="blue"')
;

create table if not exists template.node_attr (
  id uuid not null default public.uuid_generate_v4() primary key,
  node_id uuid references template.node(id),
  attr_id uuid references template.attr(id)
);

insert into template.node_attr (node_id, attr_id) values
  ((select id from template.node where node_name = 'h1'), (select id from template.attr where name = 'data-table'))
  , ((select id from template.node where node_name = 'h1'), (select id from template.attr where name = 'data-widget'))
  , ((select id from template.node where node_name = 'div'), (select id from template.attr where name = 'style'))
;

create or replace view template.widget_ast as
-- get node's child depths
with recursive node_depth (
  id,
  node_name,
  tag_name,
  value,
  widget_id,
  namespace_uri,
  cardinality,
  parent_id,
  depth
) as (
      select n.id
        , n.node_name
        , n.tag_name
        , n.value
        , n.widget_id
        , n.namespace_uri
        , n.cardinality
        , n.parent_id
        , 0
      from template.node n
    union all
      select n.id
        , n.node_name
        , n.tag_name
        , n.value
        , n.widget_id
        , n.namespace_uri
        , n.cardinality
        , n.parent_id
        , depth+1
      from template.node n
        join node_depth nd on nd.parent_id=n.id
),
-- get node attributes as json
node_attr as (
    select n.*
      , json_object_agg(a.name::text, a.value::text) attrs
    from template.node n
      join template.node_attr na on na.node_id=n.id
      join template.attr a on a.id=na.attr_id
    group by n.id
  union all
    select n.*
      , '{}'::json
    from template.node n
      left join template.node_attr na on na.node_id=n.id
    where na.attr_id is null
    group by n.id
),
-- get node's maximum depth
max_depth as (
  select id
    , max(depth) depth
  from node_depth
  group by id
),
-- combine node depths and attributes
node_with_attr as (
  select nd.*, na.attrs
  from node_depth nd
    join node_attr na on na.id=nd.id
),
-- create recursive array of children
q as (
    select nd.*, '[]'::json children 
    from node_with_attr nd
      join max_depth md on nd.depth=md.depth
        and nd.id=md.id
    where nd.depth=0
  union all
    select (node_with_attr).*, array_to_json(array_agg(q)) children
    from (
      select node_with_attr, q
      from node_with_attr
        join q on q.parent_id=node_with_attr.id
      where node_with_attr.depth=0
    ) v
    group by v.node_with_attr
)
-- root rows as json
select row_to_json(q)
from q
where q.widget_id is not null;

-- generate n number of uuids
create or replace function template.generate_uuids(integer) returns setof uuid as $$
  with recursive generated (id, n) as (
    select public.uuid_generate_v4(), 1
    union all
    select public.uuid_generate_v4(), n+1
    from generated
      where n < $1
  )
  select id from generated;
$$ language sql;

--create or replace function template.insert_rows(
--  json text,
--  out status integer,
--)
-- returns setof record
-- language plpgsql
--AS $function$
--    begin
--        return query execute 'select 200 as status, ''OK''::text as message, c.response, m.mimetype ' ||
--        'from ( ' ||
--          'select ' || quote_ident(column_name) || ' as response, ' || quote_literal(column_name) || ' as extension ' ||
--          'from ' || quote_ident(schema_name) || '.' || quote_ident(relation_name) || ' ' ||
--          'where name=' || quote_literal(name) || ' ' ||
--        ') as c ' ||
--        'join endpoint.mimetype_extension me on c.extension=me.extension ' ||
--        'join endpoint.mimetype m on me.mimetype_id=m.id';
--    end;
--$function$;

commit;
