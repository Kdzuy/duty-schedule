const post_md = require("../models/post");
const fasterURL_md = require("../models/fasterurl");
// const removeVietnameseTones=require ("../models/removeVietnameseTones");
const Notifications = require("../models/Notifications");
//======================================================================
async function index(req, res) {
    try {
        // if (req.session.user) {
        var data;
        if (req.session.trackper == 1) {
            data = await fasterURL_md.getAllPostsIp();
        } else {
            data = await fasterURL_md.getAllPostsIpbyUser(req.session.user.id);
        }
        var dataOut = {
            postsip: data,
            user: req.session.user,
            trackper: req.session.trackper,
            requser: req.session.user.last_name,
            error: false
        };
        //them 1 blog
        return res.render("fasterurl/index", { data: dataOut });
    } catch (err) {
        console.log(err);
        var data = {
            user: req.session.user,
            trackper: req.session.trackper,
            requser: req.session.user.last_name,
            error: "Không thể lấy dữ liệu fasterURL"
        };
        return res.render("fasterurl/index", { data: data });
    }
};
async function getListURL(req, res) {
    try {
        var data;
        if (req.session.trackper == 1) {
            data = await fasterURL_md.getAllPostsIp();
        } else {
            data = await fasterURL_md.getAllPostsIpbyUser(req.session.user.id);
        }
        return res.json({ data: data, status_code: 200 })
    } catch (err) {
        return res.json({ data: [], status_code: 400 })
    }

};

async function postnew(req, res) {
    try {
        var params = req.body;
        function catBoDomain(url) {
            try {
                var splitted = url.split('/');
                var sliceFromIndex = 3;

                if (splitted.length > sliceFromIndex) {
                    var slicedParts = splitted.slice(sliceFromIndex);

                    // Kiểm tra xem có ít nhất một phần tử khác rỗng hay không
                    if (slicedParts.some(function (part) { return part !== ""; })) {
                        if ((slicedParts.join('-').substring(0, 500)).replace(/[^a-zA-Z0-9\-\/]/g, '').length > 0) {
                            return slicedParts.join('-').substring(0, 500).replace(/[^a-zA-Z0-9\-\/]/g, '').toLowerCase();
                        }
                    }
                }

                // Nếu không đáp ứng điều kiện, trả về thời gian hiện tại
                var today = new Date().getTime() + "";
                return today;
            } catch (err) {
                console.log(err)
                var today = new Date().getTime() + "";
                return today;
            };
        };

        params.title = params.link ? catBoDomain(params.link) : (new Date().getTime() + "");
        // console.log('title: ',title,params.link);
        // var regex = /^[a-zA-Z0-9.+-]+$/; // Chỉ chấp nhận ký tự alphabet thường hoặc ký tự hoa
        var postsip = await post_md.getPostIpbyTitle(params.title);
        var postsFasterURL = await fasterURL_md.getPostIpbyTitle(params.title);
        // console.log(postsFasterURL);
        if ((postsip && postsip.length > 0) || (postsFasterURL && postsFasterURL.length > 0) ||
            (params.title && (params.title.trim().length == 0 || params.title.trim().length > 1000)) ||
            (params.link && (params.link.trim().length == 0 || params.link.trim().length > 1000))) {
            // user.user.id = params.id_user;
            return res.json({ data: [], status_code: 400 });
        } else {

            var today = new Date().toLocaleString('vi-VN');
            params.created_at = today;
            //console.log(params)
            var result = await fasterURL_md.addPostIp(params);
            if (result) {
                return res.json({ data: [params], status_code: 200 });
            } else {
                return res.json({ data: [], status_code: 400 });
            }

        };
    } catch (err) {
        console.log(err)
        return res.json({ data: [], status_code: 400 });
    };
};



async function deletePostFaster(req, res) {
    try {
        var Post_title = req.body.id;
        var postID = await fasterURL_md.deletePostIpByTitle(Post_title);
        if (!postID) {
            return res.json({ status_code: 400 });
        }
        var dataTitle = await post_md.deleteDataIpbyTitle(Post_title);
        if (!dataTitle) {
            return res.json({ status_code: 400 });
        }

        return res.json({ status_code: 200 });
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 });
    }
};


async function resultDataPostIP(ipAddr, dataURL, req, res) {
    try {
        if (!dataURL) return res.redirect("https://www.google.com/");

        var postsip = await fasterURL_md.getPostIpbyTitle(dataURL);
        // console.log('postsip: ',postsip.length)
        if (postsip && postsip.length == 0)
            return res.redirect("https://www.google.com/");

        var postip = postsip[0];

        //console.log(result)
        var link = postip.link;
        var today = new Date().toLocaleString('vi-VN');
        const Headers = req.headers;
        var params = {
            title: postip.title,
            getip: ipAddr || "Not found",
            data_geol: "",
            useragent: (Headers && Headers['user-agent']) ? Headers['user-agent'] : (Headers ? JSON.stringify(Headers) : "Not req.headers"),
            created_at: today
        }
        console.log(params)
        await post_md.addDataIp(params);
        var notifyData = {
            title: dataURL,
            id_user: postip.id_user,
            name_user: postip.name_user
        }
        await Notifications.getNotifiTrackIP(notifyData);
        res.set('Referrer-Policy', 'no-referrer'); // Không gửi referer
        return res.redirect(link);
    } catch (error) {
        console.log(error);
        return res.redirect("https://www.google.com/");
    };
};

module.exports = {
    index: index,
    getListURL: getListURL,
    postnew: postnew,
    deletePostFaster: deletePostFaster,
    resultDataPostIP: resultDataPostIP
};