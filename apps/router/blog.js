const post_md = require("../models/post");
//===============================================
async function renderPost(req, res) {
    try {
        var posts = await post_md.getPostByID(req.params.id);

        if (posts && posts.length > 0) {
            var post = posts[0];
            var result = {
                post: post,
                error: false
            };
            return res.render("blog/post", { data: result });
        } else {
            var result = {
                error: "Không thể xem bài viết"
            };
            return res.render("blog/post", { data: result });
        }
    } catch (err) {
        var result = {
            error: "Có lỗi xảy ra"
        };
        console.log(err);
        return res.render("blog/post", { data: result });
    }
};

function about(req, res) {
    try {
        return res.render("blog/about");
    } catch (err) {
        console.log(err);
        return res.status(404).json({ error: err });
    }
};
module.exports = {
    renderPost: renderPost,
    about: about
};