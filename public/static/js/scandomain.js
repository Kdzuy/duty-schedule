const base_url = document.domain.indexOf('localhost') >= 0 ? (location.protocol + "//" + document.domain + ":" + location.port) : (location.protocol + "//" + document.domain);
function scanwweb() {
    function bindEvent() {
        $(".post_onof").click(
            function (e) {
                e.preventDefault();
                var params = {
                    keyval: $(this).attr("id"),
                    run: $(this).attr("value")
                };
                $.ajax({
                    url: base_url + "/scandomain/edit",
                    type: "POST",
                    data: params,
                    dataType: "json",
                    success: function (res) {
                        if (res && res.status_code == 200) {
                            console.log('success');
                            location.reload();
                            return;
                        } else {
                            location.reload();
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
            e.preventDefault();
            var post_id = $(this).attr("domain_id");
            $.ajax({
                url: base_url + "/scandomain/delete",
                type: "DELETE",
                data: { keyval: post_id },
                dataType: "json",
                success: function (res) {
                    if (res && res.status_code == 200) {
                        console.log('success');
                        location.reload();
                        return;
                    } else {
                        location.reload();
                        return;
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Lỗi (err): ', error);
                    return;
                }
            });
        });
        $("#btn-add-key").click(function (e) {
            e.preventDefault();
            if ($('#textdomain').val() == "") {
                alert("Key không được để trống!");
                return false;
            };
            var params = {
                textdomain: $('#textdomain').val()
            };
            $.ajax({
                url: base_url + "/scandomain/add",
                type: "POST",
                data: params,
                dataType: "json",
                success: function (res) {
                    if (res && res.status_code == 200) {
                        console.log('success');
                        location.reload();
                        return;
                    } else {
                        location.reload();
                        return;
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Lỗi (err): ', error);
                    return;
                }
            });

        });
    };
    bindEvent();
};

$(document).ready(function () {
    new scanwweb();
});

