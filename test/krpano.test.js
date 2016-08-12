const should = require('should');

const config = {
  krpath: '/home/chenyang/opt/krpano-1.19-pr5'
};

var krpano = require('../').create(config);
//var krpano2 = require('../').create(config);

describe('krpano',function () {
  //describe('make from internet ',function () {
  //  it('should have result',function (done) {
  //    krpano.makepano({
  //      url: 'http://www.xuanran001.com/public/repository/708a/6be2/40ca/4f9f/b05c/f622/5eda/fca1/image/0000.png'
  //    }).then(function (result) {
  //      result.should.be.an.instanceOf(Object);
  //      done();
  //    });
  //  });
  //});
  describe('#makepano()', function () {
    context('when not given template name', function () {
      it('should use default normal template and return object',function (done) {
        krpano.makepano({
          url: __dirname+'/test.jpg'
        }).then(function(result) {
          result.should.be.an.instanceOf(Object);
          done();
        });
      });
    });

    context('when use normal template', function () {
      it('should return object',function (done) {
        krpano.makepano({
          url: __dirname+'/test.jpg',
          tpl: 'normal'
        }).then(function(result) {
          result.should.be.an.instanceOf(Object);
          done();
        });
      });
    });

    context('when use flat template', function () {
      it('should return object',function (done) {
        krpano.makepano({
          url: __dirname+'/test.jpg',
          tpl: 'flat'
        }).then(function(result) {
          result.should.be.an.instanceOf(Object);
          done();
        });
      });
    });
  });
});
