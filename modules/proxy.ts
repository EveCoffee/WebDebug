import * as http from "http";
import * as url from "url";
import * as express from "express";
import * as request from "request";

import Request = express.Request;
import Response = express.Response;

var Stream = require("stream").Transform;

interface webConfig {
    /**
     * 代理目标的请求类型以及地址
     * eq: http://www.baidu.com
     */
    target: string
};

/**
 * 响应头
 */
type responseHeader = any;

/**
 * 响应数据
 */
type responseBody = any;

export default class Proxy{

    constructor(){

    }

    /**
     * 代理http类型的web请求
     */
    static web(req:Request, res: Response, callback?:(header:responseHeader, statusCode:number, body:responseBody)=>void){

        let {protocol, auth, host, pathname, port} = url.parse(req.originalUrl);
        port = port || "80";

         if(protocol === "http:"){

            var req2 = request({
                url: req.originalUrl,
                headers: req.headers
            }, (error, response, body) => {
                callback(response.headers, response.statusCode, body);
            }).pipe(res);

            // console.log(req2);

        }


    }

}