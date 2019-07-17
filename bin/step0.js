const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const Address = require("./files");
const C = fs.readJsonSync("./config/user.json");
const curentDir = (function () {
    const rootDir = "./.temp/";
    const lastRun = rootDir + "_lastRun.json";
    const thisRun = (new Date()).getTime();
    if (!fs.pathExistsSync(lastRun)) {
        fs.outputJsonSync(lastRun, [thisRun]);
        fs.ensureDirSync(rootDir + thisRun);
    } else {
        let all_run = fs.readJsonSync(lastRun);
        all_run.unshift(thisRun);
        fs.writeJsonSync(lastRun, all_run);
        fs.ensureDirSync(rootDir + thisRun);
    }
    return thisRun;
}());
async function startFTDNA() {
    const browser = await puppeteer.launch({
        headless: 1,
        slowMo: 0,
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });
    const page = await browser.newPage();
    page.setViewport({
        width: 1366,
        height: 768
    });
    await page.goto("https://www.familytreedna.com/login.aspx");
    await page.click("#kitnum-input");
    await page.keyboard.type(C.username);
    await page.click("#password-input");
    await page.keyboard.type(C.password);
    await page.click("#sign-in-btn");
    await page.waitForNavigation();
    return {
        browser,
        page
    };
}
async function closeBrowser(browser) {
    return browser.close();
}
async function projectListInit() {
    const {
        browser,
        page
    } = await startFTDNA();
    await page.goto("https://www.familytreedna.com/my/group-join.aspx");
    await page.waitForSelector('#project-groupings');
    const result = await page.evaluate(() => {
        let rez = [];
        let iii = 0;
        for (let it_0 = 0; it_0 < $($("#project-groupings")[0]).find("div.tableWrapper").length; it_0++) {
            for (let it_1 = 0; it_1 < $($($($("#project-groupings")[0]).find("div.tableWrapper")[it_0]).find('ul.info-list')[0]).find('li').length; it_1++) {
                rez.push({
                    href: $($($($($($("#project-groupings")[0]).find("div.tableWrapper")[it_0]).find('ul.info-list')[0]).find('li')[it_1]).find('a')[0])[0].href,                    
                    idS0: iii,
                    type: $($($($("#project-groupings")[0]).find("div.tableWrapper")[it_0]).find('h5.tableHead')[0])[0].innerText
                });
                iii++;
            }
        }
        return rez;
    });
    fs.outputJsonSync("./.temp/" + curentDir + "/step0.json", result);
}

(async () => {
    await projectListInit();
    process.exit(1);
})();