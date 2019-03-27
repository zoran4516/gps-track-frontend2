var conver = {
    x_PI: 3.14159265358979324 * 3000.0 / 180.0,
     PI: 3.1415926535897932384626,
    a : 6378245.0,
    ee: 0.00669342162296594323,
    //gps->高德
    wgs84togcj02: function(lng, lat){
      if (this.out_of_china(lng, lat)) {
          return [lng, lat]
      }else{
        //console.log('gps->高德');
        var dlat = this.transformlat(lng - 105.0, lat - 35.0);
          var dlng = this.transformlng(lng - 105.0, lat - 35.0);
          var radlat = lat / 180.0 * this.PI;
          var magic = Math.sin(radlat);
          magic = 1 - this.ee * magic * magic;
          var sqrtmagic = Math.sqrt(magic);
          dlat = (dlat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtmagic) * this.PI);
          dlng = (dlng * 180.0) / (this.a / sqrtmagic * Math.cos(radlat) * this.PI);
          var mglat = lat + dlat;
          var mglng = lng + dlng;
          return [mglng, mglat]
        }
    },
    //高德->百度
    gcj02tobd09:function (lng, lat) {
        //console.log('高德->百度');
          var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * this.x_PI);
          var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * this.x_PI);
          var bd_lng = z * Math.cos(theta) + 0.0065;
          var bd_lat = z * Math.sin(theta) + 0.006;
          return [bd_lng, bd_lat]
      },
      //高德->gps
      gcj02towgs84:function (lng, lat) {
        if (this.out_of_china(lng, lat)) {
            return [lng, lat]
        }else{
            var dlat = this.transformlat(lng - 105.0, lat - 35.0);
            var dlng = this.transformlng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 *  this.PI;
            var magic = Math.sin(radlat);
            magic = 1 - this.ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtmagic) * this.PI);
            dlng = (dlng * 180.0) / (this.a / sqrtmagic * Math.cos(radlat) * this.PI);
            var mglat = lat + dlat;
            var mglng = lng + dlng;
            return [lng * 2 - mglng, lat * 2 - mglat]
          }
    },
    transformlat: function(lng, lat) {
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * this.PI) + 40.0 * Math.sin(lat / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * this.PI) + 320 * Math.sin(lat * this.PI / 30.0)) * 2.0 / 3.0;
        return ret
    },
    transformlng: function(lng, lat) {
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * this.PI) + 40.0 * Math.sin(lng / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * this.PI) + 300.0 * Math.sin(lng / 30.0 * this.PI)) * 2.0 / 3.0;
        return ret
    },
     out_of_china:function(lng, lat) {
        return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
    }
}
module.exports = conver;
