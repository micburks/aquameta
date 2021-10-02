// @flow
import {query, client, database} from 'aquameta-datum';
import otherFunction from '/db/widget.component/helper.js';

const exec = query(client.connection());

export default async function() {
  const ret = await otherFunction({n: 3});
  const [row] = await database.select('meta.relation');
  row.id;
  return 'div' + ret;
}
