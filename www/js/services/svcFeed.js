angular.module('leth.services')
.factory('FeedService', function($http, FeedEndpoint){
    var BASE_URL = FeedEndpoint.url; //"https://blog.ethereum.org/feed/";
    var items = [];
    
    return {
      GetFeed: function(){
        return $http.get(BASE_URL+'?u=947c9b18fc27e0b00fc2ad055&id=257df01285').then(function(response){
          var x2js = new X2JS();
          var xmlText = response.data;
          var jsonObj = x2js.xml_str2json( xmlText );
          items = jsonObj;
          return items.rss.channel.item;
        });
      },
      GetNew: function(){
        return $http.get(BASE_URL+'?u=947c9b18fc27e0b00fc2ad055&id=257df01285').then(function(response){
          var x2js = new X2JS();
          var xmlText = response.data;
          var jsonObj = x2js.xml_str2json( xmlText );
          items = jsonObj; 
          return items.rss.channel.item;
        });
      },
      GetOld: function(){
        return $http.get(BASE_URL+'?u=947c9b18fc27e0b00fc2ad055&id=257df01285').then(function(response){
          var x2js = new X2JS();
          var xmlText = response.data;
          var jsonObj = x2js.xml_str2json( xmlText );
          items = jsonObj; 
          return items.rss.channel.item;        
        });
      },
      GetBonus: function(item){
         return alert('Bonus - ' + item);
      },
      get: function(index) {
        return items.rss.channel.item[index];
      },
      remove: function(item) {
        items.rss.channel.item[index].pop(item);
        return items.rss.channel.item[index];
      }
    }
  })