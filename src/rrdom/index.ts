import { EventType, eventWithTime } from '../types';
// import rebuild from './build';
import { RRDocument, RRIframeElement, RRNode, RRElement } from './tree-node';
// const nwsapi = require('nwsapi');

import { Replayer, document } from './replay';
// const fs = require('fs');
// const events = JSON.parse(
//   fs.readFileSync(require.resolve('./events2.json')).toString(),
// );
// const replayer = new Replayer(events);
// setTimeout(() => {
//   printRRDom((document as unknown) as RRDocument);
// }, 100);
// replayer.on('*', (event) => {
//   if (event === 'finish') {
//     // printRRDom((replayer.iframe.contentDocument as unknown) as RRDocument);
//     // console.log(replayer.getCurrentTime());
//     // console.log(replayer.getMirror());
//   }
// });
// // replayer.play();
// setTimeout(() => {
//   const nws = nwsapi({
//     document: replayer.iframe.contentDocument,
//   });
//   console.log(nws.select('div').length);
// }, 1000);

export function printRRDom(rootNode: RRNode) {
  walk(rootNode, '');
}
function walk(node: RRNode, blankSpace: string) {
  let printText = `${blankSpace}${node.toString()} `;
  console.log(printText);
  for (const child of node.childNodes) {
    walk(child, blankSpace + '  ');
  }
  if (node instanceof RRIframeElement) {
    walk(node.contentDocument, blankSpace + '  ');
  }
}
