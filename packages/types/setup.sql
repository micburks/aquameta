begin;
create schema if not exists widget;

create or replace view widget.type as
select schema_name
  , relation_name
  , json_object_agg(name::text, nullable) as nullable
  , json_object_agg(name::text, type_name::text) as columns
from meta.column p
group by schema_name
  , relation_name;

commit;
