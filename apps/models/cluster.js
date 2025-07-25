// const cluster = require("../router/cluster");
const DBLocal = require("./funcrion_DB_Local");
const sqlite3 = require("../common/localdatabase").sqlite3;
function sqlite3_run_cluster(query, params) {
    try {
        return new Promise((resolve, reject) => {
            sqlite3.run(query, params, function(err) { 
                if (err) {
                    reject(false);
                } else {
                    resolve(this.lastID);// Trả về ID của bản ghi mới được chèn
                };
            });
        });
    } catch (err) {
        console.log(err);
        return new Promise((resolve, reject) => {
            reject(false);
        });
    };
};
function addCluster(cluster) {
    try {
    } catch (err) {
        console.log(err);
        return new Promise((resolve, reject) => {
            reject(false);
        });

    };
};
function addCluster(cluster) {
    try {
        if (cluster) {
            var querys = "INSERT INTO clusters(id_user,id_guest,created_at) VALUES (?,?,?)";
            var quer = [cluster.id_user, cluster.id_guest, cluster.created_at];
            return sqlite3_run_cluster(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function getAllClusters() {
    try {
        var querys = "SELECT * FROM clusters";
        var quer = [];
        return DBLocal.sqlite3_all(querys, quer);
    } catch (err) {
        console.log(err);
        return false;
    };
};

function deleteCluster(id) {
    try {
        if (id) {
            var querys = "DELETE FROM clusters WHERE id=?";
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
    addCluster: addCluster,
    getAllClusters: getAllClusters,
    deleteCluster: deleteCluster
};

