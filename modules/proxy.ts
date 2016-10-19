import * as http from "http";
import * as url from "url";
import * as express from "express";

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
        console.log(req);

        let {protocol, auth, host, pathname, port} = url.parse(req.originalUrl);
        port = port || "80";

        if(protocol === "http:"){

            http.get(req.originalUrl, (response) => {

                // res.set(response.headers);
                // res.send({
                //     hello: "eereee"
                // })

                var data:string | Buffer = "";

                response.on("data", (_data) => {
                    console.log(_data);
                    // res.send(data);

                    data += <string>_data;

                    
                });

                response.on("end", (d) => {
                    console.log(d);

                    res.set(response.headers);
                    res.send(data);
                    
                })

            });

        }


    }

}