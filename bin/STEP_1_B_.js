const START = new Date();
const SYS = require("./sys");
const curentDir = SYS.thisSolution(START);

async function closeBrowser(browser) {
    return browser.close();
}
async function scraping() {
    const { browser, page } = await SYS.initCHROME();
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
    SYS.step1B(curentDir,result, 1);
}

(async () => {
    await scraping();
    
    SYS.timeflow('step1B_get_paginated_list_of_projects', curentDir, START);
    process.exit(1);
})();
