const START = new Date();
const SYS = require("./sys");
const curentDir = SYS.thisSolution();
const wget = require('node-wget');
const mapNum = parseInt(process.argv[2]);
if (mapNum==0) { SYS.timeflow_temp_start(curentDir, "StartDownloadFirstMap", START); }
const map2get = SYS.step2A(curentDir, "map");
download(map2get[mapNum]);
if (mapNum == map2get.length-1) {SYS.timeflow('step3A_downloaded_maps_data', curentDir, START, "StartDownloadFirstMap"); }



function download(map) {
    wget({url: map.uri, dest: map.dest[0], timeout: map.timeout},
        function (error, response, body) {
            if (error) {
                console.log(`--- error in (№:${map.key}) :`);
                console.log(error); // error encountered
            } else {
                try {
                    SYS.step3A(curentDir, "map", {
                        proj: map.projKey,
                        type: map.mapType,
                        date: new Date(response.headers.date).getTime(),
                        size: JSON.parse(body).length
                    });
                } catch (err) {console.error(err); }                
                console.log(`SAVED: (№:${map.key}), proj-key: ${map.projKey}, map-type: ${map.mapType}, member-count: ${JSON.parse(body).length}`);                
            }
        }
    );
}
