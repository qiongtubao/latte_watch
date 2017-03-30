
    var util = require("util")
      , events = require("events").EventEmitter
      , chokidar = require("chokidar");
    function Watcher(path) {
        this.path = path;

        this.watcher = chokidar.watch(path, {
            ignored: path,
            persistent: true
        });
        var self = this;
        this.watcher.on("add", function(path) {
            //  添加文件  raw事件是 unknown
            self.emit("add", path);
        });
        this.watcher.on("change", function(path, stats) {
            //修改文件  raw事件  是modified
            self.emit("change", path);
        });
        this.watcher.on("unlink", function(path) {
            //删除文件  raw事件 moved
            self.emit("unlink", path);
        });
        this.watcher.on("addDir", function(path, stats) {
            //加载监控文件夹的时候也会触发   一开始加载的时候不会触发raw
            //创建监控文件夹时候  raw root-changed   当一开始没这个文件夹的话 启动后在添加文件夹并不起作用
            self.emit("addDir", path, stats);
        });
        this.watcher.on("unlinkDir", function(path) {
            //删除大文件夹的时候会先删除内子文件夹
            //删除文件夹 raw事件  moved
            self.emit("unlinkDir", path);
        });
        this.watcher.on("error", function(error) {
            self.emit("error", error);
        });
        this.watcher.on("ready", function(path, status) {
            //加载完成之后触发
            self.emit("ready");
        });
        this.watcher.on("raw", function(event, path, details) {
            self.emit("raw", event, path, details);
        });
    };
    util.inherits(Watcher, events);
    (function(){
        this.add = function(paths) {
            this.watcher.add(paths);
        }
        this.unwatch = function(paths) {
            this.watcher.unwatch(paths);
        }
        this.close = function() {
            this.watcher.close();
        }
    }).call(Watcher.prototype);
    module.exports = Watcher;
