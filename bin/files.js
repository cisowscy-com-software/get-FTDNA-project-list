const fs = require('fs');
const path = require('path');
class Address {
    constructor(src) {
        this.src = src;
    }
    toOustOfJSON() {
        try {
            if (fs.existsSync(this.src)) {
                fs.unlinkSync(this.src);
            }
        } catch (err) {
            console.error(err);
        }
    }
    toOustOfEvry() {
        try { var files = fs.readdirSync(this.src); }
      catch(e) { return; }
      if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
          var filePath = this.src + '/' + files[i];
          if (fs.statSync(filePath).isFile())
            fs.unlinkSync(filePath);
          else
            rmDir(filePath);
        }
      fs.rmdirSync(this.src);
    }
    toZeroOfJSON() {
        try {
            if (!fs.existsSync(this.src)) {
                try {
                    if (path.dirname(this.src) != "." && path.dirname(this.src) != "/" && !fs.existsSync(path.dirname(this.src))) {
                        fs.mkdirSync(path.dirname(this.src), {
                            recursive: true
                        });
                    }
                } catch (err) {
                    console.error(err);
                }
                try {
                    fs.writeFileSync(this.src, JSON.stringify([], null, 4));
                } catch (err) {
                    console.error(err);
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
    toReadOfJSON() {
        try {
            if (fs.existsSync(this.src) && fs.readFileSync(this.src, 'utf8')!="undefined") {
                return JSON.parse(fs.readFileSync(this.src, 'utf8'));
            } else {
                console.log("file is not exist");
                return [];
            }
        } catch (err) {
            console.error(err);
            return false;
        }
    }
    toSaveOfJSON(data) {
        try {
            if (path.dirname(this.src) != "." && path.dirname(this.src) != "/" && !fs.existsSync(path.dirname(this.src))) {
                fs.mkdirSync(path.dirname(this.src), {
                    recursive: true
                });
            }
        } catch (err) {
            console.error(err);
        }
        try {
            fs.writeFileSync(this.src, JSON.stringify(data, null, 4));
        } catch (err) {
            console.error(err);
        }
    }
    isFileExist() {
        try {
            return fs.existsSync(this.src);
        } catch (err) {
            console.error(err);
            return false;
        }
    }
    isItemInTab() {
        try {
            return (fs.existsSync(this.src) && fs.readFileSync(this.src, 'utf8')!="undefined" && JSON.parse(fs.readFileSync(this.src, 'utf8')).length > 0);
        } catch (err) {
            console.error(err);
            return false;
        }
    }
    
    isItemInTabInTab() {
        try {
            return (fs.existsSync(this.src) && fs.readFileSync(this.src, 'utf8')!="undefined" && JSON.parse(fs.readFileSync(this.src, 'utf8'))[0].length > 0);
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}
module.exports = Address;