
// Hàm tính toán giá trị băm SHA-256 của một file
function sha256File(file, chunkSize, callback) {
  const fileReader = new FileReader();
  let currentPosition = 0;
  let sha256Hash = [];

  // Hàm tính toán giá trị băm SHA-256 cho một chunk
  function calculateChunkSha256(chunk) {
    const byteArray = new Uint8Array(chunk);
    const wordArray = [];

    // Chuyển đổi mảng byte thành mảng từ có thể xử lý được bởi thư viện CryptoJS
    for (let i = 0; i < byteArray.length; i++) {
      wordArray.push(byteArray[i]);
    }

    // Tính toán giá trị băm SHA-256 cho chunk
    const chunkSha256 = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(wordArray));
    sha256Hash.push(chunkSha256.toString(CryptoJS.enc.Hex));
  }

  // Hàm đọc một chunk từ file
  function readChunk() {
    const chunk = file.slice(currentPosition, currentPosition + chunkSize);
    fileReader.readAsArrayBuffer(chunk);
  }

  // Sự kiện được kích hoạt khi fileReader đã đọc xong một chunk
  fileReader.onload = function (e) {
    calculateChunkSha256(e.target.result);

    currentPosition += chunkSize;

    // Nếu còn chunk tiếp theo, tiếp tục đọc
    if (currentPosition < file.size) {
      readChunk();
    } else {
      // Nếu đã đọc xong toàn bộ file, ghép các giá trị băm của các chunks lại với nhau để tạo ra giá trị băm của file
      const fileSha256 = CryptoJS.SHA256(sha256Hash.join(''));
      callback(fileSha256.toString(CryptoJS.enc.Hex));
    }
  };
  fileReader.onerror = function (err) {
    let list_infomation = document.getElementById("list-infomation");
    list_infomation.innerHTML = "<li class='re-hash'>Failed to read file: " + err + "</li>"
    console.error("Failed to read file", err);
  };
  // Đọc chunk đầu tiên
  readChunk();
}

function handleFileSelect() {
  const file = document.getElementById('file-input').files[0];
  const filename = file.name;
  let list_infomation = document.getElementById("list-infomation");
  if (!file) {
    alert("Không tìm thấy file cần Hash!")
    return;
  }
  sha256File(file, 1024 * 1024, function (fileSha256) {
    list_infomation.innerHTML = "<li class='re-hash' hash-text='"+fileSha256+"'><b>" + filename + " (SHA256): </b>" + fileSha256 + "</li>"
    btnClick();
    copyHashText(fileSha256);
    console.log('SHA-256 hash of file: ', filename, " is: ", fileSha256);
  });
}
function btnClick(){
  $('.re-hash').click(function() {
    // Lấy giá trị của thuộc tính 'hash-text'
    const hashText = $(this).attr('hash-text');
    
    // Sao chép nội dung vào clipboard
    copyHashText(hashText);
  });
};

function copyHashText(value) {
  try {
    var tempInput = $("<input>").attr("id", "tempInputId");
    $("body").append(tempInput);
    tempInput.val(value);
    tempInput[0].select();
    document.execCommand("copy");
    tempInput.remove();
    console.log("Copied to clipboard: " + value);
  } catch (error) {
    console.log('Lỗi khi copy:', error);
  };
}