var isTalk = false;
var newHeight;

$(document).ready(function () {
    $("div[style='opacity: 0.9; z-index: 2147483647; position: fixed; left: 0px; bottom: 0px; height: 65px; right: 0px; display: block; width: 100%; background-color: #202020; margin: 0px; padding: 0px;']").remove();
    $("div[style='margin: 0px; padding: 0px; left: 0px; width: 100%; height: 65px; right: 0px; bottom: 0px; display: block; position: fixed; z-index: 2147483647; opacity: 0.9; background-color: rgb(32, 32, 32);']").remove();
    $("div[onmouseover='S_ssac();']").remove();
    $("center").remove();
    $("div[style='height: 65px;']").remove();
    /////

    newHeight = $("#main").height() - 50;
    $("#startButton").unbind().click(function () {
        $('#startButton').prop('disabled', true);
        initPage();
        initConnect();
    });

   

    $("#leaveGroupBtn").unbind().click(function () {

        isTalk = false;
        $('#main').animate({
            scrollTop: 0,
            height: '100%'
        }, 500, function () {
            $('#messages').empty();
            $('#messages').css('cssText', 'display:none !important');
            $('#startButton').prop('disabled', false);
            stopHub();
        });
        $('#startButton').fadeIn("slow", function () {
            $('#startButton').css('cssText', 'display:block;');
            $('#startButton').css('cssText', 'opacity:1;');
        });
    });

    $(window).resize(function () {
     //   $(".bg-image").height($(window).height());
        $(".bg-image").css('min-height', '454px');
        if (isTalk == true) {
            // $("#main").css('height', '100%').css('height', '-=50px');
            $("#main").css('height', 'calc(100% - 50px)');
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
    $('#main').animate({ scrollTop: $(document).height() + $(window).height() }, 500);
    var timenow = new Date();
    // $('#messages').append('<div class="system text timediff">今日 (' + (timenow.getMonth() + 1) + '月' + timenow.getDate() + '日)</div>');
    //  $('#messages').append('<div class="stranger text " mid="0"><span class="hidden_text">陌生人：</span>恭喜抽到男生一枚🎉🎉<div class="stranger comment"><span class="hidden_text"> (</span><div class="mobile" style="display: block;">App</div><time class="timeago" datetime="2016-11-10T05:03:29.854Z">5分前</time><span class="hidden_text">)<br></span></div></div>');

};
