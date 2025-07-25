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
        const params = req.body;
        const currentUser = req.session.user;
        const currentTrackper = req.session.trackper;
        let notificationTargetId;
        let notificationTitle;
        let notificationMessage;

        // --- BƯỚC 1: KIỂM TRA DỮ LIỆU ĐẦU VÀO ---
        if (!params || !params.text_job || params.text_job.length > 1000 || params.text_job.length === 0) {
            return res.status(400).json({ status_code: 400, message: "Nội dung công việc không hợp lệ." });
        }

        // --- BƯỚC 2: CHUẨN BỊ DỮ LIỆU TODO ---
        const today = new Date();
        // Sửa lỗi getMonth() (từ 0-11, cần +1) và tạo ID tốt hơn
        const nowday = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`;
        const todo = {
            id: `${params.id_user}-${nowday}-${Math.random().toString(36).substr(2, 5)}`, // Thêm chuỗi ngẫu nhiên để tránh trùng
            id_user: params.id_user,
            user_name: params.user_name,
            text_job: params.text_job,
            text_jobdemo: params.text_job,
            job_num: 1,
            created_at: params.created_at,
            end_at: params.end_at,
            end_atdemo: params.end_at,
            end_atreal: null,
            isDone: params.isDone || 0,
            isDonedemo: params.isDone || 0
        };

        // --- BƯỚC 3: XỬ LÝ GỬI THÔNG BÁO THEO CLUSTER ---
        if (currentTrackper <= 2) { // Admin hoặc Manager giao việc
            notificationMessage = "Vừa giao cho bạn một công việc mới!";
            notificationTitle = currentUser.last_name; // Lấy tên người giao việc
            notificationTargetId = params.id_user;     // Gửi thông báo cho người được giao việc

        } else if (currentTrackper === 3) { // Guest tự tạo việc
            notificationMessage = "Vừa tạo một công việc mới.";
            notificationTitle = currentUser.last_name; // Lấy tên của guest
            const guestId = currentUser.id;

            // Tìm manager quản lý guest này để gửi thông báo
            const listClusters = await cluster_md.getAllClusters();
            const clusterLink = listClusters.find(c => parseInt(c.id_guest, 10) === guestId);

            if (clusterLink && clusterLink.id_user) {
                notificationTargetId = clusterLink.id_user; // Gửi thông báo cho manager
            }
        }

        // Gửi thông báo nếu đã xác định được người nhận
        if (notificationTargetId) {
            await Notifications.getNotificationDefault(
                notificationTargetId.toString(),
                notificationTitle,
                notificationMessage,
                process.argv[2] ? `${process.argv[2]}/todos/dashboard` : ""
            );
        }

        // --- BƯỚC 4: LƯU VÀO CSDL VÀ TRẢ VỀ KẾT QUẢ ---
        await todos_md.addTodo(todo);

        console.log("Node Todos đã được thêm vào DB!");
        return res.status(201).json(todo); // Trả về 201 Created và toàn bộ object todo mới

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status_code: 500, message: "Lỗi phía máy chủ" });
    }
};

async function putnodetodo(req, res) {
    try {
        const params = req.body;
        const currentUser = req.session.user;
        const currentTrackper = req.session.trackper;
        let notificationTargetId;
        let notificationTitle;

        // --- BƯỚC 1: KIỂM TRA DỮ LIỆU ĐẦU VÀO ---
        if (!params || !params.id || !params.text_jobdemo || params.text_jobdemo.length > 1000 || params.text_jobdemo.length === 0) {
            return res.status(400).send("Không có ID bài viết hoặc sai cấu trúc dữ liệu");
        }

        // --- BƯỚC 2: XÁC ĐỊNH NGƯỜI NHẬN THÔNG BÁO ---
        let notificationMessage;
        if (currentTrackper <= 2) { // Admin hoặc Manager cập nhật
            notificationMessage = "Vừa cập nhật Công việc của bạn!";
            // Thông báo được gửi đến người sở hữu công việc (là guest)
            notificationTargetId = params.id_user; 
            // Tiêu đề thông báo là tên của người thực hiện thay đổi
            notificationTitle = currentUser.last_name;

        } else if (currentTrackper === 3) { // Guest cập nhật
            notificationMessage = "Vừa gửi yêu cầu cập nhật Công việc!";
            const guestId = currentUser.id;

            // Tìm manager quản lý guest này
            const listClusters = await cluster_md.getAllClusters();
            const clusterLink = listClusters.find(c => parseInt(c.id_guest, 10) === guestId);

            if (clusterLink && clusterLink.id_user) {
                // Nếu tìm thấy, người nhận thông báo chính là manager đó
                notificationTargetId = clusterLink.id_user;
            } else {
                // Nếu không có manager nào quản lý, gửi cho kênh chung (ví dụ: admin)
                notificationTargetId = 51296; 
            }
            // Tiêu đề thông báo là tên của guest
            notificationTitle = currentUser.last_name;
        }

        // --- BƯỚC 3: GỬI THÔNG BÁO ---
        // Chỉ gửi nếu đã xác định được người nhận
        if (notificationTargetId) {
            await Notifications.getNotificationDefault(
                notificationTargetId.toString(),
                notificationTitle,
                notificationMessage,
                process.argv[2] ? `${process.argv[2]}/todos/dashboard` : ""
            );
        }

        // --- BƯỚC 4: CẬP NHẬT CSDL ---
        const result = await todos_md.updateTodo(params);

        if (!result) {
            return res.status(400).json({ status_code: 400, message: "Cập nhật thất bại" });
        } else {
            return res.json({ status_code: 200, message: "Cập nhật thành công" });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status_code: 500, message: "Lỗi phía máy chủ" });
    }
};

async function putnodetodofn(req, res) {
    try {
        const params = req.body;
        const currentUser = req.session.user;
        const currentTrackper = req.session.trackper;
        let notificationTargetId;
        let notificationTitle;
        let notificationMessage;

        // --- BƯỚC 1: KIỂM TRA DỮ LIỆU ĐẦU VÀO ---
        if (!params || !params.id) {
            return res.status(400).send("Không có ID bài viết");
        }

        // Chuyển đổi giá trị boolean từ client sang 0 hoặc 1
        params.isDone = params.isDone ? 1 : 0;

        // --- BƯỚC 2: XÁC ĐỊNH NỘI DUNG VÀ NGƯỜI NHẬN THÔNG BÁO ---
        if (currentTrackper <= 2) { // Admin hoặc Manager thực hiện
            notificationTitle = currentUser.last_name; // Lấy tên của người thực hiện
            notificationTargetId = params.id_user;     // Gửi cho người sở hữu công việc (guest)
            
            if (params.isDone === 1) {
                notificationMessage = "Vừa xác nhận 01 công việc của bạn hoàn thành!";
            } else {
                notificationMessage = "Vừa đề nghị bạn xem lại tiến độ 01 công việc!";
            }

        } else if (currentTrackper === 3) { // Guest thực hiện
            notificationTitle = currentUser.last_name; // Lấy tên của guest
            const guestId = currentUser.id;

            // Tìm manager quản lý guest này
            const listClusters = await cluster_md.getAllClusters();
            const clusterLink = listClusters.find(c => parseInt(c.id_guest, 10) === guestId);

            if (clusterLink && clusterLink.id_user) {
                // Nếu tìm thấy, người nhận thông báo chính là manager đó
                notificationTargetId = clusterLink.id_user;
            } else {
                // Nếu không có manager, gửi cho kênh chung (ví dụ: admin)
                notificationTargetId = 51296; 
            }

            if (params.isDone === 1) {
                notificationMessage = "Vừa yêu cầu xác nhận hoàn thành 01 công việc!";
            } else {
                notificationMessage = "Vừa đề nghị tiếp tục thực hiện 01 công việc!";
            }
        }
        //console.log("Notification Target ID:", notificationTargetId);
        // --- BƯỚC 3: GỬI THÔNG BÁO ---
        if (notificationTargetId) {
            await Notifications.getNotificationDefault(
                notificationTargetId.toString(),
                notificationTitle,
                notificationMessage,
                process.argv[2] ? `${process.argv[2]}/todos/dashboard` : ""
            );
        }

        // --- BƯỚC 4: CẬP NHẬT CSDL ---
        const result = await todos_md.sucessUpdateTodo(params);

        if (!result) {
            return res.status(400).json({ status_code: 400, message: "Cập nhật thất bại" });
        } else {
            return res.json({ status_code: 200, message: "Cập nhật trạng thái thành công" });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status_code: 500, message: "Lỗi phía máy chủ" });
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