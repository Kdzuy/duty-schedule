const bcrypt = require("bcrypt");

function hash_password(password) {
    //var saltRounds = 10; //độ dài chuỗi hash
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    return hash;
};
function compare_password(password, hash) {

    return bcrypt.compareSync(password, hash);

};

module.exports = {
    hash_password: hash_password,
    compare_password: compare_password
};