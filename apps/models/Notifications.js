const user_md = require("../models/user");
const todos_md = require("../models/nodetodos");
const web_push_md = require("../models/web-push");
const helper = require("../helpers/helper");
const PushNotifications = require("@pusher/push-notifications-server");
const beamsClient = new PushNotifications({
    instanceId: "2131fdf4-c465-4976-8987-018f733f6fc8",
    secretKey: "E0F647BE6BD8B58BAA66E75B13B4F0EB16A08EF1BA9FEA54B164A5800EE5AF77",
});
//const domain = process.argv[2]?process.argv[2]:"";
//==========================================================
async function getNotifiTrackIP(params) {
    // lấy thông tin user từ máy chủparams.title,params.id_user,params.name_user
    try {

        //var dataUsers=await user_md.getNameUsers(idUser);
        if (!params || !params.title || !params.name_user || !params.id_user) return false;
        console.log('get push Track IP: ' + params.title + ' to "' + params.name_user + '"');
        //var optionData = ;
        let user = await user_md.getUserbyID(params.id_user);
        let tokennotify = (user && user.length > 0) ? user[0].tokennotify : "";
        const infoNotify = await web_push_md.pushNotifications(
            tokennotify,
            params.name_user,
            'Cắn câu: ' + params.title + '. Kiểm tra!',
            (process.argv[2] && params.title) ? (process.argv[2] + "/data/" + params.title) : ""
        );
        if (infoNotify == false)
            getNotificationDefault(
                params.id_user + "",
                params.name_user,
                'Cắn câu: ' + params.title + '. Kiểm tra!',
                (process.argv[2] && params.title) ? (process.argv[2] + "/data/" + params.title) : ""
            );
    } catch (err) {
        console.log('getNotification err: ', err);
    };
};

// async function getNotificationTodos() {
//     try {
//         var days=[];
//         var lates=[];
//         var users=[];

//         console.log('Run Push Notification!')

//         const userss = await user_md.getNameUsers();
//         for (var i = 0; i<userss.length; i++) {
//             if (helper.compare_password("2", userss[i].permission)) {
//                 users.push(userss[i].id);
//                 days[userss[i].id+""]=0;
//                 lates[userss[i].id+""]=0;
//             }
//         }

//         const late = await todos_md.getCountInfoTodoLatebyID();
//         if (late.length > 0) {
//             for (var i = 0; i < users.length; i++) {
//                 for (var j = 0; j < late.length; j++) {
//                     if (users[i] == late[j].id_user) {
//                         lates[users[i]+""]++;
//                     }
//                 }
//             }  
//         }

//         const day = await todos_md.getCountInfoTodoDaybyID();
//         if (day.length > 0) {
//             for (var i = 0; i < users.length; i++) {
//                 for (var j = 0; j < day.length; j++) {
//                     if (users[i] == day[j].id_user) {
//                         days[users[i]+""]++;
//                     }
//                 }
//             }
//         }

//         for (var i = 0; i < users.length; i++) {
//             if (days[users[i]+""] > 0){
//                 var optionData = "Hôm nay có (" + days[users[i]+""] + ") việc, Trễ (" + lates[users[i]+""]  + ")";
//                 var titleUser="Admin";
//                 getNotificationDefault(users[i]+"",titleUser,optionData,process.argv[2]?process.argv[2]+"/todos/dashboard":"");
//             }
//         }
//     } catch (error) {
//         console.error(error);
//     }
// }
async function getNotificationTodos() {
    try {
        console.log('Run Push Notification!')
        const allUsers = await user_md.getNameUsers();
        const users = allUsers
            .filter(user => helper.compare_password("2", user.permission))
            .map(user => ({
                id: user.id,
                days: 0,
                lates: 0
            }));
        const late = await todos_md.getCountInfoTodoLatebyID();
        const day = await todos_md.getCountInfoTodoDaybyID();

        users.forEach(user => {
            late.forEach(todo => {
                if (user.id == todo.id_user) user.lates++;
            });

            day.forEach(todo => {
                if (user.id == todo.id_user) user.days++;
            });
        });

        for (const user of users) {
            if (user.days > 0) {
                const optionData = `Hôm nay có (${user.days}) việc, Trễ (${user.lates})`;
                const titleUser = "Admin";
                const notificationLink = process.argv[2] ? (process.argv[2] + "/todos/dashboard") : "";
                await getNotificationDefault(user.id, titleUser, optionData, notificationLink);
            }
        }
    } catch (error) {
        console.error(error);
    }
}


async function getNotificationDefault(id, title, body, url) {
    try {
        const publishResponse = await beamsClient.publishToInterests([id + "notify"], {
            web: {
                notification: {
                    title: title,
                    body: body.substring(0, 50),
                    deep_link: url
                }
            }
        });
        console.log('Just published:', publishResponse.publishId);
    } catch (error) {
        console.log('beamsClient Error:', error);
        try {
            if (id == "51296") {
                // gửi cho các admin
                console.log('id: ', id, ' gửi từng Admin');
                await Promise.all((await user_md.getNameUsers()).map(async (aUser) => {
                    if (helper.compare_password("1", aUser.permission))
                        await web_push_md.pushNotifications(aUser.tokennotify, title, body, url);
                }));
            } else {
                let user = await user_md.getUserbyID(id);
                let tokennotify = (user && user.length > 0) ? user[0].tokennotify : "";
                await web_push_md.pushNotifications(tokennotify, title, body, url);
            }

        } catch (err) {
            console.log('Web_push Error:', err);
        }
    }
};

module.exports = {
    getNotifiTrackIP: getNotifiTrackIP,
    getNotificationTodos: getNotificationTodos,
    getNotificationDefault: getNotificationDefault
};