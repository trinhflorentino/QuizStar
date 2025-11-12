if(!window.console) window.console = {};
var methods = ["log", "debug", "warn", "info", "dir", "dirxml", "trace", "profile"];
for(var i=0;i<methods.length;i++){
    console[methods[i]] = function(){};
}