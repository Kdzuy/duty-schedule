const user_md = require("../models/user");
const post_md = require("../models/post");
const todos_md = require("../models/nodetodos");
const helper = require("../helpers/helper");
const Notifications = require("../models/Notifications");

async function giaoviec(req, res) {
    try {
        // if (req.session.trackper < 3) {
        if (req.session.trackper <= 2) {
            var users = await user_md.getIdNameUsers();
            var dataUser = [];
            if (users && users.length > 0) {
                for (var i = 0; i < users.length; i++) {
                    if (helper.compare_password("3", users[i].permission) || helper.compare_password("2", users[i].permission)) dataUser.push(users[i]);
                }
            }
            if (dataUser && dataUser.length > 0) {
                dataUser.sort(function (a, b) {
                    return a.last_name - b.last_name;
                });
            }


            var data = {
                user: req.session.user,
                trackper: req.session.trackper,
                requser: req.session.user.last_name,
                error: false,
                data_users: dataUser
            };

            return res.render("nodetodos/index", { data: data });
        } else {
            var data = {
                user: req.session.user,
                trackper: req.session.trackper,
                requser: req.session.user.last_name,
                error: false
            };

            return res.render("nodetodos/index", { data: data });
        }
        // } else {
        //     return res.redirect("/admin/signin");
        // }
    } catch (err) {
        console.log(err);
        return res.redirect("/admin");
    }
};

async function getnodetodo(req, res) {
    try {
        // if (req.session.trackper < 3) {
        let dataTodos, dataChats, datausers;
        if (req.session.trackper == 3) {
            dataTodos = await todos_md.getAllTodosbyUser(req.session.user.id);
            dataChats = await post_md.getAllDataChatbyIdUser(req.session.user.id);
        } else if (req.session.trackper <= 2) {
            dataTodos = await todos_md.getAllTodos();
            dataChats = await post_md.getAllDataChat();
        }
        //console.log(dataChats)
        datausers = await user_md.getNameUsers();

        var user = {
            id_user: req.session.user.id,
            user_name: req.session.user.last_name,
            trackper: req.session.trackper
        };

        delete dataChats.user_name;

        var todos = {
            data: dataTodos,
            user: user,
            datachat: dataChats
        };
        if (datausers && datausers.length > 0) {
            for (let i = 0; i < datausers.length; i++) {
                if (helper.compare_password("1", datausers[i].permission)) {
                    datausers[i].trackper = 1;
                } else if (helper.compare_password("2", datausers[i].permission)) {
                    datausers[i].trackper = 2;
                } else if (helper.compare_password("3", datausers[i].permission)) {
                    datausers[i].trackper = 3;
                }
            }
        }
        todos.listusers = datausers;

        return res.json(todos);
        // } else {
        //     return res.redirect("/admin/signin");
        // }
    } catch (err) {
        console.log(err);
        return res.json({ status_code: 400 }); // Handle error response
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