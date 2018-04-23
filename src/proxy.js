
const httpProxy = require('http-proxy');


const proxyHTTP = httpProxy.createProxyServer({});


function createProxy(target) {
    proxyHTTP.web(req, res, { target });
}
