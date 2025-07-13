const DBLocal = require("./funcrion_DB_Local");
function addUser(user) {
    try {
        if (user) {
            var querys = "INSERT INTO users(permission,email,password,last_name,created_at,updated_at) VALUES (?,?,?,?,?,?)";
            var quer = [user.permission, user.email, user.password, user.last_name, user.created_at, user.updated_at];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
function getUserbyEmail(email) {
    try {
        if (email) {
            var querys = "SELECT * FROM users WHERE email=?";
            var quer = [email];
            return DBLocal.sqlite3_all(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function getUserbyID(id) {
    try {
        if (id) {
            var querys = "SELECT * FROM users WHERE id=?";
            var quer = [id];
            return DBLocal.sqlite3_all(querys, quer)
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
function getUserTokenNotifybyID(id) {
    try {
        if (id) {
            var querys = "SELECT tokennotify FROM users WHERE id=?";
            var quer = [id];
            return DBLocal.sqlite3_all(querys, quer)
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
function getAllUsers() {
    try {
        var querys = "SELECT * FROM users";
        var quer = [];
        return DBLocal.sqlite3_all(querys, quer);
    } catch (err) {
        console.log(err);
        return false;
    };
};

function getIdNameUsers() {
    try {
        var querys = "SELECT id,last_name,permission FROM users";
        var quer = [];
        return DBLocal.sqlite3_all(querys, quer);
    } catch (err) {
        console.log(err);
        return false;
    }
};

function getNameUsers() {
    try {
        var querys = "SELECT id,last_name,permission,tokennotify FROM users";
        var quer = [];
        return DBLocal.sqlite3_all(querys, quer);
    } catch (err) {
        console.log(err);
        return false;
    }
};

function updateUser(params) {
    try {
        if (params) {
            var querys = "UPDATE users SET password=?, last_name=?, updated_at=? WHERE id=?";
            var quer = [params.password, params.last_name, new Date().toLocaleString('vi-VN'), params.id];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
};
function updateTokenbyEmail(params) {
    try {
        if (params) {
            var querys = "UPDATE users SET restoken=? WHERE email=?";
            var quer = [params.refreshToken, params.email];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
function updateTokenNotifybyEmail(params) {
    try {
        if (params) {
            var querys = "UPDATE users SET tokennotify=? WHERE email=?";
            var quer = [params.tokennotify, params.email];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
function updateTokenNotifybyNewTokenAuth(authtokennotify) {
    try {
        if (authtokennotify) {
            var querys = "UPDATE users SET tokennotify = NULL WHERE tokennotify = ?";
            var quer = [authtokennotify];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
function deleteUser(id) {
    try {
        if (id) {
            var querys = "DELETE FROM users WHERE id=?";
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
    addUser: addUser,
    getUserbyEmail: getUserbyEmail,
    getAllUsers: getAllUsers,
    getUserbyID: getUserbyID,
    getUserTokenNotifybyID: getUserTokenNotifybyID,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getIdNameUsers: getIdNameUsers,
    getNameUsers: getNameUsers,
    updateTokenbyEmail: updateTokenbyEmail,
    updateTokenNotifybyEmail: updateTokenNotifybyEmail,
    updateTokenNotifybyNewTokenAuth: updateTokenNotifybyNewTokenAuth
};

