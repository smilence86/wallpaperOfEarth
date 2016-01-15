var Promise = require('bluebird');
var os = require('os');
var fs = Promise.promisifyAll(require('fs'));
var mkdirp = require('mkdirp');
var superagent = Promise.promisifyAll(require('superagent'));
var process = require('child_process');

function Wallpaper(){
    this.url_begin = 'http://himawari8-dl.nict.go.jp/himawari8/img/D531106/1d/550/';
    this.url_end = '_0_0.png';
    this.filename = '';
    this.folder = '/wallpaperOfEarth/';
    this.command = 'gsettings set org.gnome.desktop.background picture-uri "file://path" && gsettings set org.gnome.desktop.background picture-options "centered" && gsettings set org.gnome.desktop.background primary-color "#000000"';
}

Wallpaper.prototype.getPhotoUrl = function(){
    var that = this;
    return superagent.get('http://himawari8.nict.go.jp/img/D531106/latest.json').endAsync().then(function(res){
        that.filename = res.body.file;
        var time = res.body.date.replace(/-/g, '/').replace(/ /, '/').replace(/:/g, '');
        return that.url_begin + time + that.url_end;
    });
}

Wallpaper.prototype.savePhoto = function(url){
    var that = this;
    return new Promise(function(resolve, reject){
        var stream = fs.createWriteStream(that.folder + that.filename);
        superagent.get(url).pipe(stream);
        stream.on('finish', function(){
            resolve(that.folder + that.filename);
        });
        stream.on('error', function(e){
            reject(e);
        });
    });
}

Wallpaper.prototype.setWallpaper = function(filepath){
    return this.execShell(this.command.replace(/path/, filepath));
}

Wallpaper.prototype.execShell = function(cmd){
    // process.exec('echo ' + cmd + ' >> /root/pomelo_history.log', function(e, stdout, stderr){
    //
    // });
    return new Promise(function(resolve, reject){
        process.exec(cmd, function(e, stdout, stderr){
            if(e){
    			reject(e);
            }else{
            	resolve(stdout);
            }
        });
    });
}

Wallpaper.prototype.mkdir = function(dir){
    return new Promise(function(resolve, reject){
        mkdirp(dir, function(err){
            if(err){
                return reject(err);
            }
            resolve();
        });
    });
}

Wallpaper.prototype.getDir = function(){
    var that = this;
    return new Promise(function(resolve, reject){
        that.folder = os.homedir() + that.folder;
        resolve(that.folder);
    });
}

Wallpaper.prototype.removePhotos = function(path){
    return new Promise(function(resolve, reject){

    });
}

var w = new Wallpaper();
w.getDir().then(function(dir){
    return w.mkdir(dir);
}).then(function(){
    return w.getPhotoUrl();
}).then(function(url){
    return w.savePhoto(url);
}).then(function(filepath){
    return w.setWallpaper(filepath);
}).catch(function(e){
    console.error(e.stack || e);
});
