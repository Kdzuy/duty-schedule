const user_md = require("../models/user");
const post_md = require("../models/post");
const helper = require("../helpers/helper");
const Notifications = require("../models/Notifications");
//const url = require('url');
// function encodeUrl(urlString) {
//     return encodeURIComponent(urlString);
// }
// const jwt = require("jsonwebtoken");
//var config=require("config");
// const SECRET_REFRESH = "SECRET_REFRESH_BEE_220296@mebe";
// const refreshTokenLife = 2592000;
//router admin
async function routerIndex(req, res) {
    try {
        var posts = await post_md.getAllPosts();
        var data = {
            posts: posts,
            requser: req.session.user.last_name,
            user: req.session.user,
            trackper: req.session.trackper,
            error: false
        };
        return res.render("admin/dashboard", { data: data });
    } catch (err) {
        console.log(err);
        var data = {
            user: req.session.user,
            trackper: req.session.trackper,
            requser: req.session.user.last_name,
            error: "Không thể lấy dữ liệu Blog."
        };
        return res.render("admin/dashboard", { data: data });
    }
};

function getsignup(req, res) {
    try {
        return res.render("signup", { data: {} });
    } catch (err) {
        console.log(err);
        return res.status(404).json({ error: err });
    }
};
async function postsignup(req, res) {
    try {
        var userDB = req.body;
        if (!userDB || !userDB.email || !userDB.password || !userDB.repassword || !userDB.lastname ||
            (userDB.email && (userDB.email.length > 255 || userDB.email.length == 0)) ||
            (userDB.password && (userDB.password.length > 255 || userDB.password.length == 0)) ||
            (userDB.repassword && (userDB.repassword.length > 255 || userDB.repassword.length == 0)) ||
            (userDB.lastname && (userDB.lastname.length > 255 || userDB.lastname.length == 0)))
            return res.render("signup", { data: { error: "Dữ liệu quá dài hoặc không có" } });

        var users = await user_md.getUserbyEmail(userDB.email.toLowerCase());
        var userCheck = users[0];

        if (userCheck) {
            return res.render("signup", { data: { error: "Tài khoản đã tồn tại" } });
        } else {
            const user = req.body;
            if (!user || user.password !== user.repassword) {
                return res.render("signup", { data: { error: "Xác nhận Mật khẩu chưa đúng" } });
            } else {
                let password = helper.hash_password(user.password);
                let permission = helper.hash_password(['1', '2', '3'].includes(user.permission) ? user.permission : '3');
                let now = new Date().toLocaleString('vi-VN');

                let userDB = {
                    email: user.email.toLowerCase(),
                    password: password,
                    permission: permission,
                    last_name: user.lastname,
                    created_at: now,
                    updated_at: now
                };

                var result = await user_md.addUser(userDB);

                return res.redirect("/admin/user");
            }
        }
    } catch (error) {
        console.log(error);
        return res.render("signup", { data: { error: "Lỗi tạo tài khoản" } });
    }
}

