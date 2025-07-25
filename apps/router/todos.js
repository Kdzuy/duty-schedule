const user_md = require("../models/user");
const post_md = require("../models/post");
const todos_md = require("../models/nodetodos");
const helper = require("../helpers/helper");
const Notifications = require("../models/Notifications");
const cluster = require("./cluster");
const cluster_md = require("../models/cluster");

async function giaoviec(req, res) {
    try {
        const currentUser = req.session.user;
        const currentTrackper = req.session.trackper;
        let dataUser = []; // Khởi tạo danh sách người dùng rỗng

        // Chỉ Admin (1) và Manager (2) mới có thể thấy danh sách để giao việc
        if (currentTrackper <= 2) {
            const allUsers = await user_md.getIdNameUsers();
            
            // Gán trackper để dễ lọc
            allUsers.forEach(user => {
                if (helper.compare_password("1", user.permission)) user.trackper = 1;
                else if (helper.compare_password("2", user.permission)) user.trackper = 2;
                else if (helper.compare_password("3", user.permission)) user.trackper = 3;
            });

            if (currentTrackper === 1) {
                // Admin có thể giao việc cho tất cả User (2) và Guest (3)
                dataUser = allUsers.filter(user => user.trackper === 2 || user.trackper === 3);

            } else if (currentTrackper === 2) { // Manager's Logic
                // Manager có thể giao việc cho các Guest mà họ quản lý VÀ cho chính họ
                const listClusters = await cluster_md.getAllClusters();
                
                // Tạo Set chứa ID của các guest được quản lý
                const managedGuestIds = new Set(
                    listClusters
                        .filter(cluster => parseInt(cluster.id_user, 10) === currentUser.id)
                        .map(cluster => parseInt(cluster.id_guest, 10))
                );

                // ⭐ SỬA LỖI TẠI ĐÂY:
                // Tạo một Set mới chứa các ID có thể được giao việc
                const assignableUserIds = new Set(managedGuestIds);
                // Thêm ID của chính manager vào danh sách này
                assignableUserIds.add(currentUser.id); 

                // Lọc danh sách user cuối cùng dựa trên Set đã có đủ ID
                dataUser = allUsers.filter(user => assignableUserIds.has(user.id));
            }

            // Sửa lỗi sắp xếp: Dùng localeCompare để sắp xếp chuỗi theo alphabet
            if (dataUser.length > 0) {
                dataUser.sort((a, b) => a.last_name.localeCompare(b.last_name));
            }
        }

        // Chuẩn bị dữ liệu để render ra view
        const data = {
            user: currentUser,
            trackper: currentTrackper,
            requser: currentUser.last_name,
            error: false,
            data_users: dataUser // Sẽ là mảng rỗng nếu là Guest
        };

        return res.render("nodetodos/index", { data: data });

    } catch (err) {
        console.log(err);
        return res.redirect("/admin");
    }
};

