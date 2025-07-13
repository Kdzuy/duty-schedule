function BtnEvent() {
    $('#searchBtn').on('click', function (e) {
        e.preventDefault();
        disableContainer()
        var linkValue = $('#link').val();
        if (linkValue !== '' && isValidUrl(linkValue) && linkValue.trim().length <= 1000) {
            // Thực hiện hành động khi link hợp lệ

            $.ajax({
                url: linkValue,
                method: 'GET',
                success: function (res) {
                    if (res) {
                        addDataByAjax(res);
                        console.log('Lấy data URL thành công!');
                        enableContainer();
                        return;
                        // console.log(res)
                    } else {
                        showTextarea(linkValue);
                        console.log('Lấy data URL không thành công!');
                        enableContainer();
                        return;
                    }
                },
                error: function (xhr, status, error) {
                    // Xử lý khi có lỗi xảy ra
                    // alert('Lỗi lấy URL, xem trong Console!');
                    showTextarea(linkValue);
                    console.error('Lấy data URL không thành công (err): ', error);
                    enableContainer();
                    return;
                }
            });
        } else {
            enableContainer();
            // Thông báo cho người dùng nếu giá trị không hợp lệ
            alert('URL không hợp lệ.');
        }
    });
    $('#getDataBtn').on('click', function (e) {
        e.preventDefault();
        disableContainer()
        var data = getDataTextarea();
        if (data) {
            addDataByAjax(data);
            enableContainer();
        } else {
            document.getElementById('myTextarea').placeholder = "Vui lòng nhập chuỗi HTML";
            enableContainer();
        }
    });
    $('#submitbtn').on('click', function (e) {
        // e.preventDefault();
        // console.log(isCKEditorContentNotEmpty())
        if (!isCKEditorContentNotEmpty()) {
            e.preventDefault();
            // alert('Không tìm thấy link  ảnh (image) trong "Ảnh trên Link".')
            if (isCKEditorInitialized() && CKEDITOR.instances['content']) {
                CKEDITOR.instances['content'].setData("<h1>Không tìm thấy link ảnh</h1>");
            } else {
                console.log('Không tìm thấy link ảnh (img) trong "Ảnh trên link".')
            }
        } else {
            document.getElementById('textareaContainer').style.display = 'none';
            document.getElementById('myTextarea').value = "";
            document.getElementById('myTextarea').placeholder = "Hãy paste mã HTML từ view-source:... (không paste link vào đây).";
            document.getElementById('myTextarea').disabled = true;
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
}


function showTextarea(linkValue) {
    // Kiểm tra xem thiết bị có phải là di động hay không
    function isMobileDevice() {
        return ((navigator?.userAgentData?.mobile) ||
            (typeof window.orientation !== "undefined") ||
            (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        );
    }

    // Sử dụng hàm isMobileDevice() để kiểm tra
    if (isMobileDevice()) {
        console.log("Thiết bị đang sử dụng là di động.");
        alert('Không thể lấy data từ URL, sử dụng PC để có tính năng đọc mã nguồn HTML.');
    } else {
        console.log("Thiết bị đang sử dụng là máy tính.");
        var textareaContainer = document.getElementById('textareaContainer');
        var mytextarea = document.getElementById('myTextarea');
        if (linkValue !== '' && isValidUrl(linkValue)) {
            var link = document.getElementById("myurl");
            link.style.display = "flex";
            link.setAttribute("href", "view-source:" + linkValue);
            var href = link.getAttribute("href");

            // Sao chép giá trị vào Clipboard
            navigator.clipboard.writeText(href).then(function () {
                //console.log("Đã sao chép: " + href);
                console.log("Đã sao chép link vào Clipboard: " + href + ". Hãy paste link vào web và copy toàn bộ code HTML.");
            }).catch(function (err) {
                console.error('Lỗi khi sao chép: ', err);
            });
            // copyURL();

        };
        mytextarea.value = "";
        mytextarea.disabled = false;
        textareaContainer.style.display = 'flex';
        //alert('Không thể lấy data từ URL, paste mã nguồn HTML vào ô dưới để lấy thủ công. (Chỉ thực hiện trên PC)');
    };
}
function addDataByAjax(res) {
    try {
        // Gán giá trị của path vào input                                      
        var linkValue = $('#link').val();
        // var urlObject = new URL(linkValue);
        // var path = urlObject.pathname;
        if (linkValue !== '' && isValidUrl(linkValue)) {
            document.getElementsByName('title')[0].value = catBoDomain(linkValue);;
        } else {
            console.log('Không thêm được title');
        }
        function catBoDomain(url) {
            try {
                var splitted = url.split('/');
                var sliceFromIndex = 3;

                if (splitted.length > sliceFromIndex) {
                    var slicedParts = splitted.slice(sliceFromIndex);

                    // Kiểm tra xem có ít nhất một phần tử khác rỗng hay không
                    if (slicedParts.some(function (part) { return part !== ""; })) {
                        if ((slicedParts.join('-').substring(0, 500)).replace(/[^a-zA-Z0-9\-\/]/g, '').length > 0) {
                            return slicedParts.join('-').substring(0, 500).replace(/[^a-zA-Z0-9\-\/]/g, '').toLowerCase();
                        }
                    }
                }

                // Nếu không đáp ứng điều kiện, trả về thời gian hiện tại
                var today = new Date().getTime() + "";
                return today;
            } catch (err) {
                console.log(err)
                var today = new Date().getTime() + "";
                return today;
            };
        };

        //lấy các giá trị trong URL: title
        var parser = new DOMParser();
        var doc = parser.parseFromString(res, 'text/html');
        var metaTagTitle = ((doc.querySelector('meta[name="title"]') && doc.querySelector('meta[name="title"]').getAttribute('content')) ? doc.querySelector('meta[name="title"]').getAttribute('content') : null) ||
            ((doc.querySelector('meta[property="og:title"]') && doc.querySelector('meta[property="og:title"]').getAttribute('content')) ? doc.querySelector('meta[property="og:title"]').getAttribute('content') : null) ||
            ((doc.querySelector('meta[property="title"]') && doc.querySelector('meta[property="title"]').getAttribute('content')) ? doc.querySelector('meta[property="title"]').getAttribute('content') : null) ||
            ((doc.querySelector('meta[property*="title"]') && doc.querySelector('meta[property*="title"]').getAttribute('content')) ? doc.querySelector('meta[property*="title"]').getAttribute('content') : null) ||
            (doc.title ? doc.title : null);
        if (metaTagTitle == null) {
            console.log('Không thêm được titleval');
        } else {
            document.getElementsByName('titleval')[0].value = metaTagTitle;
        }
        //lấy img
        var metaTagImage = ((doc.querySelector('meta[property*="image"]') && doc.querySelector('meta[property*="image"]').getAttribute('content')) ? ("<img src='" + doc.querySelector('meta[property*="image"]').getAttribute('content') + "'>") : null) ||
            ((doc.querySelector('meta[name*="image"]') && doc.querySelector('meta[name*="image"]').getAttribute('content')) ? ("<img src='" + doc.querySelector('meta[name*="image"]').getAttribute('content') + "'>") : null) ||
            ((linkValue.includes('facebook') && doc.querySelectorAll('img') && doc.querySelectorAll('img').length >= 2 && doc.querySelectorAll('img')[1].getAttribute('src')) ? ("<img src='" + doc.querySelectorAll('img')[1].getAttribute('src') + "'>") : null) ||
            ((doc.querySelector('img') && doc.querySelector('img').getAttribute('src')) ? ("<img src='" + doc.querySelector('img').getAttribute('src') + "'>") : null);
        // (linkValue.includes('facebook') && doc.querySelector('link[as="image"]')  && doc.querySelector('link[as="image"]').getAttribute('href'))? ("<img src='" + doc.querySelector('link[as="image"]').getAttribute('href')+"'>"):null;
        if (CKEDITOR.instances['content']) {
            if (metaTagImage == null) {
                console.log('Không thêm được img');
            } else {
                CKEDITOR.instances['content'].setData(metaTagImage);
            }
        }

        document.getElementById('textareaContainer').style.display = 'none';
        document.getElementById('myTextarea').value = "";
        document.getElementById('myTextarea').placeholder = "Hãy paste mã HTML từ view-source:... (không paste link vào đây).";
        document.getElementById('myTextarea').disabled = true;
    } catch (error) {
        document.getElementById('textareaContainer').style.display = 'none';
        document.getElementById('myTextarea').value = "";
        document.getElementById('myTextarea').placeholder = "Hãy paste mã HTML từ view-source:... (không paste link vào đây).";
        document.getElementById('myTextarea').disabled = true;
    }
}

function getDataTextarea() {
    var textarea = document.getElementById('myTextarea');
    var dataFromTextarea = textarea.value;
    return dataFromTextarea;
}

function copyURL() {
    $('#myurl').on('click', function (e) {
        // Ngăn chặn hành động mặc định của thẻ <a>
        e.preventDefault();

        // Lấy giá trị của thuộc tính href
        var hrefValue = this.getAttribute("href");

        // Sao chép giá trị vào Clipboard
        navigator.clipboard.writeText(hrefValue).then(function () {
            //console.log("Đã sao chép: " + hrefValue);
            console.log("Đã sao chép link vào Clipboard: " + hrefValue + ". Hãy paste link vào web và copy toàn bộ code HTML.");
        }).catch(function (err) {
            console.error('Lỗi khi sao chép: ', err);
        });
    });

};

function isCKEditorContentNotEmpty() {
    if (isCKEditorInitialized()) {
        // Lấy nội dung từ CKEditor
        var editorContent = CKEDITOR.instances.content.getData().trim();
        return editorContent.indexOf('src=') >= 0 && editorContent.indexOf('<img') >= 0;
    }
    return false; // Nếu CKEditor chưa được khởi tạo, coi như không có dữ liệu
}
function isCKEditorInitialized() {
    return typeof CKEDITOR !== 'undefined' && CKEDITOR.instances.content;
}
function disableContainer() {
    var container = document.getElementById('container');
    container.style.pointerEvents = 'none'; // Tắt tất cả các sự kiện tương tác
    container.style.opacity = '0.7'; // (Tùy chọn) Có thể thêm hiệu ứng mờ để chỉ ra nó đang bị tắt
}
function enableContainer() {
    var container = document.getElementById('container');
    container.style.pointerEvents = 'auto'; // Mở lại tất cả các sự kiện tương tác
    container.style.opacity = '1'; // (Tùy chọn) Khôi phục lại opacity nếu có hiệu ứng mờ
}

$(document).ready(function () {
    new BtnEvent();
    new copyURL();
});
