import Debug from "./modules/log";
import coffeeProxy from "./modules/proxy";
import hosts from "./api/hosts";

import * as Http from "http";
import * as fs from "fs";
import * as path from "path";
import * as express from "express";
import * as url from "url";
import * as socketIO from "socket.io";


var httpProxy = require("http-proxy");

// 载入设置
var config = require("./config");

var debug = new Debug();

var app = express(),
    http = require("http").Server(app),
    io = socketIO(http),
    socket:SocketIO.Socket = null;

app.all("*", function (req, res) {

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

    coffeeProxy.web(req, res, (header, statusCode, body) => {
        debug.log(req.headers, header, statusCode, body);

        socket.emit("record", {
            status: 0,
            message: "有数据过来了，别偷懒",
            record: {
                requestHeader: req.headers,
                statusCode: statusCode,
                responseHeader: header,
                responseBody: body
            }
        })
    });
});

io.on("connection", function(_socket){
    console.log("a user connnected.");

    socket = _socket;

    _socket.emit("new", {
        message: "看见你很高兴!!!"
    })

});

// 注册hosts接口
app.use("/api/hosts", hosts);

http.listen(8000);
console.log("正在监听8000端口");
