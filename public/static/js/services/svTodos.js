var app = angular.module("app.todos");

app.factory("svTodos", ["$http", function ($http) {
    return {
        get: function () {
            return $http.get("/todos/nodetodo")
        },
        create: function (todoData) {
            return $http.post("/todos/nodetodo", todoData);
        },
        update: function (todoData) {
            return $http.put("/todos/nodetodo", todoData);
        },
        updateFn: function (todoData) {
            return $http.put("/todos/nodetodofn", todoData);
        },
        delete: function (id) {
            return $http.put("/todos/nodetododel", id);
        },
        getchat: function (id_user) {
            return $http.post("/todos/getchat", id_user);
        },
        // token: function () {
        //     return $http.post("/token");
        // }

    };
}]);