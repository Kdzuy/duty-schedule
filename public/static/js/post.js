const base_url = document.domain.indexOf('localhost') >= 0 ? (location.protocol + "//" + document.domain + ":" + location.port) : (location.protocol + "//" + document.domain);
function Post() {
    function bindEvent() {
        $(".post_edit").click(
            function (e) {
                var params = {
                    id: $(".id").val(),
                    title: $(".title").val(),
                    content: CKEDITOR.instances.content.getData(),
                    author: $(".author").val()
                };

                $.ajax({
                    url: base_url + "/admin/post/edit",
                    type: "PUT",
                    data: params,
                    dataType: "json",
                    success: function (res) {
                        if (res && res.status_code == 200) {
                            location.reload();
                            return;
                        } else {
                            console.error('Lỗi cập nhật');
                            return;
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('Lỗi (err): ', error);
                        return;
                    }
                });

            });
        $(".post_delete").click(function (e) {
            var post_id = $(this).attr("post_id");
            $.ajax({
                url: base_url + "/admin/post/delete",
                type: "DELETE",
                data: { id: post_id },
                dataType: "json",
                success: function (res) {
                    if (res && res.status_code == 200) {
                        location.reload();
                        return;
                    } else {
                        console.error('Lỗi xóa');
                        return;
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Lỗi (err): ', error);
                    return;
                }
            });
        });
    }
    bindEvent();
}

$(document).ready(function () {
    new Post();
});

