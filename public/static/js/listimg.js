const base_url = document.domain.indexOf('localhost') >= 0 ? (location.protocol + "//" + document.domain + ":" + location.port) : (location.protocol + "//" + document.domain);
// Helper function to get parameters from the query string.
function getUrlParam(paramName) {
    let reParam = new RegExp('(?:[\?&]|&)' + paramName + '=([^&]+)', 'i');
    let match = window.location.search.match(reParam);
    //salert(match)
    return (match && match.length > 1) ? match[1] : null;
}
// Simulate user action of selecting a file to be returned to CKEditor.
function returnFileUrl(link) {

    let funcNum = getUrlParam('CKEditorFuncNum');
    let fileUrl = link;
    window.opener.CKEDITOR.tools.callFunction(funcNum, fileUrl);
    window.close();
}
var prevOverlayId = null;

function toggleOverlay(image) {
    var imageId = image.id;
    var overlayId = 'overlay-' + imageId.split('-')[1];
    var overlay = document.getElementById(overlayId);

    // Kiểm tra trạng thái hiển thị của overlay
    var isOverlayVisible = window.getComputedStyle(overlay).getPropertyValue('display') === 'block';

    // Ẩn nút của ảnh trước nếu cần
    if (prevOverlayId && prevOverlayId !== overlayId) {
        var prevOverlay = document.getElementById(prevOverlayId);
        if (prevOverlay) {
            prevOverlay.style.display = 'none';
        }
    }

    // Hiển thị/ẩn nút của ảnh hiện tại
    overlay.style.display = isOverlayVisible ? 'none' : 'block';

    // Lưu trữ ID của overlay hiện tại để ẩn nút khi click vào ảnh khác
    prevOverlayId = overlay.style.display === 'none' ? null : overlayId;

    // Kiểm tra nếu thẻ cha của ảnh đã bị xóa thì cập nhật prevOverlayId thành null
    if (!image.parentNode || !document.getElementById(overlayId)) {
        prevOverlayId = null;
    }
}

function delimg(id) {
    $.ajax({
        url: base_url + "/deleteimg",
        type: "DELETE",
        data: { id: id },
        dataType: "json",
        success: function (res) {
            if (res && res.status_code == 200) {
                // Tìm thẻ img có id tương ứng và xoá nó
                var imgElement = document.getElementById(`image-${id}`);
                if (imgElement) {
                    var imgContainer = imgElement.parentNode;
                    imgContainer.remove();//xóa div cha
                    return;
                } else {
                    console.log('Cần có quyền Admin để xóa ảnh hoặc ảnh không tồn tại!');
                    return;
                }

            } else {
                console.log('Lỗi xóa');
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
};

document.oncontextmenu = RightMouseDown;
function RightMouseDown() { return false; } 