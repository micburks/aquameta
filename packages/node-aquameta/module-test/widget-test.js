import html from '/db/widget/core/html.js';
// import ReactDOM from '/db/widget/dep/react-dom.js';
// import Root from '/db/widget/component/root.js';
import ReactDOMServer from 'https://dev.jspm.io/react-dom/server';

function Root() {
  return html`
    <h1>plug n play</h1>
  `;
}

const rendered = ReactDOMServer.renderToString(
  html`
    <${Root} />
  `,
);

console.log({rendered});

/*
ReactDOM.render(
  html`<${Root}/>`,
  document.getElementById('root'),
);
*/
