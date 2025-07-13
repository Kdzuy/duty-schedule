const axios = require("axios");
const web_run = require("../models/web_run");
var checkAxios = false;
//==========================================================
const arrayText = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',
    'z', '-', '.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const domainLV1 = ['', 'com', 'net', 'org', 'info', 'edu', 'gov', 'biz', 'us'];//,'ws','mobi','tv'
const domainLV2 = ['vn', 'us'];//có thể có hoặc không'de','uk','ru','us','jp','fr'
//==========================================================
async function checkpoint() {
    console.log("checkPoint chạy kiểm tra để khởi động lại hàm quét Domain: " + checkAxios);
    if (checkAxios === false) await headweb();
};
async function headweb() {
    try {
        //var checkA = false;
        var data_numcheck;
        var dataS = await web_run.getAllKeyWeb();
        if (!dataS || (dataS && dataS.length == 0)) {
            checkAxios = false;
            console.log('checkAxios 1, không có data');
            return false;
        };
        var numvalUrl;
        var keyUrl;
        var RunData;
        for (let g = 0; g < dataS.length; g++) {
            if (dataS[g].run == 2) {
                numvalUrl = JSON.parse(dataS[g].arr);//function get to DB
                keyUrl = dataS[g].keyval;//function get to DB
                RunData = 2;
                data_numcheck = dataS[g].numcheck;
                //console.log(dataS)
                break;
            } else {
                RunData = 1;
                // data=""
            };

        };
        dataS = [];
        if (RunData === 1) {
            checkAxios = false;
            console.log('checkAxios 2, không có lệnh quét');
            //RunData = 1;
            return false;
        };
        // if (numvalUrl && numvalUrl.length == 0) {
        //     checkAxios = false;
        //     console.log("checkAxios 3, không tìm thấy giá trị Text Index");
        //     return false;
        // };
        checkAxios = true;
        console.log('checkAxios đã bật');
        var numcheck = 0;
        do {
            //thiết lập lại arr chủ chuỗi domain
            var arrMainURL = numvalUrl.main;
            for (let s = 0; s < arrMainURL.length; s++) {
                if (count == arrMainURL.length) {
                    // nếu tất cả đều là 36
                    arrMainURL[s] = 0;
                    if (s == arrMainURL.length - 1) {
                        arrMainURL.push(0);
                        console.log('push 0 to arr: ' + arrMainURL);
                        count = 0;
                    };
                } else {
                    //nếu có phần tử chưa 36
                    if (arrMainURL[arrMainURL.length - 1 - s] >= 37 && arrMainURL.length > 1) {
                        if (arrMainURL.length - 1 - s - 1 >= 0) {
                            arrMainURL[arrMainURL.length - 1 - s - 1] = arrMainURL[arrMainURL.length - 1 - s - 1] + 1;//tăng giá trị liền trước thêm 1
                        };
                        arrMainURL[arrMainURL.length - 1 - s] = 0;// gán giá trị bằng 0 khi reset
                    };

                };

            };
            //tạo chuỗi Domain mới
            var mainURL = "";
            // kiển tra số phần tử trong domain
            arrMainURL[arrMainURL.length - 1] = arrMainURL[arrMainURL.length - 1] + 1;// thêm 1 vào phần tử cuối cùng
            var count = 0;
            for (let m = 0; m < arrMainURL.length; m++) {
                if (arrMainURL[m] == 36) {
                    count++;
                };
            };
            //chuyển arr thành chuỗi
            for (let keys = 0; keys <= arrMainURL.length; keys++) {
                mainURL = "";
                for (let b = 0; b < arrMainURL.length; b++) {
                    if (keys == b) {
                        mainURL += keyUrl;
                    };
                    mainURL += arrayText[arrMainURL[b]];
                };
                if (keys == arrMainURL.length) {
                    mainURL = mainURL + keyUrl;
                };
                //console.log(mainURL);                               
                if (mainURL.indexOf('-') != 0 && mainURL.indexOf('.') != 0 && mainURL.indexOf('-') != mainURL.length - 1 && mainURL.indexOf('.') != mainURL.length - 1 && mainURL.indexOf('..') < 0 && mainURL.length < 40) {
                    for (let z = 0; z < domainLV2.length; z++) {
                        for (let j = 0; j < domainLV1.length; j++) {
                            for (let h = 0; h < 2; h++) {
                                for (let e = 0; e < 2; e++) {
                                    for (let w = 0; w < 2; w++) {
                                        // Cộng thêm giá trị vào arr, không quá 36, nếu num =36 thì push thêm 1 ký tự mới
                                        if (domainLV1[j] !== "") {
                                            var mainURL0 = mainURL + '.' + domainLV1[j];
                                        } else {
                                            var mainURL0 = mainURL;
                                        };
                                        if (e == 0 && domainLV1[j] != "") {
                                            var mainURL1 = mainURL0;
                                        } else if (e == 0 && domainLV1[j] == "") {
                                            var mainURL1 = mainURL0 + '.' + domainLV2[z];
                                        } else {
                                            var mainURL1 = mainURL0 + '.' + domainLV2[z];
                                        };
                                        if (w == 0) {
                                            var mainURL2 = 'www.' + mainURL1;
                                        } else {
                                            var mainURL2 = mainURL1;
                                        };
                                        if (h == 0) {
                                            var mainURL3 = 'https://' + mainURL2;
                                        } else {
                                            var mainURL3 = 'http://' + mainURL2;
                                        };
                                        var URL = mainURL3;
                                        // chạy kiểm tra URL
                                        if (URL.length < 63) {
                                            //console.log(URL);
                                            await RunCheckWhile(URL, keyUrl);
                                        };
                                        numcheck++; //đếm số lần tạo ra URL
                                        if (numcheck == 10000) {
                                            //cập nhật số lần quét và gán lại dữ liệu và DB
                                            await web_run.updateNumCheckWebByKey(data_numcheck + 10000, keyUrl);// cập nhật số lượng URL đã quét mỗi 100 lần quét
                                            let data0 = JSON.stringify({
                                                main: arrMainURL,
                                                LV1: 0,
                                                LV2: 0
                                            });
                                            await web_run.updateArrByKey(data0, keyUrl);
                                            numcheck = 0;
                                            console.log('Scan 10000 domain, RunData: ' + RunData);
                                            // lấy lại lệnh mới
                                            var dataR = await web_run.getAllKeyWeb();
                                            // var data1=[];
                                            //console.log(dataR)
                                            if (!dataR || (dataR && dataR.length == 0)) {
                                                checkAxios = false;
                                                console.log('checkAxios 4, ngắt do không có lệnh');
                                                // ngắt toàn bộ hàm for
                                                keys = 1000;
                                                i = arrMainURL.length;
                                                j = domainLV1.length;
                                                z = domainLV2.length;
                                                h = 2; e = 2; w = 2;
                                                RunData = 1;
                                                return false;
                                            } else {
                                                for (let t = 0; t < dataR.length; t++) {
                                                    if (dataR[t].run == 2) {
                                                        data_numcheck = dataR[t].numcheck;
                                                        numvalUrl = JSON.parse(dataR[t].arr);//function get to DB
                                                        keyUrl = dataR[t].keyval;//function get to DB
                                                        RunData = 2;
                                                        console.log('checkAxios 4a, khởi động lại: ' + keyUrl);
                                                        break;
                                                    } else {
                                                        RunData = 1;
                                                        // data1=""
                                                    };

                                                };
                                                dataR = [];
                                            };
                                            //data_numcheck == "" || data_numcheck == false || data_numcheck == undefined ||
                                            if (RunData === 1) {
                                                checkAxios = false;
                                                console.log('checkAxios 5, không còn lệnh quét');
                                                // ngắt toàn bộ hàm for
                                                keys = 1000;
                                                i = arrMainURL.length;
                                                j = domainLV1.length;
                                                z = domainLV2.length;
                                                h = 2; e = 2; w = 2;
                                                //RunData = 1;
                                                return false;
                                            };

                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        } while (arrMainURL.length < 40 && checkAxios == true && RunData == 2)
        // hàm này quét axios kiểm tra xem URL có phản hồi không
        async function RunCheckWhile(url, keyUrlLC) {
            try {
                var numb = 0;
                do {
                    var checkA = await checkweb(url);
                    if (checkA === false) numb++;
                    if (checkA === true) {
                        numb = 0;
                        let dataDB = await web_run.getKeyWebByKey(keyUrlLC);
                        var jsonDB = [];
                        if (dataDB && dataDB.length > 0) {
                            if (!dataDB[0].data) {
                                jsonDB = [];
                            } else {
                                if (dataDB[0].data.indexOf("[") >= 0) {
                                    jsonDB = JSON.parse(dataDB[0].data);
                                } else {
                                    jsonDB = [dataDB[0].data];
                                };
                            };
                            jsonDB.push(url);
                            let jsonDB1 = JSON.stringify(jsonDB);
                            await web_run.updateDataByKey(jsonDB1, keyUrlLC);
                            jsonDB = [];
                            jsonDB1 = [];
                            //numb=3;
                            console.log("updated: " + url);
                        };
                        numb = 3;
                    };
                } while (numb < 1)
            } catch (err) {
                console.log(err);
                return false;
            };
        };
        //
    } catch (err) {
        console.log(err);
        checkAxios = false;
        return false;
    };
};

async function checkweb(url) {
    try {
        let connectAxios = await axios.head(url, { timeout: 3000 });
        //connectAxios.status<400 add url to DB
        if (connectAxios && connectAxios.status < 400) {
            console.log(url + ' => status: ' + connectAxios.status);
            return true;
        } else {
            return false;
        };
    } catch (err) {
        //console.log(url + err);
        return false;
    }
};
async function RunFaceblocks() {
    try {
        let connectAxios = await axios.get(process.argv[2] ? process.argv[2] : null, { timeout: 3 * 60 * 1000 });
        //connectAxios.status<400 add url to DB
        //console.log(process.argv[2] ? process.argv[2] : null, ' => status: ' + connectAxios.status);
        if (connectAxios.status < 400) {
            return true;
        } else {
            return false;
        };
    } catch (err) {
        //console.log(err);
        return false;
    }
};
module.exports = {
    checkpoint: checkpoint,
    RunFaceblocks: RunFaceblocks
};
