const base_url = document.domain.indexOf('localhost') >= 0 ? (location.protocol + "//" + document.domain + ":" + location.port) : (location.protocol + "//" + document.domain);
function User() {
    function bindEvent() {
        
        $(".update_user").click(
            function (e) {
                var params = {
                    id: $(".id").val(),
                    password: $(".password").val(),
                    repassword: $(".repassword").val(),
                    last_name: $(".lastname").val()
                };

                $.ajax({
                    url: base_url + "/admin/updateuser",
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
        $(".user_delete").click(function (e) {
            var user_id = $(this).attr("user_id");
            $.ajax({
                url: base_url + "/admin/delete",
                type: "DELETE",
                data: { id: user_id },
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
    }
    bindEvent();
}

$(document).ready(function () {
    new User();
})