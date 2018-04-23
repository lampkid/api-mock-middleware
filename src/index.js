const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');



const readFileRecursive = require('./file');

const clearCache = require('./cache');

const watcher = require('./watcher');

/*
 *
 * design
 * mock mode:
 *  path by dir path
 *  express or koa
 * other features:
 *  support request method
 *  support js/json
 *  mock dir config
 *  hot-load
 *  proxy
 *  convert params to path
 *  rewrite path
 */



let mockDataCacheMap = {};

function reloadData(cacheMap, file) {

    try {
      require(file);

      clearCache(file);

      Object.assign(cacheMap, readFileRecursive(file));

    } catch (err) {
        console.error(err);
    }
}

module.exports = function (app, options={path: 'mock', proxy: {}}) {
  console.warn('Mock path: ', options.path);
  const mockPath = options.path;
  const proxyConfig = options.proxy || {};

  mockDataCacheMap = readFileRecursive(mockPath)

  
  // watch dir recusive
  watcher.with('fs').watch(path.resolve(mockPath), function (eventType, file) {

    console.log(eventType, file);

    reloadData(mockDataCacheMap, file);
    
  });

  app.all('/*', function (req, res, next) {
    const reqPath = `${req.method} ${req.path}`;
    const proxyNames = Object.keys(proxyConfig);
    const proxyFuzzyMatch = proxyNames.filter(function (kname) {
      return /\*$/.test(kname) && (new RegExp("^" + kname.replace(/\/\*$/, ''))).test(reqPath);
    });
    const proxyMatch = proxyNames.filter(function (kname) {
      return kname === reqPath;
    });
    // 判断下面这种情况的路由
    // => GET /api/user/:org/:name 
    const containMockURL = Object.keys(proxyConfig).filter(function (kname) {
      return (new RegExp(kname.replace(/(:\w*)[^/]/ig, '(.*)'))).test(reqPath);
    });

    if (proxyNames.length > 0 && (proxyMatch.length > 0 || proxyFuzzyMatch.length > 0)) {
      let currentProxy = proxyNames.filter(function (kname) {
        return (new RegExp("^" + kname.replace(/\/\*$/, ''))).test(reqPath);;
      });
      currentProxy = proxyConfig[currentmockDataCacheMap[0]];
      proxyHTTP.web(req, res, { target: currentProxy });
    } else if (mockDataCacheMap[reqPath] || (containMockURL && containMockURL.length > 0)) {
      let bodyParserMethd = bodyParser.json();
      const contentType = req.get('Content-Type');
      if (contentType === 'text/plain') {
        bodyParserMethd = bodyParser.raw({ type: 'text/plain' });
      }
      bodyParserMethd(req, res, function () {
        const result = mockDataCacheMap[reqPath] || mockDataCacheMap[containMockURL[0]];
        if (typeof result === 'function') {
          result(req, res, next);
        } else {
          res.json(result);
        }
      });
    } else {
      next();
    }
  });

  
  return function (req, res, next) {
    next();
  }
}
