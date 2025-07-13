const DBLocal = require("./funcrion_DB_Local");
//=================================================
function addKeyWeb(key, date) {
    try {
        if (key && date) {
            var value = {
                keyval: key,
                arr: JSON.stringify({
                    main: [0],
                    LV1: 0,
                    LV2: 0
                }),
                created_at: date,
                numcheck: 0,
                run: false
            };
            var querys = "INSERT INTO listweb(keyval,arr,created_at,numcheck,run) VALUES (?,?,?,?,?)";
            var quer = [value.keyval, value.arr, value.created_at, value.numcheck, value.run];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function getKeyWebByKey(key) {
    try {
        if (key) {
            var querys = "SELECT * FROM listweb WHERE keyval=?";
            var quer = [key];
            return DBLocal.sqlite3_all(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return DBLocal.sqlite3_all(querys, quer);
    };
};

function getAllKeyWeb() {
    try {
        var querys = "SELECT * FROM listweb";
        var quer = [];
        return DBLocal.sqlite3_all(querys, quer);
    } catch (err) {
        console.log(err);
        return false;
    };
};

function updateNumCheckWebByKey(numcheck, keyval) {
    try {
        if (numcheck && keyval) {
            var querys = "UPDATE listweb SET numcheck=? WHERE keyval=?";
            var quer = [numcheck, keyval];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
function updateArrByKey(data, keyval) {
    try {
        if (data && keyval) {
            var querys = "UPDATE listweb SET arr=? WHERE keyval=?";
            var quer = [data, keyval];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
function updateDataByKey(data, keyval) {
    try {
        if (data && keyval) {
            var querys = "UPDATE listweb SET data=? WHERE keyval=?";
            var quer = [data, keyval];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
function updateRunByKey(run, keyval) {
    try {
        if (run && keyval) {
            var querys = "UPDATE listweb SET run=? WHERE keyval=?";
            var quer = [run, keyval];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function deleteKeyWebByKey(id) {
    try {
        if (id) {
            var querys = "DELETE FROM listweb WHERE keyval=?";
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
    deleteKeyWebByKey: deleteKeyWebByKey,
    addKeyWeb: addKeyWeb,
    getAllKeyWeb: getAllKeyWeb,
    getKeyWebByKey: getKeyWebByKey,
    updateArrByKey: updateArrByKey,
    updateDataByKey: updateDataByKey,
    updateRunByKey: updateRunByKey,
    updateNumCheckWebByKey: updateNumCheckWebByKey
};