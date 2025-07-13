$(document).ready(function () {
    $('#qr-form').submit(function (e) {
        e.preventDefault();
        var text = $('#inputText').val().trim();
        var width = parseInt($('#inputWidth').val());
        var height = parseInt($('#inputHeight').val());
        var colorDark = $('#inputColorDark').val();
        var colorLight = $('#inputColorLight').val();
        if (text !== '') {
            generateQRCode(text, width, height, colorDark, colorLight);
        } else {
            alert('Chưa có Văn bản hoặc URL.');
        }
    });

    function generateQRCode(text, width, height, colorDark, colorLight) {
        // Xóa mã QR cũ
        $('#qr-code').empty();

        // Tạo mã QR mới
        var qrCode = new QRCode("qr-code", {
            text: text,
            width: width,
            height: height,
            colorDark: colorDark,
            colorLight: colorLight,
            correctLevel: QRCode.CorrectLevel.H
        });
        // Đợi cho hình ảnh QR được tạo ra và thực hiện điều chỉnh kích thước
        // setTimeout(function () {

        // }, 100);
        var qrCodeImg = document.getElementById('qr-code').querySelectorAll('*');
        qrCodeImg.forEach(function (element) {
            element.style.maxWidth = '100%';
            element.style.maxHeight = '100%';
        });
        // Hiển thị nút tải
        document.getElementById('div-qrcode').style.display = "";

        // Khi người dùng nhấp vào nút tải
        $('#downloadBtn').unbind().click(function () {
            var canvas = document.getElementById('qr-code').getElementsByTagName('canvas')[0];
            var imgURL = canvas.toDataURL(); // Chuyển đổi canvas thành URL hình ảnh
            var link = document.createElement('a');
            link.download = 'qr_code.png';
            link.href = imgURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});
