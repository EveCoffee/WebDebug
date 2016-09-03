var fs = require("fs"),
    lodash = require("lodash"),
    os = require("os");

class Hosts{

    constructor(){

        this._hostString = ""; // hosts文件的字符串形式
        this.hostDict = {}; // hosts字符串解析后的键值对
        this.hostPath = ""; // hosts文件的路径

        this.LF = "\n"; // 换行符
        this.IP_RE = "\\d{1,4}\\.\\d{1,4}\\.\\d{1,4}\\.\\d{1,4}";

        this.init();
    }

    init(){

        if(!this.hostPath){

            switch (os.platform()){
                case "linux":
                case "darwin":
                    this.hostPath = "/etc/hosts";
                    break;

                case "win64":
                case "win32":
                    this.hostPath = "";

            }

        }

        this.hostString = fs.readFileSync(this.hostPath).toString();
    }

    set hostString(val){

        if(this._hostString === val){
            return;
        }

        this._hostString = val;

        this.hostDict = this.getAll();
    }

    get hostString(){
        return this._hostString;
    }

    /**
     * 通过域名查找hosts对应的ip
     * @param domain 域名
     * @returns string | null ip或者null
     */
    get(domain){

        if(this.hostDict[domain]){
            return this.hostDict[domain];
        }else{
            return null;
        }

    }

    /**
     * 设置域名以及对应的ip, 不存在则创建
     * @param domain string
     * @param ip string
     */
    set(domain, ip){

        if(this.hostDict[domain]){

            for(let line of this.hostString.split("\n")){

                if(/^[\s|#]+/.test(line) || line === ""){
                    continue;
                }

                let _list = lodash.compact(line.split(/\s+/));
                if(_list.length !== 2){
                    continue;
                }

                // 找到对应行, 开始替换
                if(_list[1] === domain){
                    this.hostString = this.hostString.replace(line, line.replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, ip));
                }

            }

        }else{
            this.hostString = this.hostString + "\n" + `${ip} ${domain}`;
        }

    }

    /**
     * 返回hosts的键值
     */
    getAll(){

        var hostsDict = {};

        for(let line of this.parse(this.hostString)){

            if(/^[\s|#]+/.test(line) || line === ""){
                continue;
            }

            var _list = lodash.compact(line.split(/\s+/));

            if(_list.length < 2 || !new RegExp(`^${this.IP_RE}$`).test(_list[0])){
                continue;
            }

            // [ '127.0.0.1', 'busi.sit.quba360.com', 'www.baidu.com' ]

            var ip = _list[0],
                domainList = _list.concat().slice(1);

            domainList.forEach(domain => {
                hostsDict[domain] = ip;
            });

            // hostsDict[_list[1]] = _list[0];

        }

        return hostsDict;

    }

    /**
     * 删除对应的域名解析
     * @param domain
     * @returns {boolean} 删除成功则返回true(不存在也算), 权限不够无法修改时返回否
     */
    del(domain){


        for(let line of this.hostString.split(this.LF)){

            if(/^[\s|#]+/.test(line) || line === ""){
                continue;
            }

            var _list = lodash.compact(line.split(/\s+/));
            if(_list.length !== 2){
                continue;
            }

            // 找到后直接删除并保存
            if(_list[1] === domain){

                this.hostString = this.hostString.replace(line, "");

                return this.save();
            }

        }

        return true;
    }

    /**
     * 将内存的hosts回写到系统文件
     */
    save(){
        this.format();

        try{
            fs.writeFileSync(this.hostPath, this.hostString);
            return true;
        }catch (e){
            return false;
        }
    }

    /**
     * hosts字符串格式化
     * 域名和ip对齐, 删除多余空行。
     * @private
     */
    format(){
        var n = 1;

        // 替换掉多余空行
        while (this.hostString.indexOf(`${this.LF.repeat(2)}`) !== -1){
            this.hostString = this.hostString.replace(this.LF.repeat(2), this.LF);
        }

        // 缓存hostString分割后的长度
        var tempList = this.hostString.split(this.LF);

        // 计算ip的最大长度
        var maxIPLength = ((hostStr) => {
            var len = 0;
            var re = new RegExp(this.IP_RE, "g");

            var ipList = hostStr.match(re);
            if(ipList){
                ipList.forEach(ip => {
                    if(ip.length > len){
                        len = ip.length
                    }
                });
            }

            return len;
        })(this.hostString);

        tempList = tempList.map((line, index) => {

            if(new RegExp(this.IP_RE).test(line)){

                var list = line.split(/\s+/);

                // 保证最长ip的占位
                list[0] = list[0] + " ".repeat(maxIPLength - list[0].length);

                line = list.join(" ");
            }

            return line;
        });

        this.hostString = tempList.join(this.LF);

        return this;
    }

    parse(hostString = ""){

        // TODO: 这里可能需要检测\r\n、\r、\n 等各种换行
        // 因为这里需要保持原有格式, 所以不准备进行替换清除
        var list = hostString.split("\n");

        return list;
    }
}

module.exports = Hosts;

