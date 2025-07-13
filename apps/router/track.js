const post_md = require("../models/post");
const fasterURL_md = require("../models/fasterurl");
const user_md = require("../models/user");
const helper = require("../helpers/helper");
const removeVietnameseTones = require("../models/removeVietnameseTones");
const Notifications = require("../models/Notifications");
var listKeyReqHTTP = [];
addkeyReqHTTPToConst();
//======================================================================
async function index(req, res) {
    try {
        var data, dataKeyReq, listUser;
        if (req.session.trackper == 1) {
            data = await post_md.getAllPostsIp();
            dataKeyReq = await post_md.getAllKeyReqHttp();
            listUser = await user_md.getAllUsers();
        } else {
            data = await post_md.getAllPostsIpbyUser(req.session.user.id);
            dataKeyReq = "";
        }
        var dataOut = {
            postsip: data,
            dataKeyReq: dataKeyReq,
            listUser: listUser,
            user: req.session.user,
            trackper: req.session.trackper,
            requser: req.session.user.last_name,
            error: false
        };
        //them 1 blog
        return res.render("trackip/index", { data: dataOut });
    } catch (err) {
        console.log(err);
        var data = {
            user: req.session.user,
            trackper: req.session.trackper,
            requser: req.session.user.last_name,
            error: "Không thể lấy dữ liệu TrackIp"
        };
        return res.render("trackip/index", { data: data });
    }
};

function getnew(req, res) {
    // addkeyReqHTTPToConst();
    try {
        var data = {
            user: req.session.user,
            trackper: req.session.trackper,
            requser: req.session.user.last_name,
            error: false
        };
        return res.render("trackip/new", { data: data });
    } catch (err) {
        console.log(err);
        return res.redirect("/admin/signin");
    }
};
function getAPIIp(req, res) {
    try {
        const data = getkeyReqHTTPtoJSON(req);
        return res.json(data);
    } catch (err) {
        return res.json({ ip: 'NotFound', error: err });
    }

};
async function postnew(req, res) {
    try {
        var params = req.body;
        var user = {};
        params.id_user = req.session.user.id;
        params.name_user = req.session.user.last_name;
        function checkSrcImg(value) {
            try {
                //console.log(value)
                if (!value || /<img[^>]+src="([^"]*)"/.exec(value.replace(/'/g, '"'))[1].includes(' ')) return false;
                var url = new URL(/<img[^>]+src="([^"]*)"/.exec(value.replace(/'/g, '"'))[1]);
                //console.log('checkSrcImg: ',url)
                if (!url) return false;
                return true;
            } catch (err) {
                //console.log(err)
                return false;
            };
        }
        //console.log(user.user.last_name);
        var regex = /^[a-zA-Z0-9\-]+$/; // Chỉ chấp nhận ký tự alphabet thường hoặc ký tự hoa
        params.title = (params.title && params.title.replace(/[^a-zA-Z0-9\-\/]/g, '').trim().length > 0) ? params.title.replace(/[^a-zA-Z0-9\-\/]/g, '').trim().substring(0, 1000).toLowerCase() : (new Date().getTime() + "");
        var postsip = await post_md.getPostIpbyTitle(params.title);
        var postsFasterURL = await fasterURL_md.getPostIpbyTitle(params.title);
        // postsip = postsip[0];
        if ((postsip && postsip.length > 0) || (postsFasterURL && postsFasterURL.length > 0)) {
            user.error = "Tiêu đề 'title' đã tồn tại";
            return res.render("trackip/new", { data: user });
        } else {
            if ((params.title && (params.title.trim().length == 0 || params.title.trim().length > 1000)) ||
                (params.link && (params.link.trim().length == 0 || params.link.trim().length > 1000))) {
                user.error = "Độ dài của Link hoặc Title không phù hợp";
                return res.render("trackip/new", { data: user });
            } else if (!regex.test(params.title)) {
                user.error = "Bạn không được nhập ký tự đặc biệt, tiếng việt có dấu và khoảng cách vào 'Title'";
                return res.render("trackip/new", { data: user });
            } else if (!params.content || params.content.length == 0 ||
                params.content.indexOf('src=') < 0 || params.content.indexOf('<img') < 0 || params.content.indexOf('>') < 0 ||
                !checkSrcImg(params && params.content)) {
                user.error = "Không tìm thấy link ảnh (image) trong Ảnh trên Link";
                return res.render("trackip/new", { data: user });
            } else {
                var today = new Date().toLocaleString('vi-VN');
                params.created_at = today;
                //console.log(params)
                if (params.check_geo == "" || params.check_geo == false || params.check_geo == undefined || params.check_geo == 0) { params.check_geo = 0 } else { params.check_geo = 1 };
                if (params.check_img == "" || params.check_img == false || params.check_img == undefined || params.check_img == 0) { params.check_img = 0 } else { params.check_img = 1 };
                params.admin_check = helper.compare_password("1", req.session.permission) ? 1 : 0;
                params.titleval = params.titleval.trim().substring(0, 1000);
                // params.content = params.content.replace(/'/g, '"');
                if (params.content && params.content.length > 0 && /<img[^>]+src="([^"]*)"/.test(params.content.replace(/'/g, '"'))) {
                    params.bgimg = /<img[^>]+src="([^"]*)"/.exec(params.content.replace(/'/g, '"'))[1];
                } else {
                    params.bgimg = "";
                };
                console.log(params)
                var result = await post_md.addPostIp(params);
                if (!helper.compare_password("1", req.session.permission))
                    await Notifications.getNotificationDefault(
                        "51296",
                        params.name_user ? params.name_user : 'A User',
                        'Yêu cầu Duyệt Track URL.',
                        process.argv[2] ? process.argv[2] + "/track" : "");
                if (result) {
                    return res.redirect("/track");
                } else {
                    user.error = "Lỗi tạo liên kết 1.";
                    return res.render("trackip/new", { data: user });
                }
            }
        }
    } catch (err) {
        console.log(err);
        var user = {
            error: "Lỗi tạo liên kết 2."
        };
        return res.render("trackip/new", { data: user });
    }
};


