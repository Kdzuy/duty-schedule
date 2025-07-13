//================================================================================
const jwt = require("jsonwebtoken");
//var config = require("config");
const SECRET_REFRESH = "SECRET_REFRESH_BEE_220296@mebe"
const helper = require("../helpers/helper");
const user_md = require("../models/user");

module.exports = async function (req, res, next) {
  try {
    var refreshToken = (req?.cookies?.refreshToken) ? req.cookies.refreshToken : null;

    if (!req.session.user && refreshToken) {
      try {
        const decoded = await jwt.verify(refreshToken, SECRET_REFRESH);
        var refreshTokenDB = await user_md.getUserbyEmail(decoded.email);
        var user = refreshTokenDB[0];
        if (helper.compare_password("1", user.permission)) {
          req.session.trackper = 1;
        } else if (helper.compare_password("2", user.permission)) {
          req.session.trackper = 2;
        } else if (helper.compare_password("3", user.permission)) {
          req.session.trackper = 3;
        }
        req.session.user = user;
        req.session.permission = user.permission;
        console.log("checkToken");
        next();
      } catch (err) {
        console.log(err);
        return res.redirect("/admin/signin");
      }
    } else if (req.session.user && req.session.trackper) {
      console.log("next");
      next();
    } else {
      return res.redirect("/admin/signin");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("/admin/signin");
  }
};
