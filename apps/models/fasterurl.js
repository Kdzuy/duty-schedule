const DBLocal = require("./funcrion_DB_Local");
//=========================================================
function getAllPostsIp() {
    try {
        var querys = "SELECT * FROM postsfaster";
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
            var querys = "SELECT * FROM postsfaster WHERE id_user=?";
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
            var querys = "SELECT * FROM postsfaster WHERE title=?";
            var quer = [title];
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
            var querys = "INSERT INTO postsfaster(title,link,id_user,name_user,created_at) VALUES (?,?,?,?,?)";
            var quer = [params.title, params.link, params.id_user, params.name_user, params.created_at];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function deletePostIpByTitle(id) {
    try {
        if (id) {
            var querys = "DELETE FROM postsfaster WHERE title=?";
            var quer = [id];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};



module.exports = {
    addPostIp: addPostIp,
    getAllPostsIpbyUser: getAllPostsIpbyUser,
    getPostIpbyTitle: getPostIpbyTitle,
    getAllPostsIp: getAllPostsIp,
    deletePostIpByTitle: deletePostIpByTitle,
}