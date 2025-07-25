

function sqlite3_all (){
var sqlite3_db=require("./localdatabase").sqlite3;
    try {
        var sql = [
        'CREATE TABLE IF NOT EXISTS accountfb (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,id_fb text NOT NULL,type_fb text NOT NULL,number_track INTEGER DEFAULT NULL,problem tinyINTEGER NOT NULL,lever INTEGER DEFAULT NULL,created text)',
        'CREATE TABLE IF NOT EXISTS accountfblogin (iduser INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,user_name text NOT NULL,password text NOT NULL,cookies text  DEFAULT NULL, number_login INTEGER DEFAULT NULL)',
        'CREATE TABLE IF NOT EXISTS datachat (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,id_user INTEGER NOT NULL,trackper INTEGER NOT NULL,created_at text NOT NULL,msg mediumtext NOT NULL,re_user INTEGER DEFAULT NULL)',
        'CREATE TABLE IF NOT EXISTS dataip (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,title text NOT NULL,getip text NOT NULL,useragent text NOT NULL,data_geol text NOT NULL,created_at text NOT NULL)',
        'CREATE TABLE IF NOT EXISTS dataphoto (id text NOT NULL,img longblob NOT NULL,type text NOT NULL)',
        'CREATE TABLE IF NOT EXISTS historystt (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,id_fb text NOT NULL,id_cmt text)',
        'CREATE TABLE IF NOT EXISTS job (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,name text NOT NULL,listjob text NOT NULL,checkrun INTEGER DEFAULT NULL,trainning INTEGER DEFAULT NULL)',
        'CREATE TABLE IF NOT EXISTS keyfind (keyword text NOT NULL,main text, appeared INTEGER DEFAULT NULL)',
        'CREATE TABLE IF NOT EXISTS keytrain (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,keytrain text NOT NULL)',
        'CREATE TABLE IF NOT EXISTS keyinreqhttp (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,keyreq text NOT NULL)',
        'CREATE TABLE IF NOT EXISTS liststt (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,link_stt text NOT NULL,id_fb text NOT NULL,key_train text, pp_like text, pp_comment, text share_public text, number_track INTEGER DEFAULT NULL,check_info INTEGER NOT NULL)',
        'CREATE TABLE IF NOT EXISTS listweb (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,keyval text NOT NULL,arr text NOT NULL,created_at text NOT NULL,numcheck INTEGER NOT NULL,data text, run INTEGER DEFAULT NULL)',
        'CREATE TABLE IF NOT EXISTS nodetodos (id TEXT NOT NULL,id_user INTEGER NOT NULL,user_name text NOT NULL,text_job mediumtext NOT NULL,text_jobdemo mediumtext NOT NULL,job_num INTEGER NOT NULL,created_at text NOT NULL,end_at text NOT NULL,end_atdemo text NOT NULL,end_atreal text,isDone INTEGER NOT NULL,isDonedemo INTEGER NOT NULL)',
        'CREATE TABLE IF NOT EXISTS posts (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,bgimg TEXT NOT NULL,content mediumtext NOT NULL,author TEXT NOT NULL,created_at text NOT NULL,updated_at text NOT NULL)',
        'CREATE TABLE IF NOT EXISTS postsip (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,title text NOT NULL,titleval text NOT NULL,link text NOT NULL,bgimg text NOT NULL,content text NOT NULL,check_geo INTEGER NOT NULL,check_img INTEGER NOT NULL,admin_check INTEGER NOT NULL,id_user INTEGER NOT NULL,name_user text NOT NULL,created_at text NOT NULL)',
        'CREATE TABLE IF NOT EXISTS postsfaster (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,title text NOT NULL,link text NOT NULL,id_user INTEGER NOT NULL,name_user text NOT NULL,created_at text NOT NULL)',
        'CREATE TABLE IF NOT EXISTS timeloadautofb (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,creat_hour INTEGER NOT NULL,creat_minute INTEGER NOT NULL)',
        'CREATE TABLE IF NOT EXISTS users (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,permission text NOT NULL,email text NOT NULL,password text NOT NULL,last_name text NOT NULL,created_at text NOT NULL,updated_at text NOT NULL,restoken text DEFAULT NULL,tokennotify text DEFAULT NULL)',
        'CREATE TABLE IF NOT EXISTS clusters (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,id_user text NOT NULL,id_guest text NOT NULL,created_at text NOT NULL)',
        'ALTER TABLE accountfb ADD PRIMARY KEY (id)',
        'ALTER TABLE accountfblogin ADD PRIMARY KEY (iduser)',
        'ALTER TABLE datachat ADD PRIMARY KEY (id)',
        'ALTER TABLE dataip ADD PRIMARY KEY (id)',
        'ALTER TABLE historystt ADD PRIMARY KEY (id)',
        'ALTER TABLE job ADD PRIMARY KEY (id)',
        'ALTER TABLE keytrain ADD PRIMARY KEY (id)',
        'ALTER TABLE keyinreqhttp ADD PRIMARY KEY (id)',
        'ALTER TABLE liststt ADD PRIMARY KEY (id)',
        'ALTER TABLE listweb ADD PRIMARY KEY (id)',
        'ALTER TABLE posts ADD PRIMARY KEY (id)',
        'ALTER TABLE postsip ADD PRIMARY KEY (id)',
        'ALTER TABLE postsfaster ADD PRIMARY KEY (id)',
        'ALTER TABLE clusters ADD PRIMARY KEY (id)',
        'PRAGMA journal_mode = WAL',
        'PRAGMA synchronous = NORMAL'
      ];
      console.log(sql.length);

      for (let i=0; i<sql.length;i++) { sqlite3_db.run(sql[i], [], (err, result) => { console.log(err,result,i) });};

    } catch (err){
        console.log(err);
        return false;
    };
};

module.exports = {
  addsqlite3: sqlite3_all
};
//bảng postsfaster chưa có trong CSDL MySQL, user có thêm tokennotify