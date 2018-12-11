$(document).ready(function(){
  $('.sidenav').sidenav();
  $('select').formSelect();

  $('.modal').modal({
    dismissible: false,
    opacity: 0.5,
    inDuration: 350
  });

  $('.tabs').tabs();
});
