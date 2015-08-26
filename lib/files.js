var util = require("util")
  , events = require("events").EventEmitter
  , Fs = require("fs");
  function Watcher() {
      this.files = {};
  }
  util.inherits(Watcher, events);
  (function() {
      this.add = function(file) {
          var self = this;
          var watcherFunc = function(curr, prev) {
              self.emit("change", file, curr, prev);
          };
          var watcher = Fs.watchFile(file, watcherFunc);
          this.files[file] = watcherFunc;
      }
      this.remove = function(file) {
          Fs.unwatchFile(file, this.files[file]);
          delete this.files[file];
      }
  }).call(Watcher.prototype);
  module.exports = Watcher;
