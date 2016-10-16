
import express = require("express");
import Request = express.Request;
import Response = express.Response;

interface webConfig {
    /**
     * 代理目标的请求类型以及地址
     * eq: http://www.baidu.com
     */
    target: string
};

export default class Proxy{

    constructor(){

    }

    static web(req:Request, res: Response, config:webConfig){

    }

}