const base_url = document.domain.indexOf('localhost') >= 0 ? (location.protocol + "//" + document.domain + ":" + location.port) : (location.protocol + "//" + document.domain);
function Post() {
    function bindEvent() {

        $(".post_delete").click(function (e) {
            var post_id = $(this).attr("post_id");
            $.ajax({
                url: base_url + "/data/delete",
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
        $(".geolocation").click(function (e) {
            e.preventDefault();
            try {
                const urlToShare = $(this).text();
                var tempInput = $("<input>").attr("id", "tempInputId");
                $("body").append(tempInput);
                tempInput.val(urlToShare);
                tempInput[0].select();
                document.execCommand("copy");
                tempInput.remove();
                console.log("Copied to clipboard: " + urlToShare);
            } catch (error) {
                console.log('Lỗi khi copy:', error);
            };
            window.open().location.href = $(this).attr("href");
        });
        $(".linkimg").click(function (e) {
            //e.preventDefault();
            window.open().location.href = $(this).attr("href");
        });
    }
    bindEvent();
}

$(document).ready(function () {
    new Post();
});

