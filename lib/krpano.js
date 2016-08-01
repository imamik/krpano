const Promise = require('bluebird');
const fs = require('fs');
const request = require('request');

var headersToSign = [];

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

function Krpano(config) {
  /**
   * ```json
   * {
   *   "bin": "/home/chenyang/opt/krpano-1.19-pr5/krpanotools"
   * }
   * ```
   */
  this.config = config;
}

module.exports.create = function(config) {
  return new Krpano(config);
};

/**
 * wrap for krpanotools:
 *
 * ```
 * $ krpanotools makepano -config=normal.config input.jpg
 * ```
 *
 * @method makepano
 * @param {Object} opt config object
 * @return {Promise}
 */
Krpano.prototype.makepano = function makepano(opt) {

  return new Promise(function (resolve, reject) {
    getImg(opt.url, "/tmp/xxdebug.png")
      .then(function(path) {
        run(path)
          .then(function () {
            resolve();
          })
          .catch(function (err) {
            reject(err, "run");
          });
      })
      .catch(function (err) {
        reject(err, "getImg");
      });
  });

  /**
   * get source image
   *
   * @method getImg
   * @param {String} url source image path or url.
   * @param {String} path dest image path.
   * @return {Promise}
   */
  function getImg(url, path) {
    if (url.startsWith('http') || url.startsWith('https')) {
      return download(url, path);
    } else {
      return new Promise(function (resolve, reject) {
        resolve(url);
      });
    }
  }

  /**
   * download image from internet.
   *
   * @method download
   * @param {String} uri download url
   * @param {String} filename file path
   * @return {Promise}
   */
	function download(uri, filename) {
    return new Promise(function (resolve, reject) {
	  	request.head(uri, function(err, res, body){
	  	  console.log('content-type:', res.headers['content-type']);
	  	  console.log('content-length:', res.headers['content-length']);
	
	  	  request(uri)
          .pipe(fs.createWriteStream(filename))
          .on('close', function () {
            console.log('request close');
            resolve();
				  })
          .on('error', function (err) {
            console.log(err);
            reject(err);
          });
	  	});
		});
	}

  function run(inputFile) {
    return new Promise(function (resolve, reject) {
		  var krpanotools = '/home/chenyang/opt/krpano-1.19-pr5/krpanotools';
      var configFile = '-config=/home/chenyang/opt/krpano-1.19-pr5/templates/normal.config';
      //var inputFile = '/home/chenyang/projects/krpano/0000.jpg';

		  var spawn = require('child_process').spawn;
		  var krpano = spawn(krpanotools, [
		  	'makepano',
        configFile,
        inputFile
		  ]);
		  
		  krpano.stdout.on('data', function (chunk) {
		    // output will be here in chunks
        console.log(chunk);
		  });

      krpano.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });

      krpano.on('error', (err) => {
        console.log('Failed to start child process.');
        console.log(err);
      });

      krpano.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        resolve();
      });
    });
  }

};
