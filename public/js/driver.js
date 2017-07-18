$(document).ready(function(){
    console.log("I'm ready");
    $(".row").on("click",'a',function(){
        console.log("I'm in");
        target_tab = $(this);
        target_div_id = $(this).attr('href');
        console.log($(target_div_id).siblings());

        $(target_div_id).siblings().each(function() {
            $(this).addClass('hideTab');
            console.log(this);
        });
        $(target_div_id).removeClass('hideTab');
    });
});
