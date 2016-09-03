var http = require('http'),
    express = require("express"),
    httpProxy = require('http-proxy');

var hosts = require("./api/hosts");

// 载入设置
var config = require("./config");

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});

var app = express();

app.get("/web/*", function (req, res) {
    proxy.web(req, res, { target: 'http://www.quba360.com/' });
    // res.send({
    //     status: 0,
    //     msg: "我知道你想要api，但是我不给，我就不给"
    // });
});

// 注册hosts接口
app.use("/api/hosts", hosts);

app.listen(8000);

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
var server = http.createServer(function(req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  proxy.web(req, res, { target: 'http://test.quba360.com/' });
});

console.log("listening on port 5050");
server.listen(5050);