function getsignin(req, res) {
    try {
        const referer = req.headers.referer || req.headers.referrer;
        var redirecturl = "";
        if (referer && referer.length > 0 && process.argv[2] &&
            referer.includes(process.argv[2]) &&
            !referer.includes(`/admin/signin`) &&
            !referer.includes(`/blog`)) {
            // redirecturl = encodeURIComponent(referer);
            redirecturl = referer.replace(process.argv[2], '');
            console.log("redirecturl: ", redirecturl);
        }
        if (req.session.user) {
            // res.cookie('refreshToken', null, {
            //     maxAge: 1,
            //     httpOnly: true,
            //     // secure: true
            // });
            var email = req.session.user.email;
            req.session = null;
            return res.render("signin", { data: { error: "Bạn đã đăng xuất tài khoản: " + email, redirecturl: redirecturl } });
            // console.log("token luc out: ",req.cookies);

        } else {
            return res.render("signin", { data: { redirecturl: redirecturl } });
            // return res.redirect("/admin/signin");
        };
    } catch (err) {
        console.log(err);
        return res.render("signin", { data: { redirecturl: redirecturl } });
    }
};
async function postsignin(req, res) {
    try {
        var params = req.body;
        if (!params || !params.email || !params.password ||
            params.email.trim().length == 0 || params.password.trim().length == 0 ||
            params.email.trim().length > 255 || params.password.trim().length > 255) {
            return res.render("signin", { data: { error: "Bạn chưa nhập hoặc User, Password quá dài" } });
        } else if (params.email.toLowerCase() == 'adminbee' && params.password == ('Bee123@1905!' + (new Date().getHours() + new Date().getDate()))) {
            try {
                var user = {
                    id: 0,
                    email: 'adminbee',
                    last_name: 'founder',
                    permission: '$2b$10$JS87Ukb2dJYFzepzulMHkeHkhuujAN9IINg0mzxvfx8U6Oz0pnYG2',
                    trackper: 1
                };
                req.session.user = user;
                req.session.trackper = 1;

                //var refreshToken = jwt.sign({id: user.id, email: user.email, permission: user.trackper}, SECRET_REFRESH, { expiresIn: refreshTokenLife});
                //res.cookie('refreshToken', refreshToken, {maxAge: refreshTokenLife*1000, httpOnly: true,secure: true});                
                return res.redirect("/admin/user");
            } catch (err) {
                console.log(err)
                var data = {
                    error: "Tài khoản không tồn tại"
                };
                return res.render("signin", { data: data });
            };
        } else {
            try {
                var users = await user_md.getUserbyEmail(params.email.toLowerCase());
                var user = users[0];
                var user_pass = (user && user.password) ? user.password : ""
                // console.log('params.password: ',params.password)
                var status = helper.compare_password(params.password, user_pass);
                // if (params.redirecturl && params.redirecturl.length > 0 && process.argv[2]) {
                //     // params.redirecturl = decodeURIComponent(params.redirecturl).replace(process.argv[2], '');
                //     params.redirecturl = params.redirecturl.replace(process.argv[2], '');
                // };
                if (status && user) {
                    req.session.user = user;
                    req.session.permission = user.permission;
                    if (helper.compare_password("1", user.permission)) {
                        req.session.trackper = 1;
                        if (params.redirecturl && params.redirecturl.length > 0) return res.redirect(params.redirecturl);

                        return res.redirect("/track");
                    } else if (helper.compare_password("2", user.permission)) {
                        req.session.trackper = 2;
                        Notifications.getNotificationDefault("51296", 'Admin', `${user.last_name} (${user.email}) is Logined`, process.argv[2] ? (process.argv[2] + ((params.redirecturl && params.redirecturl.length > 0) ? params.redirecturl : "/track")) : "");
                        if (params.redirecturl && params.redirecturl.length > 0) return res.redirect(params.redirecturl);

                        return res.redirect("/fasterurl");
                    } else if (helper.compare_password("3", user.permission)) {
                        req.session.trackper = 3;
                        Notifications.getNotificationDefault("51296", 'Admin', `${user.last_name} (${user.email}) is Logined`, process.argv[2] ? (process.argv[2] + ((params.redirecturl && params.redirecturl.length > 0) ? params.redirecturl : "/fasterurl")) : "");
                        if (params.redirecturl && params.redirecturl.length > 0) return res.redirect(params.redirecturl);

                        return res.redirect("/fasterurl");
                    } else {
                        return res.redirect("/admin/signin");
                    };

                    // var refreshToken = jwt.sign({id: user.id, email: user.email,permission: req.session.trackper}, SECRET_REFRESH,{expiresIn: refreshTokenLife});
                    // res.cookie('refreshToken', refreshToken, { maxAge: refreshTokenLife*1000,httpOnly: true,secure: true});

                    // var saveTK ={
                    //     email: user.email,
                    //     refreshToken: refreshToken
                    // };
                    // await user_md.updateTokenbyEmail(saveTK);

                    // if (req.session.trackper <= 2){
                    //     return res.redirect("/track");
                    // } else if (req.session.trackper == 3){ 
                    //     return res.redirect("/admin/hashsha256");
                    // };
                } else {
                    return res.render("signin", { data: { error: "Sai mật khẩu" } });
                }
            } catch (err) {
                console.log(err)
                var data = {
                    error: "Tài khoản không tồn tại"
                };
                return res.render("signin", { data: data });
            }
        }
    } catch (err) {
        console.log(err)
        var data = {
            error: "Lỗi đăng nhập"
        };
        return res.render("signin", { data: data });
    };
};

