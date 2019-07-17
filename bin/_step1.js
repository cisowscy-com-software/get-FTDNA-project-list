const puppeteer = require('puppeteer');
const Address = require("./files");
const C = (new Address("./config/user.json")).toReadOfJSON()[0];
const curentDir = (new Address("./.temp/_last.json")).toReadOfJSON()[0];
const lastStep = (new Address("./.temp/" + curentDir + "/step0.json")).toReadOfJSON();

async function startFTDNA() {
    const browser = await puppeteer.launch({
        headless: 1,
        slowMo: 0,
        defaultViewport: {
            width: 1920,
            height: 1080
        },
        timeout:60000
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

async function projectListGet(page, url, saveAs, idS0) {
    
    //for (let it_1 = 0; it_1 < lastStep.length; it_1++) {
        let result;
        try {            
        
        await page.goto(url);
        await page.waitForSelector('#matching-projects-panel');
        result = await page.evaluate(() => {
            let rez1 = [];
            for (let it_2 = 0; it_2 < $($("#matching-projects-panel")[0]).find("tr.gridview-normal").length; it_2++) {
                let oo = {};
                try {
                    oo.href= $($($($("#matching-projects-panel")[0]).find("tr.gridview-normal")[it_2]).find(".ng-binding")[0])[0].href;
                } catch (err) {
                    console.log("error in item: idS0@"+idS0+" of  url: ( "+url+" ) or in sub-element  idS1@"+it_2+" when get href");
                    console.error(err);
                }
                try {
                    oo.name=  $($($($("#matching-projects-panel")[0]).find("tr.gridview-normal")[it_2]).find(".ng-binding")[0])[0].innerText;
                } catch (err) {
                    console.log("error in item: idS0@"+idS0+" of  url: ( "+url+" ) or in sub-element  idS1@"+it_2+" when get name");
                    console.error(err);
                }
                try {
                    oo.size= parseInt($($($($("#matching-projects-panel")[0]).find("tr.gridview-normal")[it_2]).find(".ng-binding")[1])[0].innerText);
                } catch (err) {
                    console.log("error in item: idS0@"+idS0+" of  url: ( "+url+" ) or in sub-element  idS1@"+it_2+" when get members count");
                    console.error(err);
                }
                try {
                    oo.idS1= it_2;
                } catch (err) {
                    console.log("error in item: idS0@"+idS0+" of  url: ( "+url+" ) or in sub-element  idS1@"+it_2+" when iterate asign number");
                    console.error(err);
                }
                try {
                    oo.base = $("#matching-projects-panel")[0].baseURI;
                } catch (err) {
                    console.log("error in item: idS0@"+idS0+" of  url: ( "+url+" ) or in sub-element  idS1@"+it_2+" when get base url");
                    console.error(err);
                }
                rez1.push(oo);
            }
            return rez1;
        }); 
    } catch (err) {
        console.log("error in item: idS0@"+idS0+" of  url: ( "+url+" ) when going next page");
        console.error(err);
    }
        saveAs.toSaveOfJSON(result);
        //console.log();
    //}
}

(async () => {
    const {browser,page} = await startFTDNA();
    for (let it_1 = 0; it_1 < lastStep.length; it_1++) {
        await projectListGet(page, lastStep[it_1].href, new Address("./.temp/"+curentDir+"/step1/"+lastStep[it_1].idS0+".json"), lastStep[it_1].idS0);
    }
    process.exit(1);
})();