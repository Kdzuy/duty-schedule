const post_md = require("../models/post");
const fasterURL_md = require("../models/fasterurl");
const multer = require('multer');
const uploadmid = multer().single('upload');
//=======================================================================
function routerIndex(req, res) {
    return res.redirect("/blog");
};
async function blog(req, res) {
    try {
        var posts = await post_md.getAllPostsByNewTimes(10);

        var data = {
            posts: posts,
            error: false
        };
        return res.render("blog/index", { data: data });
    } catch (err) {
        var data = { error: "Không thể lấy dữ liệu Track URL." };
        console.log(err);
        return res.render("blog/index", { data: data });
    }
};

function chat(req, res) {
    // if (req.session.trackper<3){
    try {
        var data = {
            user: req.session.user,
            trackper: req.session.trackper,
            requser: req.session.user.last_name,
            error: false
        };
        return res.render("admin/chat", { data: data });
    } catch (err) {
        var data = { error: "Không thể lấy dữ liệu Chat." };
        console.log(err);
        return res.render("blog/index", { data: data });
    }
};

async function upload(req, res) {
    try {
        uploadmid(req, res, async (err) => {
            try {
                let funcNum = req.query.CKEditorFuncNum || null;
                if (err) {
                    console.log(err);
                    let errorMsg = 'Upload thất bại!';
                    return res.status(500).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "', null, '" + errorMsg + "');</script>");
                };
                var file = req.file;
                if (!file || (file && file.size > 15 * 1024 * 1024)) {
                    // Trường hợp không có file được gửi kèm
                    let errorMsg = 'Lỗi kích thức file tải lên!';
                    return res.status(400).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "', null, '" + errorMsg + "');</script>");
                }
                const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif']; // Add more if needed
                if (!allowedImageTypes.includes(file.mimetype)) {
                    let errorMsg = 'Loại file không hợp lệ! Chỉ chọn ảnh định dạng jpeg, png, gif.';
                    return res.status(400).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "', null, '" + errorMsg + "');</script>");
                }

                // Add image data to the database
                let finalImg = {
                    id: "bee_photo_" + new Date().valueOf() + "." + file.mimetype.split("/", 2).pop(),
                    img: file.buffer,
                    type: file.mimetype
                };
                //console.log(finalImg);
                await post_md.addDataImg(finalImg);
                let fileName = finalImg.id;
                let url = process.argv[2] ? (process.argv[2] + '/photo/' + fileName) : "";
                let successMsg = 'Upload thành công!';
                return res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "','" + url + "','" + successMsg + "');</script>");
            } catch (err) {
                console.log(err);
                let errorMsg = 'Lỗi khi lưu dữ liệu ảnh!';
                let funcNum = req.query.CKEditorFuncNum || null;
                return res.status(500).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "', null, '" + errorMsg + "');</script>");
            }
            // });
        });
    } catch (error) {
        console.log(error);
        let errorMsg = 'Upload thất bại!';
        let funcNum = req.query.CKEditorFuncNum || null;
        return res.status(500).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "', null, '" + errorMsg + "');</script>");
    }
}

async function uploadtrack(req, res) {
    try {
        var imageTrack = req.body;
        if (!imageTrack) return res.status(400).json({ status: 400 });
        function decodeBase64Image(dataString) {
            try {
                function isValidBase64(str) {
                    // Biểu thức chính quy kiểm tra xem chuỗi có phải là base64 hợp lệ hay không
                    try {
                        const regex = /^[A-Za-z0-9+/]+={0,2}$/;
                        return regex.test(str);
                    } catch (err) {
                        return false;
                    }
                };
                var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                    response = {};
                if (!matches || matches.length !== 3 || !isValidBase64(matches[2])) return false;
                response = Buffer.from(matches[2], 'base64');
                return response;
            } catch (err) {
                return false;
            }
        };

        if (decodeBase64Image(imageTrack.img) == false) return res.status(400).json({ status: 400 });

        var finalImg = {
            id: imageTrack.id,
            img: decodeBase64Image(imageTrack.img),
            type: imageTrack.type
        }

        try {
            await post_md.addDataImg(finalImg);
            console.log("Upload Img Success: ", imageTrack.id)
            return res.status(200).json({ status: 200 });
        } catch (err) {
            console.log("Upload Img Fail: ", err)
            return res.status(400).json({ status: 400 });
        };
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: 400 });
    };
};

async function listimg(req, res) {
    try {
        var listID = await post_md.getDataAllImg();

        if (req.session.trackper != 1 && (listID && listID.length > 0))
            listID = listID.filter(item => !item.id.includes('data_photo_'));

        var data = {
            listID: listID,
            trackper: req.session.trackper
        };

        return res.render('admin/listimg', { data: data });
    } catch (err) {
        return res.status(400).json(err);
    }
};

async function deleteimg(req, res) {
    try {
        var id = req.body.id;
        var listID = await post_md.deleteDataImg(id);

        return res.json({ status_code: 200 });
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 });
    }
};

async function photo(req, res) {
    try {
        var filename = req.params.id;
        if (filename != "" && filename != undefined) {

            var photo = await post_md.getDataImg(filename);
            if (photo && photo.length > 0) {
                var file = photo[0].img;
                return res.contentType(photo[0].type).send(file);
            } else {
                return res.status(404).json({ err: "Not found" });
            }

        } else {
            return res.status(404).json({ err: "Not found" });
        };
    } catch (err) {
        console.log(err);
        return res.status(404).json({ err: "Not found" });
    };
};



async function dataTitle(req, res) {
    try {
        var title = req.params.title;
        if (!title) return res.redirect("/admin/signin");

        var userCheckPostIP = await post_md.getPostIpbyTitle(title);
        var userCheckFasterURL = await fasterURL_md.getPostIpbyTitle(title);

        if (req.session.trackper <= 1 ||
            (userCheckPostIP && userCheckPostIP[0] && req.session.user.id == userCheckPostIP[0].id_user) ||
            (userCheckFasterURL && userCheckFasterURL[0] && req.session.user.id == userCheckFasterURL[0].id_user)
        ) {
            var dataip = await post_md.getDataIpbyTitle(title);
            var result = {
                dataip: dataip,
                title: title,
                error: false
            };
            return res.render("trackip/dataip", { data: result });
        } else {
            var result = {
                title: title,
                error: "Không thể xem bài viết"
            };
            return res.render("trackip/dataip", { data: result });
        }
    } catch (err) {
        console.log(err);
        var result = {
            title: 'not-found',
            error: "Không thể xem bài viết"
        };
        return res.render("trackip/dataip", { data: result });
    }
};

async function dataDelete(req, res) {
    try {
        var post_id = req.body.id;
        var data = await post_md.deleteDataIp(post_id);

        if (!data) {
            return res.json({ status_code: 400 });
        } else {
            return res.json({ status_code: 200 });
        }
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 });
    }
};




module.exports = {
    routerIndex: routerIndex,
    blog: blog,
    chat: chat,
    upload: upload,
    uploadtrack: uploadtrack,
    listimg: listimg,
    deleteimg: deleteimg,
    photo: photo,
    dataTitle: dataTitle,
    dataDelete: dataDelete
};