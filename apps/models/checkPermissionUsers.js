function checkPermission(req, res, next, requiredPermission) {
  try {
    if (req?.session?.user && req?.session?.trackper && req.session.trackper <= requiredPermission) {
      //console.log("Permission level:", requiredPermission, "Requested method:", (req?.method) ? req.method : 'Not found');
      return next();
    } else {
      return requestPermissionDenied(req, res);
    }
  } catch (err) {
    return requestPermissionDenied(req, res);
  }
};

function requestPermissionDenied(req, res) {
  try {
    const method = (req?.method) ? req.method.toLowerCase() : null;

    if (method === 'get') {
      console.log("Permission Denied for 'GET' request");
      return res.redirect("/admin/signin");
    } else if (method === 'post' || method === 'put' || method === 'delete') {
      console.log("Permission Denied for 'POST', 'PUT', 'DELETE' requests");
      return res.status(400).send('Permission Denied');
    } else {
      console.log("Unknown request method or insufficient permissions");
      return res.redirect("/admin/signin");
    }
  } catch (err) {
    console.log(err)
    return res.redirect("/admin/signin");
  }
};

// Các hàm kiểm tra quyền cụ thể
function checkPermissionAdminUpRequest(req, res, next) {
  checkPermission(req, res, next, 1);
};

function checkPermissionUserUpRequest(req, res, next) {
  checkPermission(req, res, next, 2);
};

function checkPermissionGuestUpRequest(req, res, next) {
  checkPermission(req, res, next, 3);
};

module.exports = {
  checkPermissionAdminUpRequest: checkPermissionAdminUpRequest,
  checkPermissionUserUpRequest: checkPermissionUserUpRequest,
  checkPermissionGuestUpRequest: checkPermissionGuestUpRequest
};