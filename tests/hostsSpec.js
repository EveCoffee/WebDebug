/**
 * Created by coffee on 8/28/16.
 */

var Hosts = require("../modules/hosts");
var fs = require("fs");


describe("A suite is just a function", function() {


    var host = `
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1      	localhost
255.255.255.255	broadcasthost
::1             localhost
127.0.0.1 windows10.microdone.cn
127.0.0.1 busi.sit.quba360.com www.wangchaoyi.com
    `;

    var hosts = new Hosts();
    hosts.hostString = host; // 设置模拟数据进行测试

    it("返回host的键值对", function () {
        expect(hosts.getAll()["busi.sit.quba360.com"]).toBe("127.0.0.1");
    });

    it("ip => 域名一对多解析", function () {
        expect(hosts.getAll()["www.wangchaoyi.com"]).toBe("127.0.0.1");
    });


    it("返回正确的ip解析", function () {
        expect(hosts.get("busi.sit.quba360.com")).toBe("127.0.0.1");
    });


    it("设置域名解析" , function () {
        hosts.set("test.wangchaoyi.com", "114.114.114.114");
        expect(hosts.get("test.wangchaoyi.com")).toBe("114.114.114.114");
    });

    /**
     * 重新读取hosts文件,
     */
    it("尝试写入hosts文件", function () {

        var hosts = new Hosts();

        var _oldHostString = hosts.hostString; // 保存原始的等待恢复

        hosts.set("tests", "192.168.199.151");

        expect(hosts.save()).toBe(true);

        // hosts.hostString = _oldHostString;
        // hosts.save();

    });
    it("尝试删除hosts解析域名", function () {
        hosts.init();

        hosts.del("tests");

        expect(hosts.get("tests")).toBe(null);

        expect(hosts.del("blog.wangchaoyi.com")).toBe(true);

        hosts.save();
    });

});

