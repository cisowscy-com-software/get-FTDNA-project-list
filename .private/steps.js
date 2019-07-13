const Crawler = require("crawler");
const Address = require("./files");
class step2projFTDNA {

    run_000_Index() {
        const lastCheck = new Date();
        const curentDir = lastCheck.getTime();
        let logs = new Address("./.temp/_allRun.json");
        logs.toZeroOfTab();
        let logsLast = logs.toReadOfTab();
        logs.toOustOfTab();
        logsLast.unshift(curentDir);
        logs.toSaveOfTab(logsLast);
        return new Crawler({
            jQuery: true,
            rateLimit: 1000,
            callback: function (error, res, done) {
                if (error) {
                    console.log(error);
                } else {
                    var $ = res.$;
                    let firstIndex = (function () {
                        let rez = [];
                        let iii = 0;
                        for (let t = 0; t < ($("div.tableWrapper")).length; t++) {
                            Array.apply(null, {
                                length: ($($($("div.tableWrapper")[t]).find('ul.projList')[0]).find('li')).length
                            }).forEach((_el, iLi) => {
                                let obj = {
                                    id: iii,
                                    name: ($($($($("div.tableWrapper")[t]).find('ul.projList')[0]).find('li')[iLi]).find('a')[0]).children[0].data.replace('\r\n', '').trim(),
                                    size: parseInt(($($($($("div.tableWrapper")[t]).find('ul.projList')[0]).find('li')[iLi]).find('a')[0]).children[0].data.replace('\r\n', '').trim().match(/\(([^)]+)\)/gi).join('').slice(1, -1)),
                                    uri: "https://www.familytreedna.com" + encodeURI(($($($($("div.tableWrapper")[t]).find('ul.projList')[0]).find('li')[iLi]).find('a')[0]).attribs.href),
                                    date: lastCheck,
                                    projType: ($($("div.tableWrapper")[t]).find('h5.tableHead')[0]).children[0].data.replace('\r\n', '').trim()
                                };
                                rez.push(obj);
                                iii++;
                            });
                        }
                        (new Address("./.temp/"+curentDir+"/step1-notDownloadedYet.json")).toSaveOfTab(rez);
                        (new Address("./.temp/"+curentDir+"/step0.json")).toSaveOfTab(rez);
                    }());
                }
                done();
            }
        });
    }
    run_01A_Hrefs() {
        const thisDir = (new Address("./.temp/_allRun.json")).toReadOfTab()[0];
        let notDownloadedYetUrl = new Address("./.temp/"+thisDir+"/step1-notDownloadedYet.json");
        let errorInThisItemsUrl = new Address("./.temp/"+thisDir+"/step1-errorInThisItems.json");
        let notDownload =[];
        let zeroElement =[];
        notDownloadedYetUrl.toReadOfTab().forEach(poz => {
            try {
                let pozURL = new Address('./.temp/'+thisDir+'/step1/'+poz.id+'.json');
                if (!pozURL.isFileExist()) {
                    notDownload.push(poz);
                } else if(!pozURL.isItemInTab()) {
                    zeroElement.push(poz);
                }
            } catch(err) {
                console.error(err);
            }    
        });
        notDownloadedYetUrl.toSaveOfTab(notDownload);
        errorInThisItemsUrl.toSaveOfTab(zeroElement);
        console.log("###### There's "+notDownload.length+" of addresses URL left to check. ######");        
        return notDownload;
    }
    run_01B_Index() {
        const thisDir = (new Address("./.temp/_allRun.json")).toReadOfTab()[0];
        return new Crawler({
            jQuery: true,
            rateLimit: 1000, 
            callback: function (error, res, done) {
                if (error) {
                    console.log(error);
                } else {
                    var $ = res.$;
                    let secondIndex = (function () {
                        let rez = [];
                        let iii = 0;
                        let column = Array.from(($($($("#tableBody")[0]).find('tr')[0]).find('th')).map(function () {
                            return ($(this)[0]).children[0].data.replace('\r\n', '').trim();
                        }));
                        for (let r = 1; r < $($("#tableBody")[0]).find('tr').length; r++) {
                            let record = {};
                            ($($($("#tableBody")[0]).find('tr')[r]).find('td')).each(function (i) {
                                if (i == 0) {
                                    record.uri = "https://www.familytreedna.com" + encodeURI($(this)[0].children[0].attribs.href);
                                    record[column[i]] = $(this)[0].children[0].children[0].data.replace('\r\n', '').trim();
                                } else if (i == 1) {
                                    record[column[i]] = parseInt($(this)[0].children[0].data.replace('\r\n', '').trim());
                                } 
                            });
                            record.id = [res.options.id, iii];
                            record.date = res.options.date;
                            record.projType = res.options.projType;
                            rez.push(record);
                            iii++;
                        }
                        (new Address('./.temp/'+thisDir+'/step1/'+res.options.id+'.json')).toSaveOfTab(rez);                        
                    }());
                }
                done();
            }
        });
    }
    run_01E_Exit(){
        const thisDir = (new Address("./.temp/_allRun.json")).toReadOfTab()[0],
            patternA = new RegExp("https://www.familytreedna.com/group-join.aspx"),
            patternB = new RegExp("https://www.familytreedna.com/project-join-request.aspx");
        let etap2a = [], etap2b = [], etap2c = [], AA = 0, BB = 0, CC = 0;
        let RR = 0, rezCorect = [], rezNotSuported = [], rezNotDownloaded = [],  rezBugDownloaded = [];
        try {
            (new Address("./.temp/"+thisDir+"/step0.json")).toReadOfTab().forEach(zestaw =>{
                let zestawURL = new Address("./.temp/"+thisDir+"/step1/"+zestaw.id+".json");
                //console.log(zestawURL.isItemInTab());
                if (zestawURL.isItemInTab()) {
                    try {
                        zestawURL.toReadOfTab().forEach(poz => {
                            poz.nr = RR;
                            if (patternA.test(poz.uri) || patternB.test(poz.uri)) {                                
                                rezCorect.push(poz);
                            } else {
                                rezNotSuported.push(poz);
                            }
                            if (patternA.test(poz.uri)) {
                                poz.id0 = poz.id;
                                poz.id = ["a", AA];
                                etap2a.push(poz);
                                AA++;
                            } else if (patternB.test(poz.uri)){
                                poz.id0 = poz.id;
                                poz.id = ["b", BB];
                                etap2b.push(poz);    
                                BB++;                
                            } else {
                                poz.id0 = poz.id;
                                poz.id =["c", CC];
                                etap2c.push(poz); 
                                CC++;
                            }
                            RR++;
                        });
                    } catch (err) {
                        console.error(err);
                    }    
                } 
            });
        } catch (err) {
            console.error(err);
        }
        let getUrlRezNotDownloaded = new Address("./.temp/"+thisDir+"/step1-notDownloadedYet.json");
        let getUrlRezBugDownloaded = new Address("./.temp/"+thisDir+"/step1-errorInThisItems.json");
        try {
            if (getUrlRezBugDownloaded.isItemInTab()) {
                getUrlRezBugDownloaded.toReadOfTab().forEach(poz => {
                    poz.nr = RR;
                    rezBugDownloaded.push(poz);
                    RR++;
                });                
            }            
        } catch (err) {
            console.error(err);
        }
        try {
            if (getUrlRezNotDownloaded.isItemInTab()) {
                getUrlRezNotDownloaded.toReadOfTab().forEach(poz => {
                    poz.nr = RR;
                    rezNotDownloaded.push(poz);
                    RR++;
                });                
            }            
        } catch (err) {
            console.error(err);
        }
        try {
            [ //;
                [etap2a, new Address("./.temp/"+thisDir+"/step2-notDownloadedYet_1.json")],
                [etap2b, new Address("./.temp/"+thisDir+"/step2-notDownloadedYet_2.json")],
                [etap2a, new Address("./.temp/"+thisDir+"/step1_1.json")],
                [etap2b, new Address("./.temp/"+thisDir+"/step1_2.json")], 
                [etap2c, new Address("./.temp/"+thisDir+"/step1_3.json")],
                [rezCorect, new Address("./res/"+thisDir+"/indexOfProj__suported.json")],
                [rezNotSuported, new Address("./res/"+thisDir+"/indexOfProj__not-suported.json")],
                [rezBugDownloaded, new Address("./res/"+thisDir+"/indexOfProj__bug-downloaded.json")],
                [rezNotDownloaded, new Address("./res/"+thisDir+"/indexOfProj__not-downloaded.json")]
                
            ].forEach(ifif =>{
                if (ifif[0].length>0) {
                    ifif[1].toSaveOfTab(ifif[0]);                
                }
            });
        } catch (err) {
            console.error(err);
        }
        
    }    
    run_02A_Hrefs(typ) {
        const thisDir = (new Address("./.temp/_allRun.json")).toReadOfTab()[0];
        let notDownloadedYetUrl = new Address("./.temp/"+thisDir+"/step2-notDownloadedYet_"+typ+".json");
        let errorInThisItemsUrl = new Address("./.temp/"+thisDir+"/step2-errorInThisItems_"+typ+".json");
        let notDownload =[];
        let zeroElement =[];
        notDownloadedYetUrl.toReadOfTab().forEach(poz => {
            try {
                let pozURL = new Address('./.temp/'+thisDir+'/step1/'+poz.id+'.json');
                if (!pozURL.isFileExist()) {
                    notDownload.push(poz);
                } else if(!pozURL.isItemInTab()) {
                    zeroElement.push(poz);
                }
            } catch(err) {
                console.error(err);
            }    
        });
        notDownloadedYetUrl.toSaveOfTab(notDownload);
        errorInThisItemsUrl.toSaveOfTab(zeroElement);
        console.log("###### There's "+notDownload.length+" of addresses URL left to check. ######");        
        return notDownload;
    }

}
module.exports = step2projFTDNA;