import Debug from "./modules/log";
import coffeeProxy from "./modules/proxy";
import hosts from "./api/hosts";

const
    http = require("http"),
    fs = require("fs"),
    url = require("url"),
    path = require("path"),


    express = require("express"),
    httpProxy = require("http-proxy");

// 载入设置
var config = require("./config");

var debug = new Debug();

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});

var app = express();

console.log("好像调试前会进行自动编译呀， 好神奇呀")

app.all("*", function (req, res) {

    debug.log(req);

    let {protocol, auth, host, pathname, port} = url.parse(req.originalUrl);

    port = port || 80;

    // 遍历映射目录, 如果存在则直接进行映射目录替换
    for (let mapReg of Object.keys(config.mapping)){

        let re = new RegExp(mapReg);

        if(re.test(pathname)){
            
            var filePath = path.join(config.mapping[mapReg], ".." , pathname);

            if(fs.existsSync(filePath)){

                res.sendFile(filePath);

            }else{

                res.status(404).send({
                    status: 404,
                    path: pathname,
                    mapping: filePath,
                    message: `出错了, 文件不存在`
                });
            }

            console.log("我成功了吗");

            return true;
        }

    }


    if(req.originalUrl.indexOf("/web/") !== -1){
        console.log("api请求");
    }

    coffeeProxy.web(req, res, {
        target: `${protocol}//${host}:${port}`,
    });

    proxy.web(req, res, {
        target: `${protocol}//${host}`
    });
});

/*app.get("/web/!*", function (req, res) {
    proxy.web(req, res, { target: 'http://www.quba360.com/' });
    // res.send({
    //     status: 0,
    //     msg: "我知道你想要api，但是我不给，我就不给"
    // });
});*/

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

});

console.log("proxy listening on port 5050");
server.listen(5050);

