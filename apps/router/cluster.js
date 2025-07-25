const Notifications = require("../models/Notifications");
const cluster_md = require("../models/cluster");
const user_md = require("../models/user");
const helper = require("../helpers/helper");
const fs = require('fs');
const path = require('path');
// // Đường dẫn file JSON cố định
// const JSON_FILE_PATH = path.join(__dirname, '..', 'common', 'duty-json', 'data.json');

async function getRenderHTML(req, res) {

    try {
        var data = {
            requser: req.session.user.last_name,
            user: req.session.user,
            trackper: req.session.trackper,
            error: false
        };
        return res.render("cluster/index", { data: data });
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


async function getAllUserGuestClusters(req, res) {
    try {
        var data = {
            requser: req.session.user.last_name,
            user: req.session.user,
            trackper: req.session.trackper,
            error: false
        };
        var datausers = await user_md.getAllUsers();

        if (datausers && datausers.length > 0) {
            for (let i = 0; i < datausers.length; i++) {
                if (helper.compare_password("1", datausers[i].permission)) {
                    datausers.splice(i, 1);;
                } else if (helper.compare_password("2", datausers[i].permission)) {
                    datausers[i].trackper = 2;
                } else if (helper.compare_password("3", datausers[i].permission)) {
                    datausers[i].trackper = 3;
                }
            }
        }
        data.listusers = datausers;
        var dataClusters = await cluster_md.getAllClusters();
        data.listclusters = dataClusters;
        //console.log(data);
        return res.json(data);
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 }); // Handle error response
    }
};

async function importCluster(req, res) {
    const { id_user, id_guest } = req.body;

    if (!id_user || !id_guest) {
        return res.status(400).json({ error: 'ID người dùng và ID guest không được để trống.' });
    }

    try {
        const newCluster = {
            id_user,
            id_guest,
            created_at: new Date().toISOString(),
        };

        // Lưu cụm mới vào cơ sở dữ liệu
        let idNewCluster = await cluster_md.addCluster(newCluster);
        console.log("ID Cụm mới:", idNewCluster);
        if (!idNewCluster) {
            return res.status(500).json({ error: 'Không thể tạo cụm mới.' });
        }
        return res.status(201).json({ success: true, message: 'Cụm đã được tạo thành công.', clusterID: idNewCluster});
    } catch (error) {
        console.error('Lỗi khi tạo cụm:', error);
        return res.status(500).json({ error: 'Không thể tạo cụm.' });
    }
    
}
async function deleteCluster(req, res) {
    const { id_cluster } = req.body;
            console.log("ID Cụm cần xóa:", id_cluster);
    if (!id_cluster) {
        return res.status(400).json({ error: 'ID cụm không được để trống.' });
    }

    try {
        // Xóa cụm khỏi cơ sở dữ liệu

        let result = await cluster_md.deleteCluster(id_cluster);
        if (!result) {
            return res.status(500).json({ error: 'Không thể xóa cụm.' });
        }
        return res.status(200).json({ success: true, message: 'Cụm đã được xóa thành công.' });
    } catch (error) {
        console.error('Lỗi khi xóa cụm:', error);
        return res.status(500).json({ error: 'Không thể xóa cụm.' });
    }
}
module.exports = {
    getRenderHTML: getRenderHTML,
    getAllUserGuestClusters: getAllUserGuestClusters,
    importCluster: importCluster,
    deleteCluster: deleteCluster
};