async function getnodetodo(req, res) {
    try {
        const currentUser = req.session.user;
        const currentTrackper = req.session.trackper;

        // --- BƯỚC 1: LẤY TOÀN BỘ DỮ LIỆU GỐC ---
        let dataTodos = await todos_md.getAllTodos();
        let dataChats = await post_md.getAllDataChat();
        let datausers = await user_md.getNameUsers();
        let listClusters = await cluster_md.getAllClusters();

        // Gán 'trackper' cho mỗi user để tiện cho việc xử lý ở client
        if (datausers && datausers.length > 0) {
            datausers.forEach(user => {
                if (helper.compare_password("1", user.permission)) user.trackper = 1;
                else if (helper.compare_password("2", user.permission)) user.trackper = 2;
                else if (helper.compare_password("3", user.permission)) user.trackper = 3;
            });
        }
        
        // --- BƯỚC 2: LỌC DỮ LIỆU DỰA TRÊN QUYỀN HẠN CỦA NGƯỜI DÙNG ---

        if (currentTrackper === 2) { // Logic lọc cho Manager
            
            const managedGuestIds = new Set(
                listClusters
                    .filter(cluster => parseInt(cluster.id_user, 10) === currentUser.id && cluster.id_guest !== 0)
                    .map(cluster => parseInt(cluster.id_guest, 10))
            );
            const relevantUserIds = new Set(managedGuestIds).add(currentUser.id);

            dataTodos = dataTodos.filter(todo => relevantUserIds.has(todo.id_user)); 
            
            // SỬA LẠI DÒNG NÀY: Dùng || (hoặc) thay vì && (và)
            dataChats = dataChats.filter(message =>
                relevantUserIds.has(message.id_user) || relevantUserIds.has(message.re_user) || (message.re_user == 0 && message.trackper === 1)
            );
            
            // datausers = datausers.filter(user => relevantUserIds.has(user.id));

        } else if (currentTrackper === 3) { // Logic lọc cho Guest
            
            const managerInCharge = listClusters.find(c => parseInt(c.id_guest, 10) === currentUser.id);
            const managerId = managerInCharge ? parseInt(managerInCharge.id_user, 10) : null;
            const allowedIds = new Set([1, currentUser.id]);
            //console.log("allowedIds:", allowedIds);
            if (managerId) allowedIds.add(managerId);

            dataTodos = dataTodos.filter(todo => todo.id_user === currentUser.id);
            dataChats = dataChats.filter(message => 
                allowedIds.has(message.id_user) || allowedIds.has(message.re_user) || (message.re_user == 0 && message.trackper === 1)
            );
    
            // datausers = datausers.filter(user => allowedIds.has(user.id));
        }
        // Admin (trackper 1) không bị lọc và sẽ thấy tất cả.

        // --- BƯỚC 3: TỔNG HỢP VÀ TRẢ VỀ RESPONSE ---
        const responseData = {
            data: dataTodos,
            user: {
                id_user: currentUser.id,
                user_name: currentUser.last_name,
                trackper: currentTrackper
            },
            datachat: dataChats,
            listusers: datausers
        };
        //console.log("Response Data:", responseData);
        return res.json(responseData);

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status_code: 500, message: "Lỗi phía máy chủ" });
    }
};

async function postnodetodo(req, res) {
    try {
        var params = req.body;
        if (!params || !params.text_job ||
            (params && params.text_job && (params.text_job.length > 1000 || params.text_job.length == 0)))
            return res.json({ status_code: 400 });

        var todo = {
            id_user: params.id_user,
            user_name: params.user_name,
            text_job: params.text_job,
            text_jobdemo: params.text_job,
            job_num: 1,
            created_at: params.created_at,
            end_at: params.end_at,
            end_atdemo: params.end_at,
            end_atreal: null,
            isDone: params.isDone,
            isDonedemo: params.isDone
        };
        var today = new Date();
        var nowday = today.getSeconds() + "-" + today.getMinutes() + "-" + today.getHours() + "-" + today.getDate() + "-" + today.getMonth() + "-" + today.getFullYear();
        todo.id = todo.id_user + "-" + nowday;

        if (req.session.trackper <= 2) {
            var optionData = "Vừa bổ sung công việc cho bạn!";
            var titleUser = "Admin";
            await Notifications.getNotificationDefault(
                params.id_user + "",
                titleUser,
                optionData,
                process.argv[2] ? process.argv[2] + "/todos/dashboard" : ""
            );
        }

        var result = await todos_md.addTodo(todo);
        var data = {
            id: todo.id,
            id_user: todo.id_user,
            user_name: todo.user_name,
            text_job: todo.text_job,
            job_num: todo.job_num,
            created_at: todo.created_at,
            end_at: todo.end_at,
            end_atdemo: todo.end_atdemo,
            end_atreal: todo.end_atreal,
            isDone: todo.isDone,
            isDonedemo: todo.isDonedemo
        };

        console.log("Node Todos đã lên DB!!!");
        return res.json(data);
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 }); // Handle error response
    }
};

