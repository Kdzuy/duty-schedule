const DBLocal = require("./funcrion_DB_Local");
function getAllTodosbyUser(id_user) {
    try {
        if (id_user) {
            var querys = "SELECT * FROM nodetodos WHERE id_user=? ORDER BY end_at ASC LIMIT 15";
            var quer = [id_user];
            return DBLocal.sqlite3_all(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function getAllTodos() {
    try {
        var querys = "SELECT * FROM nodetodos";
        var quer = [];
        return DBLocal.sqlite3_all(querys, quer);
    } catch (err) {
        console.log(err);
        return false;
    };
};
function getAllTodosByFounder(params) {
    try {
        if (params) {
            var querys = "SELECT * FROM nodetodos ORDER BY end_at ASC LIMIT ?";
            var quer = [params];
            return DBLocal.sqlite3_all(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};
function getAllTodobyDay(params) {
    try {
        if (params) {
            var querys = "SELECT * FROM nodetodos WHERE DATE(?) < DATE(end_at) AND DATE(?) > DATE(end_at)";
            var quer = [params.start, params.end];
            return DBLocal.sqlite3_all(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function getTodobyID(id) {
    try {
        if (id) {
            var querys = "SELECT * FROM nodetodos WHERE id=?";
            var quer = [id];
            return DBLocal.sqlite3_all(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function addTodo(params) {
    try {
        if (params) {
            var querys = "INSERT INTO nodetodos(id,id_user,user_name,text_job,text_jobdemo,job_num,created_at,end_at,end_atdemo,end_atreal,isDone,isDonedemo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
            var quer = [params.id, params.id_user, params.user_name, params.text_job, params.text_jobdemo, params.job_num,
            params.created_at, params.end_at, params.end_atdemo, params.end_atreal, params.isDone, params.isDonedemo];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function updateTodo(params) {
    try {
        if (params) {
            if (params.job_num == 2) {
                var querys1 = "UPDATE nodetodos SET text_jobdemo=?, job_num=?,  end_atdemo=? WHERE id=?";
                var quer1 = [params.text_jobdemo, 2, params.end_atdemo, params.id];
                return DBLocal.sqlite3_run(querys1, quer1);
            } else if (params.job_num == 1) {
                var querys2 = "UPDATE nodetodos SET text_job=?, text_jobdemo=?, job_num=?,  end_at=?, end_atdemo=? WHERE id=?";
                var quer2 = [params.text_jobdemo, params.text_jobdemo, 1, params.end_atdemo, params.end_atdemo, params.id];
                return DBLocal.sqlite3_run(querys2, quer2);
            };
            return false;
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };

};

function sucessUpdateTodo(params) {
    try {
        if (params) {
            if (params.end_atreal !== null && params.end_atreal !== '') {
                var querys1 = "UPDATE nodetodos SET job_num=?,  end_atreal=?, isDone=?, isDonedemo=?  WHERE id=?";
                var quer1 = [1, params.end_atreal, 1, 1, params.id];
                return DBLocal.sqlite3_run(querys1, quer1);
            } else if (params.job_num == 2 && params.isDone == 1) {
                var querys2 = "UPDATE nodetodos SET job_num=?, isDonedemo=? WHERE id=?";
                var quer2 = [2, 1, params.id];
                return DBLocal.sqlite3_run(querys2, quer2);
            } else if (params.job_num == 2 && params.isDone == 0) {
                var querys3 = "UPDATE nodetodos SET job_num=?, isDone=?, isDonedemo=? WHERE id=?";
                var quer3 = [1, 0, 0, params.id];
                return DBLocal.sqlite3_run(querys3, quer3);
            } else if (params.job_num == 1 && params.end_atreal == null) {
                var querys4 = "UPDATE nodetodos SET job_num=?, end_atreal=?, isDone=?, isDonedemo=? WHERE id=?";
                var quer4 = [1, null, 0, 0, params.id];
                return DBLocal.sqlite3_run(querys4, quer4);
            };
            return false;
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function notSuccUpdateTodo(params) {
    try {
        if (params) {
            var querys = "UPDATE nodetodos SET text_jobdemo=?, job_num=?,  end_atdemo=?,  isDoneDemo=?  WHERE id=?";
            var quer = [params.text_job, 1, params.end_atdemo, params.isDoneDemo, params.id];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function deleteTodo(id) {
    try {
        if (id) {
            var querys = "DELETE FROM nodetodos WHERE id=?";
            var quer = [id];
            return DBLocal.sqlite3_run(querys, quer);
        };
        return false;
    } catch (err) {
        console.log(err);
        return false;
    };
};

function getCountInfoTodoLatebyID() {
    try {
        var querys = "SELECT id_user FROM nodetodos WHERE (DATE(end_at) < DATE('now')) AND isDone=0";
        var quer = [];
        return DBLocal.sqlite3_all(querys, quer);
    } catch (err) {
        console.log(err);
        return false;
    };
};

function getCountInfoTodoDaybyID() {
    try {
        var querys = "SELECT id_user FROM nodetodos WHERE (DATE(end_at) < DATE('now') OR DATE(end_at) = DATE('now')) AND isDone=0";
        var quer = [];
        return DBLocal.sqlite3_all(querys, quer);
    } catch (err) {
        console.log(err);
        return false;
    };
};

module.exports = {
    getAllTodosbyUser: getAllTodosbyUser,
    getAllTodos: getAllTodos,
    getAllTodosByFounder: getAllTodosByFounder,
    getAllTodobyDay: getAllTodobyDay,
    getTodobyID: getTodobyID,
    addTodo: addTodo,
    updateTodo: updateTodo,
    sucessUpdateTodo: sucessUpdateTodo,
    notSuccUpdateTodo: notSuccUpdateTodo,
    deleteTodo: deleteTodo,
    getCountInfoTodoLatebyID: getCountInfoTodoLatebyID,
    getCountInfoTodoDaybyID: getCountInfoTodoDaybyID
}