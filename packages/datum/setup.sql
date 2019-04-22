create or replace function endpoint.source(
  schema_name text,
  relation_name text,
  column_name text,
  name text,
  out status integer,
  out message text,
  out response text,
  out mimetype text
)
 returns setof record
 language plpgsql
AS $function$
    begin
        return query execute 'select 200 as status, ''OK''::text as message, c.response, m.mimetype ' ||
        'from ( ' ||
          'select ' || quote_ident(column_name) || ' as response, ' || quote_literal(column_name) || ' as extension ' ||
          'from ' || quote_ident(schema_name) || '.' || quote_ident(relation_name) || ' ' ||
          'where name=' || quote_literal(name) || ' ' ||
        ') as c ' ||
        'join endpoint.mimetype_extension me on c.extension=me.extension ' ||
        'join endpoint.mimetype m on me.mimetype_id=m.id';
    end;
$function$;
