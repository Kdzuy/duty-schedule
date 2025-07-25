const base_url = document.domain.indexOf('localhost') >= 0 ? (location.protocol + "//" + document.domain + ":" + location.port) : (location.protocol + "//" + document.domain);
function User() {
    function bindEvent() {
        $(".update_user").click(
            function (e) {
                //var txtContent = document.getElementsById("content");
                var pass = document.getElementById('password');
                var repass = document.getElementById('repassword');
                if (pass && pass.value.length == 0 || repass && repass.value.length == 0) {
                    alert('Bạn chưa nhập đủ thông tin.');
                    return;
                }
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
                            console.log('update password success!')
                            location.href = base_url + '/duty/dashboard';
                            return;
                        } else {
                            alert('update password fail!')
                            location.reload();
                            return;
                        }
                    },
                    error: function (xhr, status, error) {
                        // Xử lý khi có lỗi xảy ra
                        // alert('Lỗi lấy URL, xem trong Console!');
                        console.error('Lỗi (err): ', error);
                        return;
                    }
                });

            });
        $(".user_delete").click(function (e) {
            var user_id = $(this).attr("user_id");
            //var base_url = location.protocol + "//" + document.domain + ":" + location.port;
            $.ajax({
                url: base_url + "/admin/delete",
                type: "DELETE",
                data: { id: user_id },
                dataType: "json",
                success: function (res) {
                    if (res && res.status_code == 200) {
                        location.reload();
                        return;
                    }
                    if (res && res.status_code == 400) {
                        console.error('Lỗi xóa');
                        return;
                    }
                },
                error: function (xhr, status, error) {
                    // Xử lý khi có lỗi xảy ra
                    // alert('Lỗi lấy URL, xem trong Console!');
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