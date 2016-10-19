import fs = require("fs");
import http = require("http");

console.log(http);

http.get("http://jp.wangchaoyi.com", (response) => {
    console.log(response);
});