async function putnodetodo(req, res) {
    try {
        var params = req.body;
        var UserId;
        var titleUser;
        if (req.body.id == "" || req.body.id == undefined || !params || !params.text_jobdemo ||
            (params.text_jobdemo && (params.text_jobdemo.length > 1000 || params.text_jobdemo.length == 0))) {
            return res.status(400).send("Không có ID bài viết hoặc sai cấu trúc dữ liệu");
        } else {
            if (req.session.trackper <= 2) {
                var optionData = "Vừa cập nhật Công việc của bạn!";
                UserId = params.id_user;
                titleUser = "Admin";
            } else if (req.session.trackper == 3) {
                var optionData = "Vừa gửi yêu cầu cập nhật Công việc!";
                UserId = 51296;
                titleUser = req.session.user.last_name;
            }

            await Notifications.getNotificationDefault(
                UserId + "",
                titleUser,
                optionData,
                process.argv[2] ? process.argv[2] + "/todos/dashboard" : "");

            var result = await todos_md.updateTodo(params);

            if (!result) {
                return res.json({ status_code: 400 });
            } else {
                return res.json({ status_code: 200 });
            }
        }
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 }); // Handle error response
    }
};

async function putnodetodofn(req, res) {
    try {
        var id = req.body.id;
        if (id == "" || id == undefined) {
            return res.status(400).send("Không có ID bài viết");
        } else {
            var params = req.body;

            if (params.isDone == true) {
                params.isDone = 1;
            } else {
                params.isDone = 0;
            };

            var UserId;
            var titleUser;

            if (req.session.trackper <= 2) {
                titleUser = "Admin";

                if (params.isDone == 1) {
                    var optionData = "Vừa xác nhận 01 công việc của bạn hoàn thành!";
                } else {
                    var optionData = "Vừa đề nghị bạn xem lại tiến độ 01 công việc!";
                }

                UserId = params.id_user;
            } else if (req.session.trackper == 3) {
                titleUser = req.session.user.last_name;

                if (params.isDone == 1) {
                    var optionData = "Vừa yêu cầu xác nhận hoàn thành 01 công việc!";
                } else {
                    var optionData = "Vừa đề nghị tiếp tục thực hiện 01 công việc!";
                }

                UserId = 51296;
            }

            await Notifications.getNotificationDefault(
                UserId + "",
                titleUser,
                optionData,
                process.argv[2] ? process.argv[2] + "/todos/dashboard" : "");

            var result = await todos_md.sucessUpdateTodo(params);

            if (!result) {
                return res.json({ status_code: 400 });
            } else {
                return res.json({ status_code: 200 });
            }
        }
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 }); // Handle error response
    }
};

async function putnodetododel(req, res) {
    try {
        var id = req.body.id;
        if (id == "" || id == undefined) {
            console.log("méo có ID để xóa");
            return res.status(400).send("ID không tồn tại");
        } else {
            if (req.session.trackper <= 1) {
                var result = await todos_md.deleteTodo(id);
                if (!result) {
                    return res.json({ status_code: 400 });
                } else {
                    return res.json({ status_code: 200 });
                }
            } else {
                return res.status(400).send("Bạn không có quyền admin");
            }
        }
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 }); // Handle error response
    }
};

async function getchat(req, res) {
    try {
        var params = req.body;
        var data;

        if (params[0] === 0) {
            data = await post_md.getAllDataChat();
        } else {
            data = await post_md.getAllDataChatbyIdUser(params[0]);
        }

        return res.json(data);
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 });
    }
};

module.exports = {
    dashboard: giaoviec,
    getnodetodo: getnodetodo,
    postnodetodo: postnodetodo,
    putnodetodo: putnodetodo,
    putnodetodofn: putnodetodofn,
    putnodetododel: putnodetododel,
    getchat: getchat
};