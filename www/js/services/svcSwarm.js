angular.module('leth.services')
.factory('SwarmService', function ($http, $q) {
  var PROVIDER = "http://swarm-gateways.net";
  var swarm;

  try{
    swarm=Swarm.at(PROVIDER);
  }catch(e){
    console.log(e);
  }

  var print = function print(val) {
    console.log(val);
    var result = toHTML(val);
    console.log(result);
  };

  var resolve = function resolve(val) {
    console.log(val);
    var result = toHTML(val);
    console.log(result);

    return result;
  };

  // Interprets data as text/png/jpg/raw/directory, builds an HTML
  var toHTML = function toHTML(val) {
    // Directory
    if (val instanceof Object && !val.length) {
      var dir = [];
      for (var key in val) {
        console.log(toHTML(key));
        console.log(toHTML(val[key].data));
        var el = { k: key, v: val[key].data };
        dir.push(el);
      }
      return dir;

      // String
    } else if (typeof val === "string") {
      return val;

      // Buffer
    } else if (val.length) {
      // PNG
      if (val[1] === 80 && val[2] === 78 && val[3] === 71) {
        var image = "data:image/png;base64," + btoa(String.fromCharCode.apply(null, val));
        return image;

        // JPG
      } else if (val[0] === 0xFF && val[1] === 0xD8 && val[val.length - 2] === 0xFF && val[val.length - 1] === 0xD9) {
        var image = "data:image/jpg;base64," + btoa(String.fromCharCode.apply(null, val));
        return image;

        // Plain text / binary data
      } else {
        var isText = true;
        for (var i = 0; i < val.length; ++i) {
          if (val[i] < 32 || val[i] > 126) isText = false;
        }return toHTML(isText ? [].map.call(val, function (c) {
          return String.fromCharCode(c);
        }).join("") : [].map.call(val, function (b) {
          return ("00" + b.toString(16)).slice(-2);
        }).join(""));
      };
    };
  };

  return {
    setProvider: function setProvider() {
      swarm = Swarm.at(PROVIDER);
    },
    download: function download(hash) {
      var q = $q.defer();
      swarm.download(hash).then(function (response) {
        q.resolve(toHTML(response));
      }, function (response) {
        q.reject(response);
      });
      return q.promise;
      //swarm.download(hash).then(resolve).catch(console.log);        
    },
    downloadRw: function downloadRw(hash) {
      var q = $q.defer();
      swarm.download(hash).then(function (response) {
        q.resolve(response);
      }, function (response) {
        q.reject(response);
      });
      return q.promise;
    },
    upload: function upload(dir) {
      var q = $q.defer();
      swarm.upload(dir).then(function (response) {
        q.resolve(response);
      }, function (response) {
        q.reject(response);
      });
      return q.promise;
    }
  };
});