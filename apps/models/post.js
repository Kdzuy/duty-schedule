const Notifications = require("../models/Notifications");
const DBLocal = require("./funcrion_DB_Local");
//=========================================================
function getAllPosts() {
    try {
        var querys = "SELECT * FROM posts";
        var quer = [];
        return DBLocal.sqlite3_all(querys, quer);
    } catch (err) {
        console.log(err);
        return false;
    };
};
function getAllPostsByNewTimes(numbers) {
    try {
        if (numbers) {
            var querys = "SELECT * FROM (SELECT * FROM posts ORDER BY id DESC LIMIT ?) AS latest_posts ORDER BY id ASC";
            var quer = [numbers];
            return DBLocal.sqlite3_all(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
function addPost(params) {
    try {
        if (params) {
            var querys = "INSERT INTO posts(title,bgimg,content,author,created_at,updated_at) VALUES (?,?,?,?,?,?)";
            var quer = [params.title, params.bgimg, params.content, params.author, params.created_at, params.updated_at];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function getPostByID(id) {
    try {
        if (id) {
            var querys = "SELECT * FROM posts WHERE id=?";
            var quer = [id];
            return DBLocal.sqlite3_all(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function updatePost(params) {
    try {
        if (params) {
            var querys = "UPDATE posts SET title=?, bgimg=?, content=?, author=?, updated_at=? WHERE id=?";
            var quer = [params.title, params.bgimg, params.content, params.author, new Date().toLocaleString('vi-VN'), params.id];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function updateAdminCheck(params) {
    try {
        if (params) {
            var querys = "UPDATE postsip SET admin_check=? WHERE id=?";
            var quer = [params.admin_check, params.id];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function deletePost(id) {
    try {
        if (id) {
            var querys = "DELETE FROM posts WHERE id=?";
            var quer = [id];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

//Post track id and navigation
function getAllPostsIp() {
    try {
        var querys = "SELECT * FROM postsip";
        var quer = [];
        return DBLocal.sqlite3_all(querys, quer);
    } catch (err) {
        console.log(err);
        return false;
    };
};
function getAllKeyReqHttp() {
    try {
        var querys = "SELECT * FROM keyinreqhttp";
        var quer = [];
        return DBLocal.sqlite3_all(querys, quer);
    } catch (err) {
        console.log(err);
        return false;
    };
};
function getAllPostsIpbyUser(id_user) {
    try {
        if (id_user) {
            var querys = "SELECT * FROM postsip WHERE id_user=?";
            var quer = [id_user];
            return DBLocal.sqlite3_all(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function getPostIpbyTitle(title) {
    try {
        if (title) {
            var querys = "SELECT * FROM postsip WHERE title=?";
            var quer = [title];
            return DBLocal.sqlite3_all(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function getKeyReqbyKey(keyreq) {
    try {
        if (keyreq) {
            var querys = "SELECT * FROM keyinreqhttp WHERE keyreq=?";
            var quer = [keyreq];
            return DBLocal.sqlite3_all(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function addPostIp(params) {
    try {
        if (params) {
            var querys = "INSERT INTO postsip(title,titleval,link,bgimg,content,check_geo,check_img,id_user, name_user,created_at, admin_check) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
            var quer = [params.title, params.titleval, params.link,params.bgimg, params.content, params.check_geo,
            params.check_img, params.id_user, params.name_user, params.created_at, params.admin_check];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function addKeyReq(params) {
    try {
        if (params) {
            var querys = "INSERT INTO keyinreqhttp(keyreq) VALUES (?)";
            var quer = [params.keyreq];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function deletePostIp(id) {
    try {
        if (id) {
            var querys = "DELETE FROM postsip WHERE id=?";
            var quer = [id];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function deleteKeyReqById(id) {
    try {
        if (id) {
            var querys = "DELETE FROM keyinreqhttp WHERE id=?";
            var quer = [id];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function addDataIp(params) {
    try {
        if (params) {
            var querys = "INSERT INTO dataip(title,getip,useragent,data_geol,created_at) VALUES (?,?,?,?,?)";
            var quer = [params.title, params.getip, params.useragent, params.data_geol, params.created_at];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
function getDataIpbyTitle(title) {
    try {
        if (title) {
            var querys = "SELECT * FROM dataip WHERE title=?";
            var quer = [title];
            return DBLocal.sqlite3_all(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
function deleteDataIp(id) {
    try {
        if (id) {
            var querys = "DELETE FROM dataip WHERE id=?";
            var quer = [id];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
function deleteDataIpbyTitle(title) {
    try {
        if (title) {
            var querys = "DELETE FROM dataip WHERE title=?";
            var quer = [title];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
async function addDataChat(params) {
    try {
        if (params) {
            var online = params.online;
            var titleUser = params.user_name;
            var querys = "INSERT INTO datachat(id_user,trackper,created_at,msg,re_user) VALUES (?,?,?,?,?)";
            var quer = [params.id_user, params.trackper, params.created_at, params.msg, params.re_user];
            if (online == 0) {
                var option = "Tin nhắn: " + params.msg.substring(0, 50) + (params.msg && params.msg.length > 50 ? "..." : "");
                var user;
                const FullDomain = process.argv[2] ? process.argv[2] + "/todos/dashboard" : "";
                if (params.trackper == 3) {
                    user = 51296;
                    // titleUser="User";
                } else if (params.trackper <= 2 && params.re_user != 51296) {
                    user = params.re_user;
                    titleUser = "Admin";
                };
                if (params.trackper <= 2 && params.re_user == 0) {
                    const user_md = require('./user');
                    const helper = require("../helpers/helper");
                    var ListUser = await user_md.getAllUsers();
                    var filteredUsers = ListUser.filter(user => {
                        return helper.compare_password("2", user.permission);
                    });
                    for (let i = 0; i < filteredUsers.length; i++) {
                        Notifications.getNotificationDefault(filteredUsers[i].id + "", titleUser, option, FullDomain);
                    }
                } else {
                    Notifications.getNotificationDefault(user + "", titleUser, option, FullDomain);
                }

            };

            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
function getAllDataChat() {
    try {
        var querys = "SELECT * FROM datachat";
        var quer = [];
        // "SELECT * FROM datachat ORDER BY created_at DESC LIMIT 50";
        return DBLocal.sqlite3_all(querys, quer);
    } catch (err) {
        console.log(err);
        return false;
    };
};
function getAllDataChatbyIdUser(id_user) {
    try {
        if (id_user) {
            var querys = "SELECT * FROM datachat WHERE (trackper=3 AND id_user = ?) OR (trackper <=2 AND (re_user = 0 OR re_user = ?))";
            var quer = [id_user, id_user];
            return DBLocal.sqlite3_all(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
function addDataImg(params) {
    try {
        if (params) {
            var querys = "INSERT INTO dataphoto(id,img,type) VALUES (?,?,?)";
            var quer = [params.id, params.img, params.type];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function getDataImg(id) {
    try {
        if (id) {
            var querys = "SELECT * FROM dataphoto WHERE id=?";
            var quer = [id];
            return DBLocal.sqlite3_all(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
function getDataAllImg() {
    try {
        var querys = "SELECT id FROM dataphoto";
        var quer = [];
        return DBLocal.sqlite3_all(querys, quer);
    } catch (err) {
        console.log(err);
        return false;
    };
};

function deleteDataImg(id) {
    try {
        if (id) {
            var querys = "DELETE FROM dataphoto WHERE id=?";
            var quer = [id];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
function deleteDataChatReplay(id, ad) {
    try {
        //id = 0; ad = 0;
        if (id != undefined && ad != undefined) {
            console.log('Admin xóa dataChat cũ để lại Chat gần nhất, users: ', id, ', admin: ', ad);
            var querys = `DELETE FROM datachat 
                        WHERE id IN (
                            SELECT id 
                            FROM (
                                SELECT id, ROW_NUMBER() OVER (PARTITION BY re_user ORDER BY id DESC) as row_num 
                                FROM datachat
                            ) AS subquery
                            WHERE 
                                (re_user <> 51296 AND row_num > ?) OR
                                (re_user = 51296 AND row_num > ?)
                        )`;
            // "DELETE FROM datachat WHERE id NOT IN (SELECT id FROM datachat ORDER BY id DESC LIMIT ?)";
            var quer = [id, ad];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

module.exports = {
    getAllPosts: getAllPosts,
    getAllPostsByNewTimes: getAllPostsByNewTimes,
    addPost: addPost,
    getPostByID: getPostByID,
    updatePost: updatePost,
    updateAdminCheck: updateAdminCheck,
    deletePost: deletePost,
    addPostIp: addPostIp,
    addKeyReq: addKeyReq,
    getAllPostsIpbyUser: getAllPostsIpbyUser,
    getPostIpbyTitle: getPostIpbyTitle,
    getKeyReqbyKey: getKeyReqbyKey,
    getAllPostsIp: getAllPostsIp,
    getAllKeyReqHttp: getAllKeyReqHttp,
    deletePostIp: deletePostIp,
    deleteKeyReqById: deleteKeyReqById,
    addDataIp: addDataIp,
    getDataIpbyTitle: getDataIpbyTitle,
    deleteDataIp: deleteDataIp,
    deleteDataIpbyTitle: deleteDataIpbyTitle,
    addDataChat: addDataChat,
    getAllDataChat: getAllDataChat,
    getAllDataChatbyIdUser: getAllDataChatbyIdUser,
    addDataImg: addDataImg,
    getDataImg: getDataImg,
    getDataAllImg: getDataAllImg,
    deleteDataImg: deleteDataImg,
    deleteDataChatReplay: deleteDataChatReplay
}