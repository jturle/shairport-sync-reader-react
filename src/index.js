import ShairportReader from 'shairport-sync-reader';
import Primus from 'primus';

Primus.createServer((spark) => {
  console.log('Spark', spark );
}, {port: 8080, transformer: 'websockets'});

let pipeReader = new ShairportReader({path: '/tmp/shairport-sync-metadata'});
let state = {
  playing: false,
  meta: {},
  progress: {},
  volume: {}
};
pipeReader.on('prgr', (e) => {
  state.progress = {...state.progress, ...e};
  console.log(state);
});
pipeReader.on('pvol', (e) => {
  state.volume = {...state.volume, ...e};
  console.log(state);
});
pipeReader.on('meta', (e) => {
  state.meta = {...state.meta, ...e};
  console.log(state);
});