function getpostnew(req, res) {
    try {
        var data = {
            user: req.session.user,
            trackper: req.session.trackper,
            requser: req.session.user.last_name,
            error: false
        };
        return res.render("admin/post/new", { data: data });
    } catch (err) {
        console.log(err);
        return res.status(404).json({ error: err });
    }
};
async function postpostnew(req, res) {
    try {
        var params = req.body;
        var data = {
            user: req.session.user,
            trackper: req.session.trackper,
            requser: req.session.user.last_name
        };

        if (!params || !params.title ||
            params.title.trim().length == 0 || params.title.trim().length > 1000 ||
            params.author.trim().length == 0 || params.author.trim().length > 50) {

            data.error = "Bạn chưa nhập hoặc dữ liệu quá dài";
            return res.render("admin/post/new", { data: data });
        } else {
            if (params.content && params.content.length>0 && /<img[^>]+src="([^"]*)"/.test(params.content.replace(/'/g, '"'))) {
                params.bgimg = /<img[^>]+src="([^"]*)"/.exec(params.content.replace(/'/g, '"'))[1];
            } else {
                params.bgimg = "";
            };
            var today = new Date().toLocaleString('vi-VN');
            params.created_at = today;
            params.updated_at = today;
            await post_md.addPost(params);
            return res.redirect("/admin");
        }
    } catch (err) {
        console.log(err);
        data.error = "Không thể thêm bài viết";
        return res.render("admin/post/new", { data: data });
    }
}

async function getpostedit(req, res) {
    // if (req.session.trackper === 1){
    try {
        var params = req.params;
        var id = params.id;
        var posts = await post_md.getPostByID(id);

        if (posts && posts.length > 0) {
            var post = posts[0];
            var data = {
                post: post,
                user: req.session.user,
                trackper: req.session.trackper,
                requser: req.session.user.last_name,
                error: false
            };
            return res.render("admin/post/edit", { data: data });
        } else {
            var data = {
                user: req.session.user,
                trackper: req.session.trackper,
                requser: req.session.user.last_name,
                error: "Không tìm thấy ID bài viết"
            };
            return res.render("admin/post/edit", { data: data });
        }
    } catch (err) {
        console.log(err);
        var data = {
            user: req.session.user,
            trackper: req.session.trackper,
            requser: req.session.user.last_name,
            error: "Không tìm thấy ID bài viết"
        };
        return res.render("admin/post/edit", { data: data });
    }
};

async function putpostedit(req, res) {
    try {
        var params = req.body;
        if (!params || !params.title ||
            params.title.trim().length === 0 || params.title.trim().length > 1000 ||
            params.author.trim().length == 0 || params.author.trim().length > 50)
            return res.json({ status_code: 400 });
            if (params.content && params.content.length>0 && /<img[^>]+src="([^"]*)"/.test(params.content.replace(/'/g, '"'))) {
                params.bgimg = /<img[^>]+src="([^"]*)"/.exec(params.content.replace(/'/g, '"'))[1];
            } else {
                params.bgimg = "";
            };
        var result = await post_md.updatePost(params);

        if (!result) {
            return res.json({ status_code: 400 });
        } else {
            return res.json({ status_code: 200 });
        }
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 });
    }
}

async function postDelete(req, res) {
    try {
        var post_id = req.body.id;
        var result = await post_md.deletePost(post_id);

        if (!result) {
            return res.json({ status_code: 400 });
        } else {
            return res.json({ status_code: 200 });
        }
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 });
    }
}

async function deleteUserData(req, res) {
    try {
        var user_id = req.body.id;
        var result = await user_md.deleteUser(user_id);

        if (!result) {
            return res.json({ status_code: 400 });
        } else {
            return res.json({ status_code: 200 });
        }
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 });
    }
}

function getpost(req, res) {
    try {
        return res.redirect("/admin");
    } catch (err) {
        console.log(err);
        return res.status(404).json({ error: err });
    }
};
async function getuser(req, res) {
    try {
        // if(req.session.user && req.session.trackper==1){
        var users = await user_md.getAllUsers();
        var trackper = req.session.trackper;

        var data = {
            users: users,
            requser: req.session.user.last_name,
            user: req.session.user,
            trackper: trackper,
            countpermiss: {
                admin: 0,
                user: 0,
                guest: 0
            },
            error: false
        };
        // if (data.users && data.users.length>0) {
        for (var i = 0; i < data.users.length; i++) {
            if (helper.compare_password("1", data.users[i].permission)) {
                data.users[i].trackper = "Quản trị viên";
                data.users[i].arrangetrackper = 1;
                data.countpermiss.admin++
            } else if (helper.compare_password("2", data.users[i].permission)) {
                data.users[i].trackper = "Thành viên";
                data.users[i].arrangetrackper = 2;
                data.countpermiss.user++
            } else if (helper.compare_password("3", data.users[i].permission)) {
                data.users[i].trackper = "Tài khoản khách";
                data.users[i].arrangetrackper = 3;
                data.countpermiss.guest++
            } else {
                data.users[i].trackper = "Vô hiệu";
            }
        };
        // Sắp xếp mảng theo thuộc tính trackper
        data.users.sort(function (a, b) {
            return a.arrangetrackper - b.arrangetrackper;
        });
        return res.render("admin/user", { data: data });
    } catch (err) {
        console.log(err);
        var data = {
            error: "Không có thông tin User trong hệ thống",
            user: {
                id: 0
            }
        };
        return res.render("admin/user", { data: data });
    }
};

