/**
 * Created by coffee on 8/28/16.
 */

var express = require("express"),
    router = express.Router();

var Hosts = require("../modules/hosts");

router
    .get("/", function (req, res, next) {
        var hosts = new Hosts();
        res.send(hosts.getAll());
    })
    .post("/", function (req, res, next) {
        res.send({
            Hello: "World"
        });
    })
;

module.exports = router;