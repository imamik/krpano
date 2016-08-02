const Promise = require('bluebird');
const fs = require('fs');
const request = require('request');

var headersToSign = [];

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
            resolve({
              success: true
            });
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
   * @param {String} tmpPath file path
   * @return {Promise}
   */
	function download(uri, tmpPath) {
    return new Promise(function (resolve, reject) {
	  	request.head(uri, function(err, res, body){
	  	  console.log('content-type:', res.headers['content-type']);
	  	  console.log('content-length:', res.headers['content-length']);
	
	  	  request(uri)
          .pipe(fs.createWriteStream(tmpPath))
          .on('close', function () {
            console.log('request close');
            resolve(tmpPath);
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
		  const krpanotools = '/home/chenyang/opt/krpano-1.19-pr5/krpanotools',
        configFile = '-config=/home/chenyang/opt/krpano-1.19-pr5/templates/normal.config',
        askforxmloverwrite = '-askforxmloverwrite=false',
        //inputFile = '/home/chenyang/projects/krpano/0000.jpg',
        htmlpath = '-htmlpath=%INPUTPATH%/output/%BASENAME%.html',
        xmlpath = '-xmlpath=%INPUTPATH%/output/%BASENAME%.xml',
        previewpath = '-previewpath=%INPUTPATH%/output/%BASENAME%.tiles/preview.jpg',
        thumbpath = '-thumbpath=%INPUTPATH%/output/%BASENAME%.tiles/thumb.jpg',
        tempcubepath = '-tempcubepath=%INPUTPATH%/output/%BASENAME%_cube%UID%',
        // fix bug: krpanotools will move `[_c]` to end.
        // fix bug: `%v` and `%h` not exist.
        //tilepath = '-tilepath=%INPUTPATH%/output/%BASENAME%.tiles/l%Al[_c]_%Av_%Ah.jpg',
        tilepath = '-tilepath=%INPUTPATH%/output/%BASENAME%.tiles/l%Al[_c].jpg',
        customimage = '-customimage[mobile].path=%INPUTPATH%/output/%BASENAME%.tiles/mobile_%s.jpg';

		  var spawn = require('child_process').spawn;
		  var krpano = spawn(krpanotools, [
		  	'makepano',
        configFile,
        askforxmloverwrite,
        htmlpath, xmlpath, previewpath, thumbpath, tempcubepath, tilepath, customimage,
        inputFile
		  ]);

      console.log(`Spawned child file: ${krpano.spawnfile}`);
      console.log(`Spawned child pid: ${krpano.pid}`);
      console.log(`Spawned child args: ${krpano.spawnargs.join(' ')}`);
		  
		  krpano.stdout.on('data', function (data) {
        // verbose output.
        //console.log(`stdout: ${data}`);
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
