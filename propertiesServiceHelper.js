var ps = (function () {
  var ps_ = PropertiesService.getScriptProperties();
  
  var psParam = {
    store: function (key, obj) {
      obj = JSON.stringify(obj);
      ps_.setProperty(key, obj);

      return this;
    },
    fetch: function (key) {
      var parsedKey = JSON.parse(ps_.getProperty(key));
      return parsedKey;
    },
    clear: function (key) {
      ps_.deleteProperty(key);
    }
  }
  
  return psParam;
}())


function test () {
  var ps = this.ps;
  ps.store('testing', {greet: 'howdy'});
  
  var greeting = ps.fetch('testing');
  Logger.log(greeting);
  Logger.log(greeting.greet);
}
