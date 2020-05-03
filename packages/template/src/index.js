// @flow
import parseHtml from 'parse5';

export async function parse(contents) {
  return parseHtml.parseFragment(contents).childNodes;
}

export async function astToRows(widgetName, ast) {
  // convert ast to flat structure with serial numbers as ids
  // call template.generate_uuid(n)
  // replace ids
  // return rows
  console.log(
    widgetName, ast
  );
}
