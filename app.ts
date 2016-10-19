import Debug from "./modules/log";
import coffeeProxy from "./modules/proxy";
import hosts from "./api/hosts";

import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import * as express from "express";
import * as url from "url";

var httpProxy = require("http-proxy");

// 载入设置
var config = require("./config");

var debug = new Debug();

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});

var app = express();

console.log("好像调试前会进行自动编译呀， 好神奇呀");

app.all("*", function (req, res) {

    debug.log(req);

    let {protocol, auth, host, pathname, port} = url.parse(req.originalUrl);

    port = port || "80";

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
            return true;
        }

    }

    coffeeProxy.web(req, res, {
        target: `${protocol}//${host}:${port}`,
    });

});



// 注册hosts接口
app.use("/api/hosts", hosts);

app.listen(8000);
