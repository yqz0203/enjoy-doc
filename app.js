/**
 * app.js
 */

const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const server = http.Server(app);
const io = require('socket.io')(server);
const path = require('path');
const fs = require('fs');
const opn = require('opn');

const docConfig = require(path.resolve(process.argv[2]));

const args = (function () {
  const restArgv = process.argv.splice(3);
  return restArgv.reduce((prev, item) => {
    const pairs = item.split('=');
    prev[pairs[0].replace(/-+/g, '')] = pairs[1] || 1;
    return prev;
  }, {});
})();

const routeMap = (function () {
  const map = new Map();
  function find(children) {
    if (!children) return;

    children.forEach((item) => {
      if (item.route !== undefined) {
        map.set(item.route || '__empty', item);
      }
      if (item.children) {
        find(item.children);
      }
    });
  }

  find(docConfig.nav);
  return map;
})();

function covertMDFile(filePath, fileData) {
  return fileData.replace(/[^!]?\[(.(?!\\\]))*]\(([^)]*)\)/, function () {
    const str = arguments[0];
    const match = arguments[2];
    if (/http(s)?/.test(match)) {
      return str;
    }
    const linkPath = path.join(filePath, '..', match);
    let route = '';
    routeMap.forEach((item) => {
      if (item.file === linkPath) {
        route = item.route;
      }
    });

    // use hash
    return route ? str.replace(match, '#' + route) : str;
  });
}

app.locals = {
  version: require('./package.json').version,
}

app.use(express.static(path.join(__dirname, './public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.get('/', (req, res) => {
  res.render('index', { config: docConfig, port: PORT });
});

app.get('/doc', (req, res, next) => {
  const config = routeMap.get(req.query.route || '__empty');
  if (!config) {
    return res.sendStatus(404);
  }

  // 来自远程
  if (/http(s)?:/gi.test(config.file)) {
    const { URL } = require('url');
    let client = http;
    if (config.file.startsWith('https')) {
      client = https;
    }
    client.get(new URL(config.file), (_req) => {
      _req.pipe(res)
    }).on('error', (e) => {
      next(e);
    });
    return;
  }

  if (!fs.existsSync(config.file)) {
    return res.send(config.file);
  }

  fs.readFile(config.file, (err, data) => {
    if (err) {
      return next(err);
    }
    res.send(covertMDFile(config.file, data.toString()));
  });
});

app.get('/imgproxy', (req, res, next) => {
  const { src, route } = req.query;
  const config = routeMap.get(req.query.route);
  const imgPath = path.join(config.file, '..', src);
  res.sendFile(imgPath);
});

app.use(function errorHandler(err, req, res, next) {
  console.log(err);
  res.sendStatus(500);
});

const PORT = args.port || 3000;
server.listen(PORT, () => {
  console.log(`Server run port ${PORT}`);
  setTimeout(() => {
    io.clients((error, clients) => {
      if (clients.length === 0) {
        opn(`http://localhost:${PORT}`);
      }
    });
  }, 2000);
});

io.on('connection', socket => {
});
