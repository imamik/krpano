const should = require('should');

const config = {
  bin: '/home/chenyang/opt/krpano-1.19-pr5/krpanotools'
};

var krpano = require('../').create(config);
var krpano2 = require('../').create(config);

describe('test/krpano.test.js',function () {
  describe('make from internet ',function () {
    it('should have result',function (done) {
      krpano.makepano({
        url: 'http://www.xuanran001.com/public/repository/708a/6be2/40ca/4f9f/b05c/f622/5eda/fca1/image/0000.png'
      }).then(function (result) {
        result.should.be.an.instanceOf(Object);
        done();
      });
    });
  });
  describe('make from local url  ',function () {
    it('should return object',function (done) {
      ocr.scan({
        url: __dirname+'/test.jpg'
      }).then(function(result) {
        result.should.be.an.instanceOf(Object);
        done();
      });
    });
  });
});
