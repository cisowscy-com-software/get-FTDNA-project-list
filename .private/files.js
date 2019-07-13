const fs = require('fs');
const path = require('path');
class Address {
    constructor(src) {
        this.src = src;
    }
    toOustOfTab() {
        try {
            if (fs.existsSync(this.src)) {
                fs.unlinkSync(this.src);
            }
        } catch (err) {
            console.error(err);
        }
    }
    toZeroOfTab() {
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
    toReadOfTab() {
        try {
            if (fs.existsSync(this.src)) {
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
    toSaveOfTab(data) {
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
            return (fs.existsSync(this.src) && JSON.parse(fs.readFileSync(this.src, 'utf8')).length > 0);
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}
module.exports = Address;