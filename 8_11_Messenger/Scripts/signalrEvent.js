var groupid = "";
var messageUnreadCount = 0;
var dialogLstGlobal;
$(document).ready(function () {

    $('#textBox').unbind().click(function () {
        document.title = 'Echo';
        messageUnreadCount = 0;
    });

    sessionStorage.setItem('hello', 'friend');

    if (localStorage.getItem('groupid') != null) {
        console.log('got userid');
        initPage();
        initConnect();
    }

    setInterval(function () { //更新时间
        updateTimeAgp();
    }, 10000);

    $(document).on('click', '.loadMoreButton', function () { //加载之前对话
        console.log('load');
        var mid = $('.loadMoreButton').next().attr('mid');
        if ((mid - 7) < 0) {
            for (var i = mid - 2; i > mid - 7 && i >= 0; i--) {
                if (dialogLstGlobal[i].userid == localStorage.getItem('userid')) { //我方 <span class="read" style="display: inline;">发送中<br></span>
                    console.log(dialogLstGlobal[0].userid);
                    $('.loadMoreButton').after('<div class="me text" id="msgqkhgrosvr" mid="' + dialogLstGlobal[i].dialogid + '"><span class="hidden_text">' + dialogLstGlobal[i].userid + '：</span>' + dialogLstGlobal[i].dialog + '<div class="me comment"><span class="hidden_text"> (</span><time class="timeago" datetime="' + dialogLstGlobal[i].chatTime + '">刚刚</time><span class="hidden_text">)<br></span></div></div>');
                } else { //对方
                    $('.loadMoreButton').after('<div class="stranger text " mid="' + dialogLstGlobal[i].dialogid + '"> <div class="profile"><img src="/mm.jpg" alt=""></div><span class="hidden_text">' + dialogLstGlobal[i].userid + '：</span>' + dialogLstGlobal[i].dialog + '<div class="stranger comment"><span class="hidden_text"> (</span><div class="mobile" style="display: block;">Web</div><time class="timeago" datetime="' + dialogLstGlobal[i].chatTime + '">刚刚</time><span class="hidden_text">)<br></span></div></div>');
                }
            }


            $('.loadMoreButton').remove();
        } else {
            $('.loadMoreButton input').attr('value', '載入之前訊息 (' + (mid - 6) + '則)');
            for (var i = mid - 2; i > mid - 7; i--) {
                if (dialogLstGlobal[i].userid == localStorage.getItem('userid')) { //我方 <span class="read" style="display: inline;">发送中<br></span>
                    $('.loadMoreButton').after('<div class="me text" id="msgqkhgrosvr" mid="' + dialogLstGlobal[i].dialogid + '"><span class="hidden_text">' + dialogLstGlobal[i].userid + '：</span>' + dialogLstGlobal[i].dialog + '<div class="me comment"><span class="hidden_text"> (</span><time class="timeago" datetime="' + dialogLstGlobal[i].chatTime + '">刚刚</time><span class="hidden_text">)<br></span></div></div>');
                } else { //对方
                    $('.loadMoreButton').after('<div class="stranger text " mid="' + dialogLstGlobal[i].dialogid + '"> <div class="profile"><img src="/mm.jpg" alt=""></div><span class="hidden_text">' + dialogLstGlobal[i].userid + '：</span>' + dialogLstGlobal[i].dialog + '<div class="stranger comment"><span class="hidden_text"> (</span><div class="mobile" style="display: block;">Web</div><time class="timeago" datetime="' + dialogLstGlobal[i].chatTime + '">刚刚</time><span class="hidden_text">)<br></span></div></div>');
                }
            }
        }
        $('#main').animate({
            scrollTop: $(document).height() + $(window).height()
        }, 'slow');
        updateTimeAgp();
    });
});

function storeUserID(userid) {
    localStorage.setItem('userid', userid);
}

function stopHub() {
    $.connection.hub.stop();
}

function updateTimeAgp() {
    $('.timeago').each(function (index) {
        $(this).html(jQuery.timeago($(this).attr('datetime')));
    });
}


