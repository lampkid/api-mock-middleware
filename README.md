api-mocker-middleware
---

api-mocker-middleware is a [webpack-dev-server](https://github.com/webpack/webpack-dev-server)  middleware that creates mocks for REST APIs. It will be helpful when you try to test your application without the actual REST API server.

**Features:**  

🔥 Built in support for hot Mock file replacement.  
🚀 Quickly and easily configure the API via JSON.  
🌱 Mock API proxying made simple.  

## Installation

```bash
npm install api-mocker-middleware --save-dev
```

## Usage

Just put your mock files in a dir such as `./mock`.

```js
const proxy = {
  'GET /api/user': {
    id: 1,
    username: 'kenny',
    sex: 6
  },
  'GET /api/user/list': [
    {
      id: 1,
      username: 'kenny',
      sex: 6
    }, {
      id: 2,
      username: 'kenny',
      sex: 6
    }
  ],
  'POST /api/login/account': (req, res) => {
    const { password, username } = req.body;
    if (password === '888888' && username === 'admin') {
      return res.json({
        status: 'ok',
        code: 0,
        token: "sdfsdfsdfdsf",
        data: {
          id: 1,
          username: 'kenny',
          sex: 6
        }
      });
    } else {
      return res.json({
        status: 'error',
        code: 403
      });
    }
  },
  'DELETE /api/user/:id': (req, res) => {
    console.log('---->', req.body)
    console.log('---->', req.params.id)
    res.send({ status: 'ok', message: '删除成功！' });
  }
}
module.exports = proxy;
```

## doMock

```js
doMock(app, {path: mockPath [,proxy:{}]})
```

## Using with [Express](https://github.com/expressjs/express)

```diff
const path = require('path');
const express = require('express');
+ const doMock = require('api-mocker-middleware');

const app = express();

+ doMock(app, { path: path.resolve('./mock/')})
app.listen(8080);
```

## Using with [Webpack](https://github.com/webpack/webpack)

To mock on your [Webpack](https://github.com/webpack/webpack) projects, simply add a setup options to your [webpack-dev-server](https://github.com/webpack/webpack-dev-server) options:

Change your config file to tell the dev server where to look for files: `webpack.config.js`.

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
+ const doMock = require('api-mocker-middleware');

module.exports = {
  entry: {
    app: './src/index.js',
    print: './src/print.js'
  },
  devtool: 'inline-source-map',
+ devServer: {
+   ...
+   before(app){
+     doMock(app, { path: path.resolve('./mock'), proxy:{
+       'GET /api/user/list': 'http://localhost:3000',
+       'GET /api/prod/*': 'http://localhost:3000',
+     }})
+   }
+ },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

Just put your mock files in a dir such as `./mock`.

Let's add a script to easily run the dev server as well: `package.json`

```diff
  {
    "name": "development",
    "version": "1.0.0",
    "description": "",
    "main": "webpack.config.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
+     "start": "webpack-dev-server --open",
      "build": "webpack"
    },
    "keywords": [],
    "author": "",
    "license": "MIT",
    "devDependencies": {
      ....
    }
  }
```

Mock API proxying made simple.

```js
{
  before(app){
    doMock(app, { path: path.resolve('./mock'), proxy: {
        'GET /api/user/list': 'http://localhost:3000',
        'GET /api/prod/*': 'http://localhost:3000',
    }})
  }
}
```
