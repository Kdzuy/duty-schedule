function socketIO(io) {
    try {
        const post_md = require("../models/post");
        const axios = require("axios");
        var idConect = [];
        // Hàm gửi yêu cầu đến Together API
        async function fetchChatCompletions(message) {
            try {
            const TOGETHER_API_KEY = "5bc703529b2c152b769998f9560cf4839ca5303649758a78ac5ff82ce8545a58";
            const response = await axios.post(
                'https://api.together.xyz/v1/chat/completions',
                {
                  model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
                  messages: [
                    {
                      role: 'user',
                      content: message,
                    },
                  ],
                },
                {
                  headers: {
                    Authorization: `Bearer ${TOGETHER_API_KEY}`,
                    'Content-Type': 'application/json',
                  },
                }
            );
            //console.log(response.data)
            return response.data.choices[0].message.content;
            } catch (error) {
                console.error('Error making API request:', error.message);
                return "Không hoạt động."
            }
        }
        // var idAdmin=[];
        io.sockets.on("connect", function (socket) {
            // console.log("Có một User mới kết nối");
            //listen adduser event
            socket.on("adduser", function (user_name, id_user, trackper) {
                //save
                socket.user_name = user_name;
                socket.id_user = id_user;
                socket.trackper = trackper;
                // idConect.push(id_user);
                console.log("Username vừa kết nối SocketIO: " + user_name);
                if (socket.trackper <= 2) {
                    socket.join("51296");
                    idConect["51296"] = id_user;//xác định onl, off
                    post_md.deleteDataChatReplay(10,50);

                } else {
                    socket.join(id_user + "");
                    idConect[id_user + ""] = id_user;//xác định onl, off
                };
            });
            //listen disconnect event
            socket.on("disconnect", function () {
                for (var i = 0; i < idConect.length; i++) {
                    if (idConect[i] == socket.id_user) {
                        idConect.splice(i, 1);
                        break;
                    };
                };
            });
            //listen send_message event
            socket.on("send_message", async function (message) {
                //notify to myself
                socket.emit("update_message", message);
                //notify other user
                //console.log('re_user: ',message.re_user)
                if (message && message.msg.toLowerCase().startsWith("bot:")) {
                    let dataChatbot = message.msg.toLowerCase().split("bot:")[1]?.trim().slice(0, 2000) || 'xin chào';
                    //console.log ("Hỏi Chatbot Llama: " + dataChatbot)
                    //let id = message.id_user;
                    message.id_user = 0;
                    message.user_name = "Chatbot"
                    message.msg = (await fetchChatCompletions (dataChatbot))
                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Thay thế **text** thành <strong>text</strong>
                                        .replace(/\n/g, '<br>');  // Thay thế \n thành <br>
                    //console.log("Chatbot: ", message.msg);
                    if (message.trackper <= 2) {
                        message.trackper = 3;
                    } 
                    // else {
                    //     message.trackper = 2;
                    // };
                    socket.emit("update_message", message);
                    // if (message.trackper == 1) {
                    //     message.re_user = "51296";
                    //     socket.to("51296").emit("update_message", message);
                    // } else {
                    //     message.re_user = id;
                    //     socket.to(id + "").emit("update_message", message);
                    // };
                } else {
                    if (message.re_user !== 0) {
                        if (message.trackper <= 2) {
                            socket.to(message.re_user + "").emit("update_message", message);
                            //console.log('re_user1: ',message.re_user)
                        } else {
                            socket.to("51296").emit("update_message", message);
                            //console.log('re_user2: ',message.re_user)
                        };
                    } else {
                        socket.broadcast.emit("update_message", message);
                        //console.log('re_user3: ',message.re_user)
                    };

                    if (message.trackper <= 2) {
                        if (idConect[message.re_user + ""] && idConect[message.re_user + ""] == message.re_user) {
                            message.online = 1;
                        } else {
                            message.online = 0;
                        };
                    } else {
                        if (idConect["51296"]) {
                            message.online = 1;
                        } else {
                            message.online = 0;
                        };
                    }
                    //}
                    //var messageDB = message;
                    // delete messageDB.user_name; 
                    post_md.addDataChat(message);
                };
            });
        });
    } catch (err) {
        console.log('socketIO err: ' + err);
    };
};
module.exports = {
    socketIO: socketIO
}