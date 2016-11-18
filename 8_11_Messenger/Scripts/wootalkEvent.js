var isTalk = false;
var newHeight;

$(document).ready(function () {
    newHeight = $("#main").height() - 50
    $("#startButton").click(function () {
        initPage();
        initConnect();
    });

    $("#leaveGroupBtn").click(function () {
     
    });

    $(window).resize(function () {
        $(".bg-image").height($(window).height());
        $(".bg-image").css('min-height', '454px');
        if (isTalk == true) {
            $("#main").css('height', '100%').css('height', '-=50px');
        }
    });
});

var initPage = function () {
    isTalk = true;
    $('#startButton').fadeTo("slow", 0, function () {
        $('#startButton').css('cssText', 'display:none;');
    });
    $('#main').animate({
        height: newHeight
    }, 500);
    $("#sendBox").css('cssText', 'display: block !important;');
    $('#messages').css('cssText', 'display: block !important;');
    $('#main').animate({ scrollTop: 9999 }, 'slow');
    var timenow = new Date();
    // $('#messages').append('<div class="system text timediff">今日 (' + (timenow.getMonth() + 1) + '月' + timenow.getDate() + '日)</div>');
    //  $('#messages').append('<div class="stranger text " mid="0"><span class="hidden_text">陌生人：</span>恭喜抽到男生一枚🎉🎉<div class="stranger comment"><span class="hidden_text"> (</span><div class="mobile" style="display: block;">App</div><time class="timeago" datetime="2016-11-10T05:03:29.854Z">5分前</time><span class="hidden_text">)<br></span></div></div>');

};
