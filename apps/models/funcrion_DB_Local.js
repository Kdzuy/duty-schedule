const sqlite3 = require("../common/localdatabase").sqlite3;
//==============================================
function sqlite3_all(querys, param) {
    try {
        return new Promise((resolve, reject) => {
            sqlite3.all(querys, param, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                };
            });
        });
    } catch (err) {
        console.log(err);
        return false;
    };
};
function sqlite3_run(querys, param) {
    try {
        return new Promise((resolve, reject) => {
            sqlite3.run(querys, param, (err) => {
                if (err) {
                    reject(false);
                } else {
                    resolve(true);
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
// function sqlite3_get(query, params) {
//     return new Promise((resolve, reject) => {
//         db.get(query, params, (err, row) => {
//             if (err) reject(err);
//             else resolve(row);
//         });
//     });
// }
//==============================================
module.exports = {
    sqlite3_all: sqlite3_all,
    sqlite3_run: sqlite3_run,
    // sqlite3_get: sqlite3_get
};