var initConnect = function () {
    $('#messages').append('<div class="system text "><span class="hidden_text">系統訊息：</span>找個人聊天...' + localStorage.getItem('userid') + '</div>');

    var chat = $.connection.chatHub;
    var b = "gg";

    chat.client.addNewMessageToPage = function (name, message, dateNow) { //添加对话
        message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");;

        console.log('send');
        var timenow = new Date();
        if (b != "@DateTime.Now.Date") {
            $('#messages').append('<div class="system text timediff">今日 (' + (timenow.getMonth() + 1) + '月' + timenow.getDate() + '日)</div>');
            b = "@DateTime.Now.Date";
        }
        console.log(dateNow);
        var isSeen = false;
        if (name == localStorage.getItem('userid')) { //我方
            $('.read').text('已发送'); //

        } else { //对方
            chat.server.isSeen(localStorage.getItem('userid'), localStorage.getItem('groupid'));
            messageUnreadCount += 1;
            $('#popSound').get(0).play();
            document.title = 'Echo (' + messageUnreadCount + ')';
            var title = document.title;
            $('html').scrollTop();
            $('#messages').append('<div class="stranger text " mid="0"> <div class="profile"><img src="/mm.jpg" alt=""></div><span class="hidden_text">' + name + '：</span>' + message + '<div class="stranger comment"><span class="hidden_text"> (</span><div class="mobile" style="display: block;">Web</div><time class="timeago" datetime="' + dateNow + '">刚刚</time><span class="hidden_text">)<br></span></div></div>');
            $('#main').animate({
                scrollTop: $(document).height() + $(window).height()
            }, 'slow');
            isSeen = true;
        }
    };

    chat.client.isSend = function () {  //对方已经收到信息
        $('.read').text('已送达');
    };

    chat.client.changeTimeAgo = function (time) { //信息时间 前
        //$('.timeago').each(function (index) {
        //    $(this).html(jQuery.timeago($(this).attr('datetime')));
        //})
    };

    chat.client.onConnected = function (groupID) { //找对象
        console.log("connect");
        localStorage.setItem('groupid', groupID);
        $('#messages').append(' <div class="system text "><span class="hidden_text">系統訊息：</span>加密連線完成，開始聊天囉！' + localStorage.getItem('groupid') + '</div>');
        $('#main').animate({ scrollTop: $(document).height() + $(window).height() }, 'slow');
        console.log("coo");
    };

    chat.client.reconnectBack = function (groupID, dialogLst) { //重连
        dialogLstGlobal = dialogLst;
        var sendCome = false;
        $('#messages').append(' <div class="system text "><span class="hidden_text">系統訊息：</span>加密連線完成，開始聊天囉！' + localStorage.getItem('groupid') + '</div>');
        if (dialogLst.length > 5) {
            $('#messages').append('<div class="loadMoreButton" style="display: block;"><input type="button" value="載入之前訊息 (' + (dialogLst.length - 5) + '則)" ></div>');
            for (var i = dialogLst.length - 1; i > dialogLst.length - 6; i--) {
                if (dialogLst[i].userid == localStorage.getItem('userid')) { //我方 <span class="read" style="display: inline;">发送中<br></span>
                    $('.loadMoreButton').after('<div class="me text" id="msgqkhgrosvr" mid="' + dialogLst[i].dialogid + '"><span class="hidden_text">' + dialogLst[i].userid + '：</span>' + dialogLst[i].dialog + '<div class="me comment"><span class="hidden_text"> (</span><time class="timeago" datetime="' + dialogLst[i].chatTime + '">刚刚</time><span class="hidden_text">)<br></span></div></div>');

                } else { //对方
                    $('.loadMoreButton').after('<div class="stranger text " mid="' + dialogLst[i].dialogid + '"> <div class="profile"><img src="/mm.jpg" alt=""></div><span class="hidden_text">' + dialogLst[i].userid + '：</span>' + dialogLst[i].dialog + '<div class="stranger comment"><span class="hidden_text"> (</span><div class="mobile" style="display: block;">Web</div><time class="timeago" datetime="' + dialogLst[i].chatTime + '">刚刚</time><span class="hidden_text">)<br></span></div></div>');
                }
            }
        } else {
            for (var i = 0; i < dialogLst.length; i++) {
                if (dialogLst[i].userid == localStorage.getItem('userid')) { //我方 <span class="read" style="display: inline;">发送中<br></span>
                    $('#messages').append('<div class="me text" id="msgqkhgrosvr" mid="' + dialogLst[i].dialogid + '"><span class="hidden_text">' + dialogLst[i].userid + '：</span>' + dialogLst[i].dialog + '<div class="me comment"><span class="hidden_text"> (</span><time class="timeago" datetime="' + dialogLst[i].chatTime + '">刚刚</time><span class="hidden_text">)<br></span></div></div>');
                } else { //对方
                    $('#messages').append('<div class="stranger text " mid="' + dialogLst[i].dialogid + '"> <div class="profile"><img src="/mm.jpg" alt=""></div><span class="hidden_text">' + dialogLst[i].userid + '：</span>' + dialogLst[i].dialog + '<div class="stranger comment"><span class="hidden_text"> (</span><div class="mobile" style="display: block;">Web</div><time class="timeago" datetime="' + dialogLst[i].chatTime + '">刚刚</time><span class="hidden_text">)<br></span></div></div>');
                }
            }
        }
        if (dialogLst[dialogLst.length - 1].seen == true) {
            $('.me.comment').last().prepend('<span class="read" style="display: inline;">已送达</span><br>');
        } else {
            $('.me.comment').last().prepend('<span class="read" style="display: inline;">已发送</span><br>');
        }
        $('#main').animate({
            scrollTop: $(document).height() + $(window).height()
        }, 'slow');
        chat.server.isSeen(localStorage.getItem('userid'), localStorage.getItem('groupid'));

        updateTimeAgp();
    };

    chat.client.disconnect = function () {
        $('#messages').append(' <div class="system text "><span class="hidden_text">系統訊息：</span>离开</div>');
        localStorage.removeItem('groupid');
    };


    $.connection.hub.start().done(function () {////////////////////////////////////////////

        registerEvents(chat);
        console.log("again");
        var sendMessage = function () { //发送信息
            if (localStorage.getItem('groupid') !== null) {
                var timenow = new Date();
                if (b != "@DateTime.Now.Date") {
                    $('#messages').append('<div class="system text timediff">今日 (' + (timenow.getMonth() + 1) + '月' + timenow.getDate() + '日)</div>');
                    b = "@DateTime.Now.Date";
                }
                var curT = new Date();
                curT = curT.toISOString();
                $('.read').remove();
                $('#messages').append('<div class="me text" id="msgqkhgrosvr" mid="1"><span class="hidden_text">' + localStorage.getItem('userid') + '：</span>' + $('#messageInput').val() + '<div class="me comment"><span class="read" style="display: inline;">发送中</span><br><span class="hidden_text"> (</span><time class="timeago" datetime="' + curT + '">刚刚</time><span class="hidden_text">)<br></span></div></div>');
                chat.server.send(localStorage.getItem('userid'), $('#messageInput').val(), curT, localStorage.getItem('groupid'));
                $('#main').animate({ scrollTop: $(document).height() + $(window).height() }, 'slow');
                $('#messageInput').val('');
            }
        };

        //$('.emojionearea.emojionearea-inline.focused').unbind().keypress(function (e) { //enter 发送信息
        //    if (e.which == 13) {
        //        console.log("again2");
        //        sendMessage();
        //    }
        //})

        $('.emojionearea').on('keydown', function (e) {
            if (e.which == 13) {
               // $('.emojionearea').removeClass('focused');
                console.log($('#messageInput').val());
            }
        });

        $('#sendMessageBtn').unbind().click(sendMessage); //点击发送 发送信息



        $("#leaveGroupBtn").click(function () { //离开
            if (localStorage.getItem('groupid') === null) {

            } else {
                chat.server.disconnect(localStorage.getItem('groupid'));
                localStorage.removeItem('groupid');
            }
        });
    });
}
function registerEvents(chat) {
    if (localStorage.getItem('groupid') == null) {
        chat.server.connect(localStorage.getItem('userid'));
    } else {
        chat.server.reconnect(localStorage.getItem('groupid'), localStorage.getItem('userid'));
    }

}