async function postnewkeyreq(req, res) {
    try {
        var params = req.body;
        console.log('params post key req: ', params);
        var regex = /^[a-zA-Z0-9\-_\.!*\(\);:@,\/\[\]\?=+\{\}\$]*$/;// /^[a-zA-Z0-9.+-]+$/; // Chỉ chấp nhận ký tự alphabet thường hoặc ký tự hoa
        var keyreqhttp = await post_md.getKeyReqbyKey(params.keyreq);
        keyreqhttp = keyreqhttp[0];
        //console.log('keyreqhttp: ', keyreqhttp?keyreqhttp:false)
        if ((keyreqhttp && params.keyreq.trim().length !== 0) ||
            params.keyreq.trim().length == 0 || !regex.test(params.keyreq) || params.keyreq.trim().length >= 50) {
            return res.json({ status_code: 400 });
        } else {
            var today = new Date().toLocaleString('vi-VN');
            params.created_at = today;
            params.keyreq = params.keyreq.trim().toLowerCase();
            var result = await post_md.addKeyReq(params);
            var keyreqhttpnew = await post_md.getKeyReqbyKey(params.keyreq);

            keyreqhttpnew = keyreqhttpnew[0];
            console.log('result: ', keyreqhttpnew.id);
            addkeyReqHTTPToConst();
            return res.json({ status_code: 200, new_key: keyreqhttpnew.id });
        }
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 });
    }
};


async function postUpdateAdminCheck(req, res) {
    try {
        var params = req.body;
        console.log('params update key req: ', params);
        var result = await post_md.updateAdminCheck(params);
        await Notifications.getNotificationDefault(
            params.user_id + "",
            'Admin',
            (params.admin_check == "1") ? 'Cập nhật trạng thái 01 Track URL thành "Đã duyệt"' : 'Cập nhật trạng thái 01 Track URL thành "Vô hiệu"',
            process.argv[2] ? process.argv[2] + "/track" : "");
        return res.json({ status_code: 200 });
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 });
    }
};


async function deleteTrack(req, res) {
    try {
        var post_id = req.body.id;
        var dataid = await post_md.deletePostIp(post_id);
        if (!dataid) {
            return res.json({ status_code: 400 });
        }

        var post_title = req.body.title;
        var datatit = await post_md.deleteDataIpbyTitle(post_title);
        if (!datatit) {
            return res.json({ status_code: 400 });
        }

        return res.json({ status_code: 200 });
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 });
    }
};

async function deletekeyreq(req, res) {
    try {
        var keyreq_id = req.body.keyreq;
        var datakey = await post_md.deleteKeyReqById(keyreq_id);
        if (!datakey) {
            return res.json({ status_code: 400 });
        }

        addkeyReqHTTPToConst();
        return res.json({ status_code: 200 });
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 });
    }
};

