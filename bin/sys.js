const fs = require('fs-extra');
const logInAs = [fs.readFileSync('./config/USERNAME.txt', 'utf8'),fs.readFileSync('./config/PASSWORD.txt', 'utf8')];
const puppeteer = require('puppeteer');
const puppeteer_config = fs.readJsonSync('./config/CHROME.txt');
const readable_file =  fs.readJsonSync('./config/READABLE.txt');
class Sys {
    static async initCHROME() {
        const browser = await puppeteer.launch(puppeteer_config.launch);
        const page = await browser.newPage();
        page.setViewport(puppeteer_config.setViewport);
        await page.goto("https://www.familytreedna.com/login.aspx");
        await page.click("#kitnum-input");
        await page.keyboard.type(logInAs[0]);
        await page.click("#password-input");
        await page.keyboard.type(logInAs[1]);
        await page.click("#sign-in-btn");
        await page.waitForNavigation();
        return {
            browser,
            page
        };
    }
    static thisSolution(TimeStart) {
        const file = './.temp/_lastRun.json';  
        TimeStart = Number.isInteger(TimeStart) ? TimeStart : new Date(TimeStart).getTime();      
        if (!fs.pathExistsSync(file) || (fs.pathExistsSync(file) && !Array.isArray(fs.readJsonSync(file))) || (fs.pathExistsSync(file) && Array.isArray(fs.readJsonSync(file)) && fs.readJsonSync(file).length<1)) {
            fs.removeSync(file);
            fs.outputJsonSync(file, [TimeStart]);
        } 
        switch (arguments.length) {
            case 1:
                if (fs.readJsonSync(file)[0] != TimeStart) {
                    let T = fs.readJsonSync(file);
                    T.unshift(TimeStart);
                    fs.outputJsonSync(file, T);
                }
                return TimeStart;
            case 0:
                return fs.readJsonSync(file)[0];
        } 
    }
    static timeflow(procesNAME, solutionTHIS, timeSTART, tempName) {
        if (arguments.length==4) {
            timeSTART = parseInt(fs.readFileSync("./.temp/" + solutionTHIS + "/__"+tempName+".temp", 'utf8'));
        }
        function duration(t0){
            let d = (new Date()) - (new Date(t0));
            let weekdays     = Math.floor(d/1000/60/60/24/7);
            let days         = Math.floor(d/1000/60/60/24 - weekdays*7);
            let hours        = Math.floor(d/1000/60/60    - weekdays*7*24            - days*24);
            let minutes      = Math.floor(d/1000/60       - weekdays*7*24*60         - days*24*60         - hours*60);
            let seconds      = Math.floor(d/1000          - weekdays*7*24*60*60      - days*24*60*60      - hours*60*60      - minutes*60);
            let milliseconds = Math.floor(d               - weekdays*7*24*60*60*1000 - days*24*60*60*1000 - hours*60*60*1000 - minutes*60*1000 - seconds*1000);
            let t = {};
            ['weekdays', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'].forEach(q=>{ if (eval(q)>0) { t[q] = eval(q); } });
            return t;
        }
        const file = './event-log.txt';
        timeSTART = Number.isInteger(timeSTART) ? timeSTART : new Date(timeSTART).getTime();
        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, JSON.stringify({solution:{}}, null, 4));
        }
        let eventLog = fs.readJsonSync(file);
        if (!eventLog.solution.hasOwnProperty(solutionTHIS)) {
            eventLog.solution[solutionTHIS] = {};        
        }
        if (!eventLog.solution[solutionTHIS].hasOwnProperty(procesNAME)) {
            eventLog.solution[solutionTHIS][procesNAME] = {};        
        }
        if (!eventLog.solution[solutionTHIS][procesNAME].hasOwnProperty(timeSTART)) {
            eventLog.solution[solutionTHIS][procesNAME][timeSTART] = duration(timeSTART);        
        }
        fs.writeFileSync(file, JSON.stringify(eventLog, null, 4));
        
    }   
    static timeflow_temp_start(solutionTHIS, tempName, timeSTART) {
        timeSTART = Number.isInteger(timeSTART) ? timeSTART : new Date(timeSTART).getTime();
        fs.outputFileSync("./.temp/" + solutionTHIS + "/__"+tempName+".temp", timeSTART);
    }
    static removeDeep(src) {
        try {
            var files = fs.readdirSync(src);
        } catch (e) {
            return;
        }
        if (files.length > 0)
            for (var i = 0; i < files.length; i++) {
                var filePath = src + '/' + files[i];
                if (fs.statSync(filePath).isFile())
                    fs.unlinkSync(filePath);
                else
                    rmDir(filePath);
            }
        fs.rmdirSync(src);
    }
    static projectsList(solutionTHIS) {
        return fs.readJsonSync('./db/json/V_Projects.'+ solutionTHIS + '.json');
    }
    static step1A() {
        const RAM = (function () {
            let R = parseInt(fs.readFileSync('./config/RAMinMB.txt', 'utf8'));
            R = ((typeof R == 'number' && !isNaN(R) && R > 3999) ? R : 4096);
            fs.outputFileSync("./config/RAMinMB.txt", R);
            return R;
        }());
        fs.outputFileSync("./step_1_B_.cmd", `node ./bin/step_1_B_.js  --max-old-space-size=${RAM}`);
        fs.outputFileSync("./step_1_C_.cmd", `node ./bin/step_1_C_.js  --max-old-space-size=${RAM}`);
        fs.outputFileSync("./step_1_D_.cmd", `node ./bin/step_1_D_.js  --max-old-space-size=${RAM}`);
    }
    static step1B(solutionTHIS, data) {
        const file = "./.temp/" + solutionTHIS + "/step_1_B_.json";
        switch (arguments.length) {
            case 1:
                return fs.readJsonSync(file);
            default:
                switch (readable_file) {
                    case 0:
                        fs.outputJsonSync(file, data);
                        break;            
                    case 1:
                        fs.outputFileSync(file, JSON.stringify(data, null, 4));
                        break;
                }
                break;
        }  
    }
    static step1C(solutionTHIS, dataPART) {
        const file = "./.temp/" + solutionTHIS + "/step_1_C_.log";
        switch (arguments.length) {
            case 1:
                return JSON.parse('[' + fs.readFileSync(file, 'utf8').slice(2) + ']');
            default:
                if (typeof dataPART === "boolean") {
                    fs.outputFileSync(file, "");
                } else {
                    fs.appendFileSync(file, ",\n" + JSON.stringify(dataPART) + "");
                    console.info(JSON.stringify(dataPART, null, 4));
                }
                break;
        }
    }
    static step1D(solutionTHIS, refactured) {
        refactured.forEach(r=>{
            switch (readable_file) {
                case 0:
                    fs.outputJsonSync('./db/json/' + Object.keys(r)[0]+'.'+ solutionTHIS + '.json',  r[Object.keys(r)[0]]);
                    break;            
                case 1:
                    fs.outputFileSync('./db/json/' + Object.keys(r)[0]+'.'+ solutionTHIS + '.json', JSON.stringify(r[Object.keys(r)[0]], null, 4));
                    break;
            }            
        });
        fs.unlinkSync('./step_1_B_.cmd');
        fs.unlinkSync('./step_1_C_.cmd');
        fs.unlinkSync("./.temp/" + solutionTHIS + "/step_1_B_.json");
        fs.unlinkSync("./.temp/" + solutionTHIS + "/step_1_C_.log");

    }
    static step2A(solutionTHIS, toGet){
        if (typeof toGet == "string") {
            return fs.readJsonSync('./.temp/' + solutionTHIS + '/step_2_B_list2download_'+ toGet.toUpperCase() +'_.json');        
        } else {
            for (let [key, data] of Object.entries(toGet)) {
                const file1 = './.temp/' + solutionTHIS + '/step_2_B_list2download_'+ key.toUpperCase() +'_.json';
                const file2 = './.temp/' + solutionTHIS + '/step_3_B_list4downloaded_'+ key.toUpperCase() +'_.log';
                const file3 = './.temp/' + solutionTHIS + '/step_2_A_listOfSizesPages_'+ key.toUpperCase() +'_.log';
                fs.outputFileSync(file2, "");
                switch (readable_file) {
                    case 0:
                        fs.outputJsonSync(file1, data);
                        break;            
                    case 1:
                        fs.outputFileSync(file1, JSON.stringify(data, null, 4));
                        break;
                }
                if (key != "map") {
                    fs.outputFileSync(file3, ""); 
                }
            }
        }
    }
    static step2B(toGet, createBlankFiles){
        if (createBlankFiles) {
            for (let [key, data] of Object.entries(toGet)) {
                data.forEach(element => {
                    element.dest.forEach(file => {
                        ensurePath2File(file);
                    });
                });
            }
        }   
        async function ensurePath2File(f) {
            try {
                await fs.ensureFile(f);
                //console.log('success!')
            } catch (err) {
                console.error(err);
            }
        }    
    }
    static step2C(quantityMap) {
        const RAM = parseInt(fs.readFileSync('./config/RAMinMB.txt', 'utf8'));
        let run_download_map ="";
        for (let i = 0; i < quantityMap; i++) {
            run_download_map += `node ./bin/STEP_3_A_.js ${i} --max-old-space-size=${RAM}` + "\n";            
        }
        fs.outputFileSync("./step_2_A_.cmd", run_download_map);
        fs.outputFileSync("./step_2_B_.cmd", `node ./bin/STEP_2_A_.js --max-old-space-size=${RAM}`);
    }
    static step3A(solutionTHIS, typeFILE, data){
        fs.appendFileSync("./.temp/" + solutionTHIS + '/step_3_B_list4downloaded_'+  typeFILE.toUpperCase() +'_.log', ",\n"+ JSON.stringify({data})+ "")
    }
}

module.exports = Sys;

