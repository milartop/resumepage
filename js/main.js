$(document).ready(function () {
  var navLink = $('li a');

  $('.menu-burger').click(function (event) {

    $('.menu-wrap, .menu-burger').toggleClass('active');

  });
  $("li").children().click(function (event) {
    $('.menu-wrap, .menu-burger').removeClass('active');
  });


});