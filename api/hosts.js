/**
 * Created by coffee on 8/28/16.
 */
"use strict";
var express = require("express"), router = express.Router();
const hosts_1 = require("../modules/hosts");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router.get("/", function (req, res, next) {
    var hosts = new hosts_1.default();
    res.send(hosts.getAll());
})
    .post("/", function (req, res, next) {
    res.send({
        Hello: "World"
    });
});
//# sourceMappingURL=hosts.js.map