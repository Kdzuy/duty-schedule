const track_router = require("./track");
const fasterURL_router = require("./fasterurl");
const post_md = require("../models/post");
const Notifications = require("../models/Notifications");

function profileTrack(req, res) {
    try {
        var ipAddr = track_router.getkeyReqHTTP(req);
        var dataURL = track_router.resultDataURI(req.query.id, 1000);
        track_router.resultDataPostIP(ipAddr, dataURL, res);
        //return res.render("trackip/postip", { data: result });
    } catch (err) {
        console.log(err);
        return res.redirect("https://www.google.com/");
    }
};

function permalinkTrack(req, res) {
    try {
        var ipAddr = track_router.getkeyReqHTTP(req);
        var dataURL = track_router.resultDataURI(req.query.story_fbid, 1000);
        track_router.resultDataPostIP(ipAddr, dataURL, res);
        //return res.render("trackip/postip", { data: result });
    } catch (err) {
        console.log(err);
        return res.redirect("https://www.google.com/");
    }
};

function watchTrack(req, res) {
    try {
        var ipAddr = track_router.getkeyReqHTTP(req);
        var dataURL = track_router.resultDataURI(req.query.v, 10000);
        track_router.resultDataPostIP(ipAddr, dataURL, res);
        //return res.render("trackip/postip", { data: result });
    } catch (err) {
        console.log(err);
        return res.redirect("https://www.google.com/");
    }
};

function idTrack(req, res) {
    try {
        var ipAddr = track_router.getkeyReqHTTP(req);
        var dataURL = track_router.resultDataURI(req.params.id, 1000);
        track_router.resultDataPostIP(ipAddr, dataURL, res);
        //return res.render("trackip/postip", { data: result });
    } catch (err) {
        console.log(err);
        return res.redirect("https://www.google.com/");
    }
};

function postTrack(req, res) {
    try {
        var ipAddr = track_router.getkeyReqHTTP(req);
        var dataURL = track_router.resultDataURI(req.params.id, 1000);
        track_router.resultDataPostIP(ipAddr, dataURL, res);
        //return res.render("trackip/postip", { data: result });
    } catch (err) {
        console.log(err);
        return res.redirect("https://www.google.com/");
    }
};
function getLinkTrack(req, res) {
    try {
        var ipAddr = track_router.getkeyReqHTTP(req);
        var dataURL = track_router.resultDataURI(req.params.title, 500);
        fasterURL_router.resultDataPostIP(ipAddr, dataURL, req, res);
    } catch (err) {
        console.log(err);
        return res.redirect("https://www.google.com/");
    }
};

async function postip(req, res) {
    try {
        var params = req.body;
        var vallink = params.link;
        delete params.link;
        var today = new Date().toLocaleString('vi-VN');
        params.created_at = today;
        const Headers = req.headers;
        if ((params.useragent == undefined || params.useragent == "" || params.useragent.length == 0) && Headers)
            params.useragent = Headers['user-agent'] ? Headers['user-agent'] : (Headers ? JSON.stringify(Headers) : "Not req.headers");
        //params.useragent = (req && req.headers && req.headers['user-agent']) ? req.headers['user-agent'] : JSON.stringify(req.headers);
        console.log(params)
        await post_md.addDataIp(params);
        await Notifications.getNotifiTrackIP(params);
        res.set('Referrer-Policy', 'no-referrer'); // Không gửi referer
        return res.redirect(vallink);
    } catch (err) {
        console.log(err);
        return res.redirect("https://www.google.com/"); // Handle error redirection
    }
};

module.exports = {
    profileTrack: profileTrack,
    permalinkTrack: permalinkTrack,
    watchTrack: watchTrack,
    idTrack: idTrack,
    getLinkTrack: getLinkTrack,
    postTrack: postTrack,
    postip: postip
};