/**
 * Created by coffee on 9/4/16.
 */
const url = require("url");

/**
 * Debug模块
 */
export default class Debug{
    private record;

    constructor(){

        // 记录的网络请求
        this.record = [];

    }

    log(req){

        var {href, pathname, protocol, hostname, port, path, search, hash} = url.parse(req.originalUrl);

        this.record.push({
            protocol: protocol,
            host: hostname,
            pathname: pathname,
            url: href,
            method: req.method,
            httpVersion: req.httpVersion,
            headers: req.headers
        });
    }

}
