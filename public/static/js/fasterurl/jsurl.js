const base_url = document.domain.indexOf('localhost') >= 0 ? (location.protocol + "//" + document.domain + ":" + location.port) : (location.protocol + "//" + document.domain);
function getListURL() {
    $.ajax({
        url: base_url + "/fasterurl/listurl",
        type: "GET",
        success: function (res) {

            if (res && res.status_code == 200) {
                console.log('Get ListURL success!')
                // location.reload();
                //render ra thẻ li
                addListURL(res.data);
                //alert('Update thành công phân quyền cho URL!')
            } else {
                // location.reload();
                //alert('Update không thành công URL!')
                console.log('Không lấy được danh sách URL!');
            }
        },
        error: function (xhr, status, error) {
            console.log('Không lấy được danh sách URL (err)');
            console.error(error);
        }
    });
}
// Thêm vào hệ thống url
$("#btn-login").click(function (e) {
    e.preventDefault();
    addLinkURL();
    document.getElementById("link").value = "";
});;
async function addLinkURL() {
    let link = document.getElementById("link").value;
    console.log(link)
    if (link.trim().length == 0 || !isValidUrl(link)) {
        alert("Vui lòng nhập link và kiểm tra đúng định dạng URL!");
        return;
    };
    var id_user = document.getElementById('id_user').value;
    var name_user = document.getElementById('name_user').value;
    $.ajax({
        url: base_url + "/fasterurl/new",
        type: "POST",
        data: {
            id_user: id_user,
            name_user: name_user,
            link: link
        },
        dataType: "json",
        success: function (res) {
            if (res && res.status_code == 200) {
                //console.log(res)
                addListURL(res.data)
                return;
            } else {
                alert('Thêm không thành công, có thể trùng URL!');
                return;
            }
        },
        error: function (xhr, status, error) {
            // Xử lý khi có lỗi xảy ra
            // alert('Lỗi lấy URL, xem trong Console!');
            alert('Thêm không thành công URL!');
            console.error(error);
        }

    });
 
};
async function DelLinkURL() {
    $(".delete-url").off('click');
    $(".delete-url").click(function (e) {
        e.preventDefault();
        let li_id_del = $(this).attr("id");
        var liToDelete = document.querySelector('li[li_id="' + li_id_del + '"]');
        var trimmedId = li_id_del.replace("url-", "");
        var ulInfor = document.getElementById("list-infomation");
        ulInfor.innerHTML = ""
        $.ajax({
            url: base_url + "/fasterurl/delete",
            type: "DELETE",
            data: {
                id: trimmedId
            },
            dataType: "json",
            success: function (res) {
                if (res && res.status_code == 200) {
                    // console.log(li_id_del)
                    liToDelete.remove();
                    return;
                } else {
                    console.log('Xóa không thành công (status:400)!');
                    return;
                }
            },
            error: function (xhr, status, error) {
                console.log('Xóa không thành công (err)!');
                console.error(error);
                return;

            }
        });
    });
};
function addListURL(data1) {
    var ulInputs = document.getElementById("list-inputs");
    if (data1 && data1.length > 0) {
        var liInput = "";
        for (let i = 0; i < data1.length; i++) {
            //console.log('this')
            liInput += "<li class='li-inputs' li_id='url-" + data1[i].title + "'><span id='url-" + data1[i].title + "' class='delete-url' style='margin-right: 5px;'><svg style='color: rgb(250, 64, 64);' height='15px' width='15px' aria-hidden='true' fill='none' viewBox='0 0 20 20'><path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18 18 6m0 12L6 6'/></svg></span><p style='overflow: hidden; word-wrap: break-word;  margin: 0px  0px  0px;' class='research' id_user='" + data1[i].id_user + "' name_user='" + data1[i].name_user + "' title='" + data1[i].title + "' url_link='" + base_url + "/url=" + data1[i].title + "' created='" + data1[i].created_at + "'>" + data1[i].link + "</p><a style='margin-left: 5px;color:brown' href='" + base_url + "/data/" + data1[i].title + "'>Xem</a></li>";
        };
        //console.log(liInput)
        ulInputs.innerHTML += liInput;
        copyLinkURL();
        DelLinkURL();
    };

};

function addInfoTrans(name_user, linkAttributeValue, link, created) {
    var ulInfor = document.getElementById("list-infomation");
    var liInfomation = "";
    // if (title) {
    //     liInfomation+= "<li class='li-infomation'><b>- Title: </b>"+title+"</li>";
    // };
    if (linkAttributeValue) liInfomation += "<li class='li-infomation linkfasterurl' url='" + linkAttributeValue + "'><b>- Link FasterURL: </b>" + linkAttributeValue + "</li>";
    if (link) liInfomation += "<li class='li-infomation'><b>- Link chuyển hướng: </b>" + link + "</li>";
    if (name_user) liInfomation += "<li class='li-infomation' style ='color:brown;'><b style ='color:brown;'>- Tài khoản: </b>" + name_user + "</li>";
    if (created) liInfomation += "<li class='li-infomation' style ='color:darkgreen;'><b>- Thời gian tạo: </b>" + created + "</li>";
    ulInfor.innerHTML = liInfomation;
};
function copyLinkURL() {
    $(".research").off('click');
    $(".research").click(function (e) {
        e.preventDefault();
        let linkAttributeValue = $(this).attr("url_link");
        let name_user = $(this).attr("name_user");
        let link = $(this).text();
        let created = $(this).attr("created");
        //hiên thị thông tin url track
        addInfoTrans(name_user, linkAttributeValue, link, created);
        // Kiểm tra nếu trình duyệt hỗ trợ API clipboard
        if (navigator.clipboard && linkAttributeValue) {
            navigator.clipboard.writeText(linkAttributeValue)
                .then(() => {
                    console.log('Đã sao chép Link: ' + linkAttributeValue);
                })
                .catch(err => {
                    console.log('Lỗi khi sao chép vào clipboard: ', err);
                });
        }
        shareLink();
        // getDataTrack(title);
    })
};
function shareLink() {
    $(".linkfasterurl").click(async function (e) {
        e.preventDefault();
        const urlToShare = $(this).attr("url");
        // Create a temporary input element
        try {
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
        if (navigator.share) {
            try {
                await navigator.share({ url: urlToShare });
                console.log('Chia sẻ thành công.');
            } catch (error) {
                console.log('Lỗi khi chia sẻ:', error);
            }
        } else {
            console.log('Trình duyệt không hỗ trợ chia sẻ.');
        };

    });
};

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
};

$(document).ready(function () {
    new getListURL();
    DelLinkURL();
});