function getkeyReqHTTP(req) {
    try {
        const headers = req.headers || "";
        let data = '';

        if (listKeyReqHTTP.length > 0) {
            for (const keyReq of listKeyReqHTTP) {
                const headerValue = headers[keyReq.keyreq];
                if (headerValue) {
                    data += `${keyReq.keyreq}: ${headerValue}\n\n`;
                }
                console.log(`${keyReq.keyreq}: ${headerValue}\n`);
            }
        } else {
            const commonHeaders = [
                'x-forwarded-for',
                'x-real-ip',
                'cf-connecting-ip',
                'true-client-ip',
            ];

            for (const header of commonHeaders) {
                const headerValue = headers[header];
                if (headerValue) {
                    data += `${header}: ${headerValue}\n\n`;
                }
            }
        };
        console.log('req.headers:===================================================== ',
            headers,
            '================================================================= ');

        if (data == "") {
            if (req.socket && req.socket.remoteAddress) {
                data += `remoteAddress: ${req.socket.remoteAddress}\n\n`;
            };
            if ((/(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}/gi).test(JSON.stringify(headers))) {
                data += 'IPv6: ' + JSON.stringify(headers).match(/(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}/gi) + '\n\n';
            };
            if ((/\b(?:\d{1,3}\.){3}\d{1,3}\b/g).test(JSON.stringify(headers))) {
                data += 'IPv4: ' + JSON.stringify(headers).match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) + '\n\n';
            };
        };
        return data;
    } catch (error) {
        console.log(error);
        return { error: error };
    };
};
function getkeyReqHTTPtoJSON(req) {
    try {
        const headers = req.headers || "";
        let data = {};

        if (listKeyReqHTTP && listKeyReqHTTP.length > 0) {
            for (const keyReq of listKeyReqHTTP) {
                const headerValue = headers[keyReq.keyreq];
                if (headerValue) {
                    data[keyReq.keyreq] = headerValue;
                }
            }
        } else {
            const commonHeaders = [
                'x-forwarded-for',
                'x-real-ip',
                'cf-connecting-ip',
                'true-client-ip',
            ];

            for (const header of commonHeaders) {
                const headerValue = headers[header];
                if (headerValue) {
                    data[header] = headerValue;
                }
            }
        };

        if (Object.keys(data).length === 0) {
            if (req.socket && req.socket.remoteAddress) {
                data.remoteAddress = req.socket.remoteAddress;
            };
            if ((/(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}/gi).test(JSON.stringify(headers))) {
                data.IPv6 = JSON.stringify(headers).match(/(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}/gi) + "";
            };
            //v4
            if ((/\b(?:\d{1,3}\.){3}\d{1,3}\b/g).test(JSON.stringify(headers))) {
                data.IPv4 = JSON.stringify(headers).match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) + "";
            };
        };
        // Thêm user-agent vào đối tượng data
        const userAgent = headers['user-agent'];
        if (userAgent) data['user-agent'] = userAgent;

        console.log('data API track/ip: ', data);
        return data;
    } catch (error) {
        console.log(error);
        return { error: error };
    };
};

async function resultDataPostIP(ipAddr, dataURL, res) {
    try {
        if (!dataURL) return res.redirect("https://www.google.com/");

        var postsip = await post_md.getPostIpbyTitle(dataURL);
        //console.log('postsip: ',postsip,postsip && postsip.length==0)
        if (postsip && postsip.length == 0 ||
            (postsip && postsip.length > 0 && postsip[0].admin_check == 0)) {
            console.log('Chuyển hướng sang google do không tồn tại.')
            return res.redirect("https://www.google.com/");
        }

        var postip = postsip[0];
        // var result = 
        var result = {
            post: postip,
            getip: ipAddr,
            error: false
        };
        //return result;
        //console.log(result)
        return res.render("trackip/postip", { data: result });
    } catch (error) {
        console.log(error);
        return res.redirect("https://www.google.com/");
    };
};

function resultDataURI(valueURI, maxlengthURI) {
    try {
        var regex = /^[a-zA-Z0-9\-]+$/;
        if (valueURI && regex.test(valueURI) && valueURI.length <= maxlengthURI) {
            //console.log('valueURI: ',valueURI);
            return valueURI.toLowerCase();
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    };
}
async function addkeyReqHTTPToConst() {
    try {
        const datakey = await post_md.getAllKeyReqHttp();
        // console.log('listKeyReqHTTP.length: ', datakey.length);

        if (datakey && datakey.length > 0) {
            listKeyReqHTTP = datakey;
        } else {
            listKeyReqHTTP = [
                { id: 0, keyreq: 'x-forwarded-for' },
                { id: 1, keyreq: 'x-real-ip' },
                { id: 2, keyreq: 'cf-connecting-ip' },
                { id: 3, keyreq: 'true-client-ip' }
            ];
            console.log('No key Req, get default');
        }

        //console.log('listKeyReqHTTP: ', listKeyReqHTTP);
    } catch (error) {
        console.error('Error adding keyReqHTTP to list, get default:', error);

        listKeyReqHTTP = [
            { id: 0, keyreq: 'x-forwarded-for' },
            { id: 1, keyreq: 'x-real-ip' },
            { id: 2, keyreq: 'cf-connecting-ip' },
            { id: 3, keyreq: 'true-client-ip' }
        ];
    }
}
module.exports = {
    index: index,
    getnew: getnew,
    getAPIIp: getAPIIp,
    postnew: postnew,
    postnewkeyreq: postnewkeyreq,
    postUpdateAdminCheck: postUpdateAdminCheck,
    deleteTrack: deleteTrack,
    deletekeyreq: deletekeyreq,
    resultDataPostIP: resultDataPostIP,
    resultDataURI: resultDataURI,
    getkeyReqHTTP: getkeyReqHTTP
};