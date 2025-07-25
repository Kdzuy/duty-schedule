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
        if (!params) return false;

        // --- BƯỚC 1: LƯU TIN NHẮN VÀO CSDL ---
        const querys = "INSERT INTO datachat(id_user,trackper,created_at,msg,re_user) VALUES (?,?,?,?,?)";
        const quer = [params.id_user, params.trackper, params.created_at, params.msg, params.re_user];
        const dbResult = await DBLocal.sqlite3_run(querys, quer);

        // --- BƯỚC 2: XỬ LÝ GỬI THÔNG BÁO NẾU NGƯỜI NHẬN OFFLINE ---
        if (params.online == 0) {
            const senderId = params.id_user;
            const senderName = params.user_name;
            const senderTrackper = params.trackper;
            const receiverId = params.re_user;

            const notificationTargetIds = new Set();
            const cluster_md = require('./cluster');
            const user_md = require('./user');
            const helper = require('../helpers/helper');
            const listClusters = await cluster_md.getAllClusters();
            const allUsers = await user_md.getAllUsers(); // Lấy tất cả user để kiểm tra quyền

            // --- XÁC ĐỊNH NGƯỜI NHẬN THÔNG BÁO ---

            if (senderTrackper === 1) { // QUY TẮC KHI ADMIN GỬI
                if (receiverId === 0) {
                    // Gửi cho tất cả tài khoản khác
                    allUsers.forEach(user => notificationTargetIds.add(user.id));
                } else {
                    // Gửi cho người nhận cụ thể
                    notificationTargetIds.add(receiverId);
                }
            } else if (senderTrackper === 2) { // QUY TẮC KHI USER (MANAGER) GỬI
                if (receiverId === 0) {
                    // Gửi cho tất cả guest có liên kết với user này
                    listClusters.forEach(cluster => {
                        if (parseInt(cluster.id_user, 10) === senderId) {
                            notificationTargetIds.add(parseInt(cluster.id_guest, 10));
                        }
                    });
                } else {
                    // Gửi cho người nhận cụ thể
                    notificationTargetIds.add(receiverId);
                }
            } else if (senderTrackper === 3) { // QUY TẮC KHI GUEST GỬI
                // Gửi cho người nhận trực tiếp
                if(receiverId > 0) notificationTargetIds.add(receiverId);
                const receiverUser = allUsers.find(u => u.id === receiverId);

                // 2. Chỉ thêm người nhận vào danh sách thông báo nếu họ tồn tại và KHÔNG PHẢI là Admin
                if (receiverUser && !helper.compare_password("1", receiverUser.permission)) {
                    notificationTargetIds.add(receiverId);
                }
                // Và gửi cho manager quản lý guest này
                const clusterLink = listClusters.find(c => parseInt(c.id_guest, 10) === senderId);
                if (clusterLink && clusterLink.id_user) {
                    notificationTargetIds.add(parseInt(clusterLink.id_user, 10));
                }
            }

            // QUY TẮC BỔ SUNG: Nếu người nhận là Guest, Manager của họ cũng phải được thông báo
            const receiverUser = allUsers.find(u => u.id === receiverId);
            if (receiverUser && helper.compare_password("3", receiverUser.permission)) {
                const clusterLink = listClusters.find(c => parseInt(c.id_guest, 10) === receiverId);
                if (clusterLink && clusterLink.id_user) {
                    notificationTargetIds.add(parseInt(clusterLink.id_user, 10));
                }
            }

            // --- GỬI THÔNG BÁO ---
            const optionMessage = `Tin nhắn: ${params.msg.substring(0, 50)}${params.msg.length > 50 ? "..." : ""}`;
            const fullDomain = process.argv[2] ? `${process.argv[2]}/todos/dashboard` : "";

            for (const targetId of notificationTargetIds) {
                // Không gửi thông báo cho chính người vừa gửi tin
                if (targetId !== senderId) {
                    await Notifications.getNotificationDefault(targetId.toString(), senderName, optionMessage, fullDomain);
                }
            }
        }
        
        return dbResult;

    } catch (err) {
        console.log(err);
        return false;
    }
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