const express = require("express");
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());
const session = require("express-session");
const socketio = require("socket.io");
const secret_key = "secretkey_!@#$%^&*";
const app = express();
//body-parser
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' })); // support encoded bodies
app.use(session({ secret: secret_key, resave: false, saveUninitialized: true, cookie: { secure: false } }));
// static folder
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/apps/views");
app.set("view engine", "ejs");
app.set("trust proxy", 1); //trust first proxy
//app.use(logger('combined'));
const controllers = require(__dirname + "/apps/controllers");
app.use(controllers);
// Middleware xử lý khi không tìm thấy router
app.use((req, res, next) => res.redirect('https://www.google.com/'));
// Middleware xử lý lỗi
app.use((err, req, res, next) => { console.log(err); res.redirect('https://www.google.com/'); });
process.env.TZ = "Asia/Bangkok";
//const host=config.get("server.host");
const port = process.env.PORT || 3000;
const server = app.listen(port, () => { console.log("Server is running on port ", port); });
const io = socketio(server); 
const socketcontrol = require(__dirname + "/apps/common/socketcontrol").socketIO(io);