// Thêm sự kiện "change" cho thẻ select
function bindEventListUser() {
  fillerUserAStatus();
  function fillerUserAStatus() {
    var selectedUser = $("#list-users").length > 0 ? $("#list-users").val() : "0";
    var selectedChecked = $("#list-checked").val();
    var listURLbyUserName = document.getElementsByClassName('name-user-list-url');

    if (listURLbyUserName.length > 0) {
      for (var i = 0; i < listURLbyUserName.length; i++) {
        var UserId = listURLbyUserName[i].getAttribute('user-id');
        var StatusId = listURLbyUserName[i].getAttribute('status-id');

        var conditionUser = (selectedUser == "0" || UserId == selectedUser);
        var conditionStatus = (selectedChecked == "" || StatusId == selectedChecked);

        var trElement = listURLbyUserName[i].closest('tr');

        if (conditionUser && conditionStatus) {
          applyAnimation(trElement, 'fadeIn');
        } else {
          applyAnimation(trElement, 'fadeOut');
        }
      }
    } else {
      console.log('Mảng không tồn tại hoặc không có phần tử.');
    }
  }

  function applyAnimation(element, animationName) {
    if (element) {
      // Kiểm tra xem lớp fadeIn hoặc fadeOut đã tồn tại trên phần tử hay không
      if (element.classList.contains('fadeIn') || element.classList.contains('fadeOut')) {
        // Nếu tồn tại, loại bỏ cả hai lớp trước khi thêm lớp mới
        element.classList.remove('fadeIn', 'fadeOut');
      }

      // Thêm lớp mới tùy thuộc vào animationName
      element.classList.add(animationName);
    }
  }


  if ($("#list-users").length > 0) {
    $("#list-users").change(function () {
      fillerUserAStatus();
    });
  }

  $("#list-checked").change(function () {
    fillerUserAStatus();
  });
};
// function bindEventStatusURL(){
//   $("#list-checked").change(function() {
//     var selectedValue = $(this).val();

//     console.log(selectedValue);
//   });
// };
$(document).ready(function () {
  new bindEventListUser();
});