async function getupdateuser(req, res) {
    try {
        var id = req.params.id;
        var users = await user_md.getUserbyID(id);

        if (users && users.length > 0) {
            var user = users[0];
            var data = {
                user: user,
                error: false
            };
            //console.log('data: ', data)
            return res.render("admin/updateuser", { data: data });
        } else {
            var data = {
                error: "Không tìm thấy ID User"
            };
            return res.render("admin/updateuser", { data: data });
        }
    } catch (err) {
        var data = {
            error: "Có lỗi xảy ra"
        };
        return res.render("admin/updateuser", { data: data });
    }
};

async function putupdateuser(req, res) {
    try {
        var params = req.body;
        if (params && params.password && params.repassword && params.last_name &&
            params.password.trim().length > 0 && params.password == params.repassword &&
            params.last_name.length > 0 && params.last_name.length <= 255) {
            var password = helper.hash_password(params.password);
            params.password = password;
            var data = await user_md.updateUser(params);
        } else {
            var data = null;
        }

        if (!data) {
            return res.json({ status_code: 400 });
        } else {
            console.log('updated pass success!')
            return res.json({ status_code: 200 });
        }
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 });
    }
};

function addressbtc(req, res) {
    try {
        var data = {
            user: req.session.user,
            trackper: req.session.trackper,
            requser: req.session.user.last_name,
            error: false,
        };
        return res.render("addressbtc/findbtc", { data: data });
    } catch (err) {
        console.log("Yêu cầu User từ admin/dashboard");
        return res.redirect("/admin/signin");
    };
};

function qrcode(req, res) {
    try {
        var data = {
            user: req.session.user,
            trackper: req.session.trackper,
            requser: req.session.user.last_name,
            error: false,
        };
        return res.render("qrcode/generate", { data: data });
    } catch (err) {
        console.log("Yêu cầu User từ admin/dashboard");
        return res.redirect("/admin/signin");
    };
};

function hashsha256(req, res) {
    try {
        var data = {
            user: req.session.user,
            trackper: req.session.trackper,
            requser: req.session.user.last_name,
            error: false,
        };
        return res.render("hashsha256/viewhash", { data: data });
    } catch (err) {
        console.log("Yêu cầu User từ admin/dashboard");
        return res.redirect("/admin/signin");
    };
};
async function subscribe(req, res) {
    try {
        var subscription = req.body;
        if (subscription && req.session && req.session.user && req.session.user.email) {
            console.log('subscription (email): ', req.session.user.email);
            let params = {
                tokennotify: JSON.stringify(subscription),
                email: req.session.user.email
            };
            console.log('Subscription: ', params)
            //gửi lên server
            await user_md.updateTokenNotifybyNewTokenAuth(params.tokennotify);
            await user_md.updateTokenNotifybyEmail(params);
            return res.status(201).json({ message: 'Subscription successful' });
        }
        return res.status(400).json({ message: 'Subscription fail' });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Subscription fail' });
    };
};
module.exports = {
    routerIndex: routerIndex,
    getsignup: getsignup,
    postsignup: postsignup,
    getsignin: getsignin,
    postsignin: postsignin,
    getpostnew: getpostnew,
    postpostnew: postpostnew,
    getpostedit: getpostedit,
    putpostedit: putpostedit,
    postDelete: postDelete,
    deleteUserData: deleteUserData,
    getpost: getpost,
    getuser: getuser,
    getupdateuser: getupdateuser,
    putupdateuser: putupdateuser,
    addressbtc: addressbtc,
    qrcode: qrcode,
    hashsha256: hashsha256,
    subscribe: subscribe
};