const Address = require("./files");
const curentDir = (new Address("./.temp/_last.json")).toReadOfJSON()[0];
let step2 = [new Address("./.temp/" + curentDir + "/step2.json"), {
    isCorect: [],
    isError: []
}];
let idS2 = 0,
    erS1 = 0;
   
(new Address("./.temp/" + curentDir + "/step0.json")).toReadOfJSON().forEach(el0 => {
    const step1url = new Address("./.temp/" + curentDir + "/step1/" + el0.idS0 + ".json"); 
    if (step1url.isItemInTab() && el0.href == step1url.toReadOfJSON()[0].base) {
        try {
            step1url.toReadOfJSON().forEach(el1 => {
                step2[1].isCorect.push({
                    href2join: el1.href,
                    name: el1.name,
                    size: el1.size,
                    type: el0.type,
                    idS0: el0.idS0,
                    idS1: el1.idS1,
                    idS2: idS2
                });
                idS2++;
            });
        } catch (err) {
            console.error(err);
        }
    } else {
        try {
                step2[1].isError.push({
                    base: el0.href,
                    text: el0.text,
                    type: el0.type,
                    idS0: el0.idS0,
                    erS1: erS1
                });
                erS1++;
        } catch (err) {
            console.error(err);
        }
    }

});
step2[0].toSaveOfJSON(step2[1]);
(new Address("./.temp/" + curentDir + "/step0.json")).toOustOfJSON();
(new Address("./.temp/" + curentDir + "/step1/")).toOustOfEvry();