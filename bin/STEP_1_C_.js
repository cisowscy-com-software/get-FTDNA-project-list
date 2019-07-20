const START = new Date();
const SYS = require("./sys");
const curentDir = SYS.thisSolution();
const lastStep = SYS.step1B(curentDir);
//const fs = require('fs-extra');

SYS.step1C(curentDir, true);


async function closeBrowser(browser) {
    return browser.close();
}

async function scraping(page, st) {
    let result;
    try {
        await page.goto(st.site);
        await page.waitForSelector('#matching-projects-panel');
        result = await page.evaluate(() => {
            let rez1 = [];
            try {
                for (let it_2 = 0; it_2 < $($("#matching-projects-panel")[0]).find("tr.gridview-normal").length; it_2++) {
                    let oo = {};
                    try {
                        oo.href2join = $($($($("#matching-projects-panel")[0]).find("tr.gridview-normal")[it_2]).find(".ng-binding")[0])[0].href;
                    } catch (err) {
                        console.error(err);
                    }
                    try {
                        oo.name = $($($($("#matching-projects-panel")[0]).find("tr.gridview-normal")[it_2]).find(".ng-binding")[0])[0].innerText;
                    } catch (err) {
                        console.error(err);
                    }
                    try {
                        oo.size = parseInt($($($($("#matching-projects-panel")[0]).find("tr.gridview-normal")[it_2]).find(".ng-binding")[1])[0].innerText);
                    } catch (err) {
                        console.error(err);
                    }
                    try {
                        oo.idS1 = it_2;
                    } catch (err) {
                        console.error(err);
                    }
                    try {
                        oo.base = $("#matching-projects-panel")[0].baseURI;
                    } catch (err) {
                        console.error(err);
                    }
                    if (Object.keys(oo).length > 0) {
                        rez1.push(oo);
                    }
                }
            } catch (err) {
                console.error(err);
            }
            return rez1;
        });
        let rezPropablyIsCorect = result != "undefined" && result.length > 0;
        if (rezPropablyIsCorect) {
            for (let it_2 = 0; it_2 < result.length; it_2++) {
                let oOut = result[it_2];
                await page.goto(oOut.href2join);
                await page.waitForSelector('#project-info');
                try {
                    oOut.href2info = await page.evaluate(() => {
                        return $($($($("#project-info")[0]).find("div.ng-scope")[0]).find("a.ng-binding")[0])[0].href + "/dna-results";
                    });
                } catch (err) {
                    console.error(err);
                }
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
                } catch (err) {
                    console.error(err);
                }
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
                } catch (err) {
                    console.error(err);
                }
                try {
                    oOut.idS0 = st.idS0;
                } catch (err) {
                    console.error(err);
                }
                try {
                    SYS.step1C(st.save, oOut);
                    //console.info(oOut);
                } catch (err) {
                    console.error(err);
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
}

(async () => {
    const {
        browser,
        page
    } = await SYS.initCHROME();
    for (let it_1 = 0; it_1 < lastStep.length; it_1++) {
        await scraping(page, {
            site: lastStep[it_1].href,
            save: curentDir,
            idS0: lastStep[it_1].idS0,
            type: lastStep[it_1].type
        });
    }
    SYS.timeflow('step1C_get_list_of_projects', curentDir, START);
    process.exit(1);
})();