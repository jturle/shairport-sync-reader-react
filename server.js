import path from 'path';
import express from 'express';
import ShairportReader from 'shairport-sync-reader';
import Primus from 'primus';

const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.dev.js');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();


let primus = Primus.createServer((spark) => {
  // console.log('Spark', spark );
}, {port: 3001, transformer: 'websockets'});
primus.save(__dirname +'/primus.js');

let pipeReader = new ShairportReader({path: '/tmp/shairport-sync-metadata'});
let state = {
  playing: false,
  meta: {},
  progress: {},
  volume: {},
  pic: false
};
pipeReader.on('prgr', (e) => {
  state.progress = {...state.progress, ...e};
  // console.log(state);
  primus.write(state);
});
pipeReader.on('pvol', (e) => {
  state.volume = {...state.volume, ...e};
  // console.log(state);
  primus.write(state);
});
pipeReader.on('meta', (e) => {
  state.meta = {...state.meta, ...e};
  // console.log(state);
  primus.write(state);
});
pipeReader.on('PICT', (e) => {
  console.log('Saved pic...');
  // state.pic = 'data:image/png;base64,' + e.toString('base64');
  // primus.write(state);
});


if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('/', function response(req, res) {
    res.sendFile(path.join(__dirname, 'www.html'));
  });
  app.get('/favicon.ico', function response(req, res) {
    res.end();
  });
  app.get('/primus.js', function response(req, res) {
    res.sendFile(path.join(__dirname, 'primus.js'));
  });
  // app.get('*', function response(req, res) {
  //   res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
  //   res.end();
  // });
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});