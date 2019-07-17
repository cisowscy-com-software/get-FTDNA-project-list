const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const C = fs.readJsonSync("./config/user.json");
const curentDir = fs.readJsonSync("./.temp/_lastRun.json")[0];
const lastStep = fs.readJsonSync("./.temp/" + curentDir + "/step0.json");
const thisStep = "./.temp/" + curentDir + "/step1.json.log";
fs.ensureFileSync(thisStep);

async function startFTDNA() {
    const browser = await puppeteer.launch({
        headless: 1,
        slowMo: 0,
        defaultViewport: {
            width: 1920,
            height: 1080
        },
        timeout: 60000
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

async function projectListGet(page, st) {

    //for (let it_1 = 0; it_1 < lastStep.length; it_1++) {
    let result;
    try {

        await page.goto(st.site);
        await page.waitForSelector('#matching-projects-panel');
        result = await page.evaluate(() => {
            let rez1 = [];
            try {
                for (let it_2 = 0; it_2 < $($("#matching-projects-panel")[0]).find("tr.gridview-normal").length; it_2++) {
                    let oo = {};
                    try { oo.href2join = $($($($("#matching-projects-panel")[0]).find("tr.gridview-normal")[it_2]).find(".ng-binding")[0])[0].href; } catch (err) { console.error(err); }
                    try { oo.name = $($($($("#matching-projects-panel")[0]).find("tr.gridview-normal")[it_2]).find(".ng-binding")[0])[0].innerText; } catch (err) { console.error(err); }
                    try { oo.size = parseInt($($($($("#matching-projects-panel")[0]).find("tr.gridview-normal")[it_2]).find(".ng-binding")[1])[0].innerText); } catch (err) { console.error(err); }
                    try { oo.idS1 = it_2; } catch (err) { console.error(err); }
                    try { oo.base = $("#matching-projects-panel")[0].baseURI; } catch (err) { console.error(err); }
                    if (Object.keys(oo).length>0) {
                        rez1.push(oo);
                    }                
                }
            } catch (err) { console.error(err); }            
            return rez1;
        });
        let rezPropablyIsCorect = result != "undefined" && result.length > 0;
        if (rezPropablyIsCorect) {
            for (let it_2 = 0; it_2 < result.length; it_2++) {
                let oOut = result[it_2];
                await page.goto(oOut.href2join);
                await page.waitForSelector('#project-info');
                try {oOut.href2info = await page.evaluate(() => { return $($($($("#project-info")[0]).find("div.ng-scope")[0]).find("a.ng-binding")[0])[0].href + "/dna-results"; });} catch (err) { console.error(err); }
                await page.goto(oOut.href2info);
                await page.waitForSelector('div.dna-reports');
                try {
                    oOut.href2mail = await page.evaluate(() => {
                        let contacts;
                        try {
                            contacts = Array.from($("li.admin-contact-panel").map(function () {
                                return {
                                    mail: $($($(this)[0]).find("a.mailto-link")[0])[0].href,
                                    name: $($($(this)[0]).find("span.admin-name")[0])[0].innerText
                                };
                            }));
                        } catch (err) {
                            contacts = [];
                            console.error(err);
                        }
                        return contacts;
                    });
                } catch (err) { console.error(err); }
                try {
                    oOut.href2data = await page.evaluate(() => {
                        let results;
                        try {
                            results = Array.from($("a.dna-link")).map(i => {
                                return i.href;
                            });
                        } catch (err) {
                            results = [];
                            console.error(err);
                        }
                        return results;
                    });
                } catch (err) { console.error(err); }
                try {
                    oOut.idS0=st.idS0;
                } catch (err) { console.error(err); }
                try {
                    fs.appendFileSync(st.save, ",\n"+JSON.stringify(oOut)+"");
                    console.info(oOut);
                  } catch (err) { console.error(err); }

            }            
        } 
        
        /*if (result.length > 0) {
            for (let it_2 = 0; it_2 < result.length; it_2++) {
                //let selectorLink = $($($("#matching-projects-panel")[0]).find("tr.gridview-normal")[result[it_2]).find(".ng-binding")[0];
               
                

                
                
                await page.goBack();
                await page.goBack();
                await page.waitForSelector('#matching-projects-panel');
               // console.log(result[it_2]);
               //await page.click($($($($("#matching-projects-panel")[0]).find("tr.gridview-normal")[it_2]).find(".ng-binding")[0]));
               //await page.waitForNavigation();
               //
               //      
               //await page.waitForNavigation();   
            }
        }*/
    } catch (err) { console.error(err); }
    //saveAs.toSaveOfJSON(result);
    //console.log();
    //}
}

(async () => {
    const {
        browser,
        page
    } = await startFTDNA();
    for (let it_1 = 0; it_1 < lastStep.length; it_1++) {
        await projectListGet(page, {
            site: lastStep[it_1].href,
            save: thisStep,
            idS0: lastStep[it_1].idS0,
            type: lastStep[it_1].type
        });
    }
    process.exit(1);
})();