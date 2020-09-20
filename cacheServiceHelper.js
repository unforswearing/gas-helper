var cs = (function () {
  var cs_ = CacheService.getScriptCache();
  
  var csParam = {
    store: function (key, obj) {
      obj = JSON.stringify(obj);
      cs_.put(key, obj, 21600);
      return this;
    },
    fetch: function (key) {
      var parsedKey = JSON.parse(cs_.get(key));
      return parsedKey;
    },
    clear: function (key) {
      cs_.remove(key);
    }
  }
  
  return csParam;
}())

function test () {
  cs.store('testing', {greet: 'howdy'})
  
  var greeting = cs.fetch('testing');
  Logger.log(greeting);
  Logger.log(greeting.greet) ;
}
