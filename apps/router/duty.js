const Notifications = require("../models/Notifications");
const fs = require('fs');
const path = require('path');
// Đường dẫn file JSON cố định
const JSON_FILE_PATH = path.join(__dirname, '..', 'Common', 'duty-json', 'data.json');

async function getRenderHTML(req, res) {

    try {
        var data = {
            requser: req.session.user.last_name,
            user: req.session.user,
            trackper: req.session.trackper,
            error: false
        };
        return res.render("duty/index", { data: data });
    } catch (err) {
        console.log(err);
        var data = {
            user: req.session.user,
            trackper: req.session.trackper,
            requser: req.session.user.last_name,
            error: "Không thể lấy dữ liệu."
        };
        return res.render("admin/dashboard", { data: data });
    }
};


async function getJSON(req, res) {
    fs.readFile(JSON_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi đọc file JSON:', err.message);
            return res.status(500).json({ error: 'Không thể đọc file JSON.' });
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseErr) {
            console.error('Lỗi parse JSON:', parseErr.message);
            res.status(500).json({ error: 'Dữ liệu trong file không hợp lệ.' });
        }
    });

};

async function importJSON(req, res) {
    const jsonContent = JSON.stringify(req.body, null, 2);

    fs.writeFile(JSON_FILE_PATH, jsonContent, 'utf8', (err) => {
        if (err) {
            console.error('Lỗi ghi file JSON:', err.message);
            return res.status(500).json({ error: 'Không thể ghi file JSON.' });
        }

        res.json({ success: true, message: 'Đã lưu dữ liệu thành công.' });
    });
}
module.exports = {
    getRenderHTML: getRenderHTML,
    getJSON: getJSON,
    importJSON: importJSON,
};