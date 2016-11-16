var groupid = "";
$(document).ready(function () {
    sessionStorage.setItem('hello', 'friend');
    if ($.session.get('groupid') != null) {
        console.log('got userid');
        initPage();
        initConnect();
    }
});

var initConnect = function () {
    if ($.session.get('userid') == null) {
        $.session.set('userid', Math.floor(Math.random() * 1000));
    } else {

    }
    $('#messages').append('<div class="system text "><span class="hidden_text">系統訊息：</span>找個人聊天...' + $.session.get('userid') + '</div>');

    var chat = $.connection.chatHub;

    var b = "gg";

    chat.client.addNewMessageToPage = function (name, message, dateNow) { //添加信息
        console.log('send');
        if (name == $.session.get('userid')) {
            $('#messages').append('<div class="me text" id="msgqkhgrosvr" mid="1"><span class="hidden_text">' + name + '：</span>' + message + '<div class="me comment"><span class="read" style="display: inline;">已送達<br></span><span class="hidden_text"> (</span><time class="timeago" datetime="' + dateNow + '">刚刚</time><span class="hidden_text">)<br></span></div></div>');
        } else {
            $('#messages').append('<div class="stranger text " mid="0"><span class="hidden_text">' + name + '：</span>' + message + '<div class="stranger comment"><span class="hidden_text"> (</span><div class="mobile" style="display: block;">App</div><time class="timeago" datetime="' + dateNow + '">刚刚</time><span class="hidden_text">)<br></span></div></div>');
        }
    };

    chat.client.changeTimeAgo = function (time) { //信息时间 前
        $('.timeago').each(function (index) {
            $(this).html(jQuery.timeago($(this).attr('datetime')));
        })
    };

    chat.client.onConnected = function (groupID, currentUserID, toUserID) { //找对象
        $.session.set('groupid', groupID);
        $.session.set('currentUserID', currentUserID);
        $.session.set('toUserID', toUserID);
        $('#messages').append(' <div class="system text "><span class="hidden_text">系統訊息：</span>加密連線完成，開始聊天囉！' + $.session.get('groupid') + '</div>');

    };

    chat.client.reconnectBack = function () {
        initPage();
        console.log('gg');
    }

    $('#displayName').val($.session.get('userid'));

    $.connection.hub.start().done(function () {////////////////////////////////////////////
        registerEvents(chat);

        var sendMessage = function () { //发送信息
            var timenow = new Date();
            if (b != "@DateTime.Now.Date") {
                $('#messages').append('<div class="system text timediff">今日 (' + (timenow.getMonth() + 1) + '月' + timenow.getDate() + '日)</div>');
                b = "@DateTime.Now.Date";
            }
            var curT = timenow.getFullYear() + "-" + (timenow.getMonth() + 1) + "-" + timenow.getDate() + "T" + timenow.getHours() + ":" + timenow.getMinutes() + ":" + timenow.getSeconds() + "." + timenow.getMilliseconds();

            console.log($.session.get('groupid') + " " + " b");
            chat.server.send($.session.get('userid'), $('#messageInput').val(), curT, $.session.get('groupid'));
            $('#main').animate({ scrollTop: 9999 }, 'slow');
            $('#messageInput').val('');
        };

        $('#messageInput').keypress(function (e) { //enter 发送信息
            if (e.which == 13) {
                sendMessage();
            }
        })
        $('#sendMessageBtn').click(sendMessage); //点击发送 发送信息
        setInterval(function () {
            chat.server.sendTimeAgo('a');
        }, 10000);

    });
}
function registerEvents(chat) {
    var userid = $.session.get('userid');
    if ($.session.get('groupid') == null) {
        chat.server.connect(userid);
    } else {
        chat.server.reconnect($.session.get('groupid'), $.session.get('currentUserID'), $.session.get('toUserID'));
    }

}