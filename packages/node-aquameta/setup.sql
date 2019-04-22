-- page middleware
create view endpoint.sitemap as
select r.path, m.mimetype, r.content
from endpoint.resource r
  join endpoint.mimetype m on m.id=r.mimetype_id;