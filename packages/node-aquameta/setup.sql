begin;

alter table endpoint.resource add column if not exists js text;

-- page middleware
create or replace view endpoint.sitemap as
select replace(r.path, '/', '-') as name, r.path, m.mimetype, r.content, r.js
from endpoint.resource r
  join endpoint.mimetype m on m.id=r.mimetype_id;

commit;
