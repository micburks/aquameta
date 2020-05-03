// @flow
import parseHtml from 'parse5';
import {client, query, database} from 'aquameta-datum';

const execute = query(
  client.connection({
    connection: {
      user: 'mickey',
    },
  }),
);

export async function parse(contents) {
  return parseHtml.parseFragment(contents).childNodes;
}

let idCounter = 0;
function getNextId() {
  return idCounter++;
}

export async function astToRows(widgetName, ast) {
  if (!Array.isArray(ast)) {
    ast = [ast];
  }

  const rows = [
    {
      table: 'template.widget',
      data: {
        id: getNextId(),
        name: widgetName,
      },
    },
  ];
  ast.forEach((node, index) => {
    const context = {
      parentId: null,
      cardinality: index,
    };
    const astRows = getRowsFromNode(node, context);
    rows.push(...astRows);
  });

  // get uuids
  const res = await execute(
    database.select(database.fn('template.generate_uuids', [idCounter])),
  );
  const ids = res.map(({generate_uuids}) => generate_uuids);

  rows.forEach(row => {
    ['id', 'widget_id', 'node_id', 'attr_id', 'parent_id'].forEach(id => {
      if (id in row.data) {
        row.data[id] = ids[row.data[id]];
      }
    });
  });

  return rows;
}

function getRowsFromNode(node, {parentId = null, cardinality = 0} = {}) {
  const {nodeName, tagName, namespaceURI, attrs = [], childNodes = []} = node;
  const id = getNextId();
  const row = {
    table: 'template.node',
    data: {
      id,
      node_name: nodeName,
      tag_name: tagName,
      namespace_uri: namespaceURI,
      parent_id: parentId,
      cardinality,
    },
  };
  const rows = [row];
  if (childNodes) {
    childNodes.forEach((childNode, index) => {
      const context = {
        parentId: id,
        cardinality: index,
      };
      rows.push(...getRowsFromNode(childNode, context));
    });
  }
  const attrRows = attrs.map(attr => {
    const {name, value} = attr;
    return {
      table: 'template.attr',
      data: {id, name, value},
    };
  });
  if (attrRows.length) {
    rows.push(...attrRows);
  }
  return rows;
}

export async function writeWidget(query) {
  const rows = await query;
  console.log('write', rows);
}
