const SYS = require("./sys");
const curentDir = SYS.thisSolution();

REFACTORING();
STEP_2_INIT();


function REFACTORING() {
    const START = new Date();
    const rawDATA = [SYS.step1B(curentDir), SYS.step1C(curentDir)];

    SYS.step1D(curentDir, [{
            V_Contacts: Array.from(V_contacts().values())
        },
        {
            V_Projects: Array.from(V_projects().values())
        },
        {
            E_ProjCont: E_projects_contacts()
        }
    ], 1);
    SYS.timeflow('step1D_refactoring_list_projects', curentDir, START);

    function V_contacts() {
        let emails = new Map();
        rawDATA[1].forEach(e => {
            e.href2mail.forEach(m => {
                if ((m.mail.match(/@/g) || []).length == 1) {
                    emails.set(m.mail, new Set());
                }
            });
        });
        rawDATA[1].forEach(e => {
            e.href2mail.forEach(m => {
                if ((m.mail.match(/@/g) || []).length == 1) {
                    emails.get(m.mail).add(m.name);
                }
            });
        });
        let rezult = new Map();
        let i = 0;
        emails.forEach((n, e) => {
            rezult.set(e, {
                key: i,
                email: e.replace("mailto:", ""),
                name: [...n]
            });
            i++;
        });
        return rezult;
    }

    function V_projects() {
        let proj = new Map();
        let typProj = new Map();
        rawDATA[0].forEach(c => {
            typProj.set(c.idS0, c.type);
        });

        rawDATA[1].map(e => {
            return {
                name: {
                    text: e.name,
                    goJoin: (e.href2join.charAt(e.href2join.length - 1) == '&' ? e.href2join.slice(0, -1) : e.href2join).slice(50),
                    goInfo: e.href2info.slice(37, -12),
                    goData: (e.href2data.length > 0) ? e.href2data[0].replace("?iframe=yresults", "").replace("?iframe=ycolorized", "").replace("?iframe=ymap", "").replace("?iframe=ysnp", "").replace("?iframe=mtresults", "").replace("?iframe=mtmap", "").slice(37) : null
                },
                members: e.size,
                results: (function (s) {
                    let o = {};
                    ["yresults", "ycolorized", "ymap", "ysnp", "mtresults", "mtmap"].forEach(q => {
                        o[q] = s.has(q);
                    });
                    return o;
                }(new Set(e.href2data.map(a => {
                    return a.match(/(?<=iframe=)(.*)/gm)[0];
                })))),
                type: typProj.get(e.idS0)
            };

        }).forEach(p => {
            proj.set(p.name.goInfo, p);
        });
        let rezult = new Map();
        let i = 0;
        proj.forEach((v, k) => {
            v.key = i;
            rezult.set(k, v);
            i++;
        });
        return rezult;
    }

    function E_projects_contacts() {
        let w = new Set();
        rawDATA[1].forEach(e => {
            let keyProject, keyContact;
            keyProject = V_projects().get(e.href2info.slice(37, -12)).key;
            if (e.href2mail.length > 0) {
                e.href2mail.forEach(m => {
                    if ((m.mail.match(/@/g) || []).length == 1) {
                        keyContact = V_contacts().get(m.mail).key;
                        w.add([keyProject, keyContact].join("_"));
                    }
                });
            }
        });
        let rez = [];
        let ii = 0;
        w.forEach(e => {
            let kp = parseInt(e.split("_")[0]);
            let kc = parseInt(e.split("_")[1]);
            rez.push({
                key: ii,
                key_V_project: kp,
                key_V_contact: kc
            });
            ii++;
        });
        return rez;
    }
}

function STEP_2_INIT() {
    const START = new Date();
    const projects = SYS.projectsList(curentDir);
    let toGet = {
        map: [],
        str: [],
        snp: [],
        hvr: []
    };

    let iMap = 0,
        iHVR = 0,
        iSNP = 0,
        iSTR = 0;
    projects.forEach(p => {
        if (p.results.ymap) {
            toGet.map.push({
                uri: 'https://www.familytreedna.com/ws/PublicmyMaps.aspx?axn=getdata&group=' + p.name.goData + '&dnaType=YDNA&subgroup=',
                dest: ['./.temp/' + curentDir + '/step3/' + p.key + '/forefather/map.json'],
                timeout: 30000,
                key: iMap,
                projKey: p.key,
                mapType: "forefather"
            });
            iMap++;
        }
        if (p.results.mtmap) {
            toGet.map.push({
                uri: 'https://www.familytreedna.com/ws/PublicmyMaps.aspx?axn=getdata&group=' + p.name.goData + '&dnaType=mtDNA&subgroup=',
                dest: ['./.temp/' + curentDir + '/step3/' + p.key + '/foremother/map.json'],
                timeout: 30000,
                key: iMap,
                projKey: p.key,
                mapType: "foremother"
            });
            iMap++;
        }
        if (p.results.mtresults) {
            toGet.hvr.push({
                uri: 'https://www.familytreedna.com/public/' + p.name.goData + '?iframe=yresults',
                dest: [
                    './.temp/' + curentDir + '/step2/' + p.key + '/foremother/rSRS.log',
                    './.temp/' + curentDir + '/step2/' + p.key + '/foremother/rCRS.log'
                ],
                key: iHVR,
                projKey: p.key
            });
            iHVR++;
        }
        if (p.results.ysnp) {
            toGet.snp.push({
                uri: 'https://www.familytreedna.com/public/' + p.name.goData + '?iframe=yresults',
                dest: [
                    './.temp/' + curentDir + '/step2/' + p.key + '/forefather/SNP.log'
                ],
                key: iSNP,
                projKey: p.key
            });
            iSNP++;
        }
        if (p.results.yresults) {
            toGet.str.push({
                uri: 'https://www.familytreedna.com/public/' + p.name.goData + '?iframe=yresults',
                dest: [
                    './.temp/' + curentDir + '/step2/' + p.key + '/forefather/STR.log'
                ],
                key: iSTR,
                projKey: p.key
            });
            iSTR++;
        }
    });
    SYS.step2A(curentDir, toGet);
    SYS.timeflow('step2A_generating_list_tasks_to_download', curentDir, START);
    const START2 = new Date();
    SYS.step2B(toGet, true);
    SYS.timeflow('step2B_generating_path_to_results_files', curentDir, START2);
    const START3 = new Date();
    SYS.step2C(toGet.map.length);
    SYS.timeflow('step2C_generating_run_files4next_steps', curentDir, START3);
}
