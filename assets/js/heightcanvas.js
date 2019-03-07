
$(window).resize(function() {
    var win = sessionStorage.getItem('width');
    if(win <= 921) {
        $('body').removeClass('desktop');
        $('body').addClass('mobile');
    } else {
        $('body').removeClass('mobile');
        $('body').addClass('desktop');
    }
})

var win = sessionStorage.getItem('width');

if(win <= 921) {
    $('body').removeClass('desktop');
    $('body').addClass('mobile');
} else {
    $('body').removeClass('mobile');
    $('body').addClass('desktop');
}

