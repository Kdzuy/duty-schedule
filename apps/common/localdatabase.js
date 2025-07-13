const sqlite3db = require('sqlite3').verbose();
const sqlite3 = new sqlite3db.Database('./apps/common/DBLocal/localdatabase.sqlite', (err) => {  //cần truyền vào một đường dẫn đến file csdl sqlite để khởi tạo một kết nối đến file để bắt đầu đọc ghi
    if (err) {
      console.log('Could not connect to database', err)   //Kết nối chưa thành công, có lỗi
    } else {
      console.log('Connected to database Local in Server')   //Đã kết nối thành công và sẵn sàng để đọc ghi DB
    };
  });
exports.sqlite3 = sqlite3;