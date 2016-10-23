/**
 * Created by coffee on 9/4/16.
 */
const url = require("url");

/**
 * Debug模块
 */
export default class Debug{

    private record:any[];
    private recordId: number = 1;

    constructor(){

        // 记录的网络请求
        this.record = [];


    }

    log(requestHeader:any, responseHeader:any, statusCode:number, responseBody:any){

        // var {href, pathname, protocol, hostname, port, path, search, hash} = url.parse(req.originalUrl);

        // this.record.push({
        //     protocol: protocol,
        //     host: hostname,
        //     pathname: pathname,
        //     url: href,
        //     method: req.method,
        //     httpVersion: req.httpVersion,
        //     headers: req.headers
        // });

        this.record.push({
            id: this.recordId++,
            requestHeader,
            statusCode,
            responseHeader,
            responseBody
        });

        console.log(this.record);

    }

}
