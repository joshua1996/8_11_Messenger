var groupid = "";
$(document).ready(function () {
    sessionStorage.setItem('hello', 'friend');
    if (localStorage.getItem('groupid') != null) {
        console.log('got userid');
        initPage();
        initConnect();
    }
});

function storeUserID(userid) {
    localStorage.setItem('userid', userid);
}

var initConnect = function () {
    //if (localStorage.getItem('userid') == null) {
    //   localStorage.setItem('userid', Math.floor(Math.random() * 1000));
    //} else {

    //}
    $('#messages').append('<div class="system text "><span class="hidden_text">系統訊息：</span>找個人聊天...' + localStorage.getItem('userid') + '</div>');

    var chat = $.connection.chatHub;
    var b = "gg";
    console.log('ddd');
    chat.client.addNewMessageToPage = function (name, message, dateNow) { //添加信息
        console.log('send');
        var timenow = new Date();
        if (b != "@DateTime.Now.Date") {
            $('#messages').append('<div class="system text timediff">今日 (' + (timenow.getMonth() + 1) + '月' + timenow.getDate() + '日)</div>');
            b = "@DateTime.Now.Date";
        }
        if (name == localStorage.getItem('userid')) {
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

    chat.client.onConnected = function (groupID) { //找对象
        console.log("connect");
        localStorage.setItem('groupid', groupID);
        $('#messages').append(' <div class="system text "><span class="hidden_text">系統訊息：</span>加密連線完成，開始聊天囉！' + localStorage.getItem('groupid') + '</div>');

    };

    chat.client.reconnectBack = function () { //重连
        initPage();
        console.log('gg');
    };

    chat.client.disconnect = function () {
        $('#messages').append(' <div class="system text "><span class="hidden_text">系統訊息：</span>离开</div>');
    };


    $.connection.hub.start().done(function () {////////////////////////////////////////////
        registerEvents(chat);

        var sendMessage = function () { //发送信息
            var timenow = new Date();
            if (b != "@DateTime.Now.Date") {
                $('#messages').append('<div class="system text timediff">今日 (' + (timenow.getMonth() + 1) + '月' + timenow.getDate() + '日)</div>');
                b = "@DateTime.Now.Date";
            }
            var curT = timenow.getFullYear() + "-" + (timenow.getMonth() + 1) + "-" + timenow.getDate() + "T" + timenow.getHours() + ":" + timenow.getMinutes() + ":" + timenow.getSeconds() + "." + timenow.getMilliseconds();

            chat.server.send(localStorage.getItem('userid'), $('#messageInput').val(), curT, localStorage.getItem('groupid'));
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

        $("#leaveGroupBtn").click(function () { //离开
            if (localStorage.getItem('groupid') === null) {

            } else {
                chat.server.disconnect(localStorage.getItem('groupid'));
                localStorage.removeItem('groupid');
               // $('#messages').empty(); 
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