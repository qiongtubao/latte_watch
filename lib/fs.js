var Fs = require("fs")
    , util = require("util")
    , events = require("events").EventEmitter;
var Watch = function(path) {
    this.path = path;
    this.watchers = {};
    this.addDir(path);
};
util.inherits(Watch, events);
(function() {
    this.addDir = function(path) {
        var stat = Fs.lstatSync(path);
        var self = this;
        if(stat.isDirectory()) {
            Fs.readdirSync(path).forEach(function(file) {
                self.addDir(path + "/" + file);
            });
            var f ;
            this.watchers[path] = Fs.watch(path, function(event, filename, a) {
                //console.log(event, filename, a);
                if(event == "rename") {
                  //添加文件夹, 删除文件夹, 添加文件,删除文件,修改文件夹名（第一次原来的文件夹名，第2次改后的文件夹名）
                   try {
                      var stat = Fs.lstatSync(path + "/" + filename);
                      if(stat.isDirectory()) {
                          self.addDir(path + "/" + filename);
                      }else{
                          self.emit("add", path + "/" + filename);
                      }
                   } catch(e) {
                      if(self.watchers[path + "/" + filename]) {
                          self.close(path + "/" + filename /*, function(type, p) {
                              if(type == "dir") {
                                  self.emit("unlinkDir", p);
                              }else if(type == "file"){
                                  self.emit("unlink", p);
                              }
                          }*/);
                          self.emit("unlinkDir", path + "/"+ filename);
                      }else{
                          self.emit("unlink", path + "/" + filename);
                      }
                      self.close(path + "/" + filename);
                   }
                } else if(event == "change"){
                    //修改文件但是会有2次事件
                    if(!f) {
                       f = filename;
                    }else if( f == filename){
                        f = null;
                        self.emit("change", path+"/"+filename);
                    }
                }
            });
            self.emit("addDir", path);
        }
    }
    this.addFile = function(path) {

    }
    this.unwatch = function(path) {
        for(var i in this.watchers) {
            if(i.indexOf(path+"/") != -1 || i == path) {
                self.close(i);
            }
        }
    }
    this.close = function(path) {
        var self = this;
        if(path) {
            if(this.watchers[path] ) {
              if(this.watchers[path].close) {
                this.watchers[path].close();
              }else{
                Fs.unwatchFile(path);
              }
              this.watchers[path] = null;
              delete this.watchers[path];
            }

        }else{
            for(var i in this.watchers) {
                self.close(i);
            }
        }

    }
    /**
      this.add = function(paths) {
          this.watchers.add(paths);
      }
      this.unwatch = function(paths) {
          this.watcher.unwatch(paths);
      }
      this.close = function() {
          this.watcher.close();
      }
    */
}).call(Watch.prototype);
(function() {
    this.create = function(path) {
        return new Watch(path);
    }
}).call(module.exports);
