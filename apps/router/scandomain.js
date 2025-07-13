const web_run = require("../models/web_run");
const axiosScan = require("../models/axiosscanweb");
//=========================================================
async function index(req, res) {
    try {
        var data0 = await web_run.getAllKeyWeb();
        var data = {
            user: req.session.user,
            trackper: req.session.trackper,
            requser: req.session.user.last_name,
            data: data0,
            error: false
        };
        await axiosScan.checkpoint();//chạy kiểm tra để khởi động lại hàm quét Domain
        return res.render("domain/scanaxios", { data: data });
    } catch (err) {
        console.log(err);
        var data = {
            user: req.session.user,
            trackper: req.session.trackper,
            requser: req.session.user.last_name,
            error: 'Lỗi lấy danh sách KeyWeb.'
        };
        return res.render("domain/scanaxios", { data: data });
    };
};
async function editScan(req, res) {
    try {
        var params = req.body;
        if (params) {

            if (params.run === "on") {
                await web_run.updateRunByKey(2, params.keyval);
            };
            if (params.run === "off") {
                await web_run.updateRunByKey(1, params.keyval);
            };
            await axiosScan.checkpoint();//chạy kiểm tra để khởi động lại hàm quét Domain
            return res.json({ status_code: 200 });

        } else {
            return res.json({ status_code: 400 });
        };
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 });
    };
};
async function addScan(req, res) {
    try {
        var params = req.body;
        if (params && params.textdomain &&
            params.textdomain.length > 0 && params.textdomain.length <= 50) {
            var keytrack = await web_run.getKeyWebByKey(params.textdomain);
            var today = new Date().toLocaleString('vi-VN');
            if (!keytrack || (keytrack && keytrack.length == 0)) await web_run.addKeyWeb(params.textdomain, today);
            // chạy lại hàm
            await axiosScan.checkpoint();//chạy kiểm tra để khởi động lại hàm quét Domain
            return res.json({ status_code: 200 });
        } else {
            return res.json({ status_code: 400 });
        };
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 });
    };
};
async function deleteScan(req, res) {
    try {
        var params = req.body;
        if (params) {
            await web_run.deleteKeyWebByKey(params.keyval);
            await axiosScan.checkpoint();//chạy kiểm tra để khởi động lại hàm quét Domain
            return res.json({ status_code: 200 });
        } else {
            return res.json({ status_code: 400 });
        };
    } catch (err) {
        return res.json({ status_code: 400 });
    };
};
module.exports = {
    index: index,
    editScan: editScan,
    addScan: addScan,
    deleteScan: deleteScan
};