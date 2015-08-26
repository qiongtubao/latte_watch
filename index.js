(function(){
    /**
      缺点: 在ready 之后close   好像会阻塞http
    */
    this.create = function(path) {
        var Watcher = require("./lib/index.js");
        return  new Watcher(path);
    }
    this.createFiles = function() {
        var Watcher = require("./lib/files.js");
        var watcher =  new Watcher();
        var args = Array.prototype.slice.call(arguments);
        args.forEach(function(o){
          watcher.add(o);
        });
        return watcher;
    }
}).call(module.exports);
