const base_url = document.domain.indexOf('localhost') >= 0 ? (location.protocol + "//" + document.domain + ":" + location.port) : (location.protocol + "//" + document.domain);
function Post() {
    function bindEvent() {

        $(".post_delete").click(function (e) {
            var post_id = $(this).attr("post_id");
            var post_title = $(this).attr("post_title");
            $.ajax({
                url: base_url + "/track/delete",
                type: "DELETE",
                data: {
                    id: post_id,
                    title: post_title
                },
                dataType: "json",
                success: function (res) {
                    if (res && res.status_code == 200) {
                        location.reload();
                    }
                    if (res && res.status_code == 400) {
                        location.reload();
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Xóa không thành công (err): ', error);
                    return;
                }
            });
        });

        $(".urlserver").click(async function (e) {
            e.preventDefault();
            const urlToShare = $(this).text();
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
            try {
                if (navigator.share) {
                    await navigator.share({ url: urlToShare });
                    console.log('Chia sẻ thành công.');
                } else {
                    console.log('Trình duyệt không hỗ trợ chia sẻ.');
                };
            } catch (error) {
                console.log('Lỗi khi chia sẻ:', error);
            };
        });
        $(".urlserverausername").click(async function (e) {
            e.preventDefault();
            const urlToShare = $(this).text();
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
            try {
                if (navigator.share) {
                    await navigator.share({ url: urlToShare });
                    console.log('Chia sẻ thành công.');
                } else {
                    console.log('Trình duyệt không hỗ trợ chia sẻ.');
                };
            } catch (error) {
                console.log('Lỗi khi chia sẻ:', error);
            };
        });
    }
    bindEvent();
}

function AdminCheck() {
    function bindEventCheck() {

        $(".admin_check").change(function (e) {
            var check_id = Number($(this).attr("id").split('admin_check-')[1]);
            var checkbox = document.getElementById($(this).attr("id"));
            var HideUser = document.getElementById(check_id);
            disableContainer();
            if (checkbox.checked) {
                var check_value = 1;
                if (HideUser) HideUser.setAttribute('status-id', '1');
            } else {
                var check_value = 0;
                if (HideUser) HideUser.setAttribute('status-id', '0');
            };
            $.ajax({
                url: base_url + "/track/updateadmincheck",
                type: "POST",
                data: {
                    id: check_id,
                    admin_check: check_value,
                    user_id: HideUser.getAttribute("iduser") ? HideUser.getAttribute("iduser") : ""
                },
                dataType: "json",
                success: function (res) {
                    if (res && res.status_code == 200) {
                        // location.reload();
                        console.log('Update thành công phân quyền cho URL!');
                        enableContainer();
                        return;
                    } else {
                        // location.reload();
                        console.log('Update không thành công URL!');
                        enableContainer();
                        return;

                    }
                },
                error: function (xhr, status, error) {
                    console.error('Xóa không thành công key req HTTP (err): ', error);
                    enableContainer();
                    return;
                }
            });
        });
    }
    bindEventCheck();
}


function keyreqactive() {
    function eventDelNew() {
        $(".delete-keytrack").click(function (e) {
            var keyIdDel = Number($(this).attr("key-id-del").split('key-track-')[1]);
            var ul_list = document.getElementById('list-key-track');
            var li_del = document.getElementById('key-track-' + keyIdDel);
            var reVale = prompt('nhập key req HTTP: ');
            if (li_del.textContent.trim() != reVale) {
                alert('Sai key req HTTP');
                return;
            }
            $.ajax({
                url: base_url + "/track/deletekeyreq",
                type: "DELETE",
                data: { keyreq: keyIdDel },
                dataType: "json",
                success: function (res) {
                    if (res && res.status_code == 200) {
                        ul_list.removeChild(li_del);
                        return;
                    } else {
                        console.log('Xóa không thành công key req HTTP: ' + new_key);
                        return;
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Xóa không thành công key req HTTP (err): ', error);
                    return;
                }
            });
        });
    }
    function bindEventAdmin() {

        $(".delete-keytrack").click(function (e) {
            var keyIdDel = Number($(this).attr("key-id-del").split('key-track-')[1]);
            var ul_list = document.getElementById('list-key-track');
            var li_del = document.getElementById('key-track-' + keyIdDel);
            var reVale = prompt('nhập key req HTTP: ');
            if (li_del.textContent.trim() != reVale) {
                alert('Sai key req HTTP');
                return;
            }
            $.ajax({
                url: base_url + "/track/deletekeyreq",
                type: "DELETE",
                data: {
                    keyreq: keyIdDel
                },
                dataType: "json",
                success: function (res) {
                    if (res && res.status_code == 200) {
                        ul_list.removeChild(li_del);
                        return;
                    } else {
                        console.log('Xóa không thành công key req HTTP: ' + new_key);
                        return;
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Xóa không thành công key req HTTP (err): ', error);
                    return;
                }
            });
        });
        $(".add-submit").click(function (e) {
            var new_key = document.getElementById('chat-input').value.trim().length > 0 ? document.getElementById('chat-input').value : "";
            var regex = /^[a-zA-Z0-9.+-]+$/;
            if (new_key === "" || !regex.test(new_key)) {
                alert('Chưa nhập Key hoặc sai định dạng!');
                return;
            }
            var ul_list = document.getElementById('list-key-track');
            $.ajax({
                url: base_url + "/track/newkeyreq",
                type: "POST",
                data: {
                    keyreq: new_key
                },
                dataType: "json",
                success: function (res) {
                    if (res && res.status_code == 200) {
                        ul_list.innerHTML += '<li class="key-track" id ="key-track-' + res.new_key + '" name="key-track-' + res.new_key + '" >' + new_key.trim().toLowerCase() + '<button key-id-del="key-track-' + res.new_key + '" class="delete-keytrack"><svg style="color: rgb(250, 64, 64);" height="15px" width="15px" aria-hidden="true" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6m0 12L6 6"/></svg></button></li>'
                        new eventDelNew(res.new_key);
                        document.getElementById('chat-input').value = null;
                        console.log('Admin hệ thống vừa phát hiện và thêm mới key req in HTTP: ' + new_key);
                        return;
                    } else {
                        alert('Thêm mới không thành công key req HTTP: ' + new_key);
                        return;
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Thêm mới không thành công key req HTTP (err): ', error);
                    return;
                }
            });
        });
    }
    bindEventAdmin();
}
var p_url_server1 = document.getElementsByClassName('urlserverausername');
var p_url_server2 = document.getElementsByClassName('urlserver');
var urlRenderElements = document.querySelectorAll('#url-render[key]'); // Chọn tất cả phần tử có key
var urlRenderMap = new Map();

// Lưu giá trị key vào Map theo số number tương ứng
urlRenderElements.forEach(el => {
    let number = el.getAttribute('number'); // Lấy giá trị number
    if (number) {
        urlRenderMap.set(number, el.getAttribute('key')); // Lưu vào Map theo số number
    }
});
//const urlRender = document.getElementById("url-render").getAttribute("key");
const req_prot = location.protocol + "//";
const base_url_add_key = document.domain.indexOf('localhost') >= 0 ? ( document.domain + ":" + location.port) : (document.domain);
function formatURLforEndpoind(url) {
    try {
        let urlObj = new URL(url);
        let domain = urlObj.hostname; // Lấy tên miền (thanh.vn)
        let path = urlObj.pathname.substring(1); // Loại bỏ dấu '/' ở đầu path
        
        // Chuyển đổi ký tự khác chữ cái và số thành '-'
        let formattedPath = path.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 50); // Giới hạn độ dài tối đa là 20 ký tự
        return `${domain}-${formattedPath}`;
    } catch (error) {
        console.error('Lỗi khi định dạng URL:', error);
        return "data.com"; // Trả về URL gốc nếu có lỗi
    }
};
// if (p_url_server1 && p_url_server1.length > 0) {
//     for (let i = 0; i < p_url_server1.length; i++) {
//         p_url_server1[i].textContent = req_prot + formatURLforEndpoind(urlRender) + "@" + base_url_add_key + p_url_server1[i].textContent;
//     };
// };
if (p_url_server1 && p_url_server1.length > 0) {
    for (let i = 0; i < p_url_server1.length; i++) {
        let number = p_url_server1[i].getAttribute('number'); // Lấy number của phần tử
        let urlRenderValue = urlRenderMap.get(number); // Lấy giá trị key từ Map

        if (urlRenderValue) { // Nếu tìm thấy giá trị urlRender phù hợp
            p_url_server1[i].textContent = req_prot + formatURLforEndpoind(urlRenderValue) + "@" + base_url_add_key + p_url_server1[i].textContent;
        }
    }
};

if (p_url_server2 && p_url_server2.length > 0) {
    for (let i = 0; i < p_url_server2.length; i++) {
        p_url_server2[i].textContent = base_url + p_url_server2[i].textContent;
    };
}; 
function disableContainer() {
    var container = document.getElementById('panel-body');
    container.style.pointerEvents = 'none';
    container.style.opacity = '0.7';
}
function enableContainer() {
    var container = document.getElementById('panel-body');
    container.style.pointerEvents = 'auto';
    container.style.opacity = '1';
}
$(document).ready(function () {
    new Post();
    new keyreqactive();
    new AdminCheck()
});