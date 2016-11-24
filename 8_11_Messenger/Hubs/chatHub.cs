using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Diagnostics;
using System.Web.SessionState;
using System.Threading.Tasks;
using System.Net;
using System.Net.Cache;
using System.IO;
using System.Text.RegularExpressions;
using _8_11_Messenger.Models;

namespace _8_11_Messenger.Hubs
{
    public class chatHub : Hub, System.Web.SessionState.IRequiresSessionState
    {
        static List<userDetails> connectedUser = new List<userDetails>();
        echotalkEntities chatdt = new echotalkEntities();

        public void Hello()
        {
            
            Clients.All.hello();

        }

        public string GetSignalrID()
        {
            if (Context.Request.GetHttpContext().Request.Cookies["userid"] != null)
            {
                return Context.Request.GetHttpContext().Request.Cookies["userid"].Value;
            }
            return "";
        }


        public void send(string name, string message, string dateNow, string groupid)
        {
            string currentDate = GetNistTime().ToString("o");
            int dialogid = chatdt.chats.Where(x => x.roomid == groupid).Count();
            chat chats = new chat() { userid = name, dialog = message, chatTime = currentDate, roomid = groupid, seen = false, ID = 0, dialogid = dialogid + 1 };
            chatdt.chats.Add(chats);
            chatdt.SaveChanges();
            Debug.WriteLine(currentDate);
            Clients.Group(groupid).addNewMessageToPage(name, message, currentDate);
        }

        public void sendTimeAgo(string time)
        {
            Clients.All.changeTimeAgo(time);
        }

        public async Task connect(string userid)
        {
            Debug.WriteLine(GetSignalrID());
            userDetails toUserID = new userDetails();
            var id = Context.ConnectionId;
            Debug.WriteLine(connectedUser.Count);
            if (connectedUser.Count(x => x.connectionID == id) == 0)
            {
                connectedUser.Add(new userDetails { connectionID = id, userID = userid, wantChat = true, groupID = "" });
            }

            userDetails currentUser = connectedUser.Where(u => u.connectionID == id).FirstOrDefault();
            Debug.WriteLine(connectedUser.Where(x => x.groupID == "").Count());
            if (connectedUser.Where(x => x.groupID == "").Count() > 1)
            {
                Random r = new Random();
                string groupID = r.Next(0, 10000).ToString();
                int findTalk = r.Next(0, connectedUser.Where(x => x.groupID == "").Where(x => x.userID != currentUser.userID).Count());
                toUserID = connectedUser.Where(x => x.groupID == "").Where(x => x.userID != currentUser.userID).ElementAt(findTalk);//[r.Next(0, connectedUser.Count - 1)];
                connectedUser.Where(x => x.groupID == "").Where(x => x.userID != currentUser.userID).ElementAt(findTalk).groupID = groupID;
                connectedUser.Where(x => x.connectionID == id).FirstOrDefault().groupID = groupID;


                await Groups.Add(currentUser.connectionID, groupID);
                await Groups.Add(toUserID.connectionID, groupID);
                Clients.Group(groupID).onConnected(groupID);
                Debug.WriteLine(connectedUser.Where(x => x.groupID == groupID).Count());
                // Clients.User(GetSignalrID()).onConnected(groupID, currentUser.connectionID, toUserID.connectionID);
            }
        }

        public void isSeen(string userid, string groupid)
        {
            // List<chat> dialogLst = chatdt.chats.Where(x => x.userid != userid).ToList();
            foreach (var item in chatdt.chats.Where(x => x.userid != userid))
            {
                item.seen = true;
            }
            chatdt.SaveChanges();
            Clients.OthersInGroup(groupid).isSend();
        }

        public void reconnect(string groupid, string userid)
        {
            var id = Context.ConnectionId;
            if (connectedUser.Count(x => x.connectionID == id) == 0)
            {
                connectedUser.Add(new userDetails { connectionID = id, userID = userid, wantChat = true, groupID = groupid });
            }
            if (groupid != null)
            {
                Groups.Add(Context.ConnectionId, groupid);
            }
            List<chat> dialogLst = chatdt.chats.Where(x => x.roomid == groupid).ToList();
            Clients.Caller.reconnectBack(groupid, dialogLst);
        }

        public void disconnect(string groupid)
        {
            Debug.WriteLine("quit");
            Groups.Remove(Context.ConnectionId, groupid);
            Clients.Group(groupid).disconnect();
            var item = connectedUser.FirstOrDefault(x => x.connectionID == Context.ConnectionId);
            if (item != null)
            {
                connectedUser.Remove(item);
                if (connectedUser.Where(u => u.userID == item.userID).Count() == 0)
                {
                    var id = item.userID;
                    //  Clients.All.onUserDisconnected(id, item.userID);
                }
            }
        }


        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            Debug.WriteLine("dc");
            var item = connectedUser.FirstOrDefault(x => x.connectionID == Context.ConnectionId);

            if (item != null)
            {
                connectedUser.Remove(item);
                if (connectedUser.Where(u => u.userID == item.userID).Count() == 0)
                {
                    var id = item.userID;
                    //  Clients.All.onUserDisconnected(id, item.userID);
                }
            }

            return base.OnDisconnected(stopCalled);
        }

        public override Task OnConnected()
        {
            return base.OnConnected();
        }

        public string GetUserId(IRequest request)
        {
            return "thisisid";
        }

        public static DateTime GetNistTime()
        {
            DateTime dateTime = DateTime.MinValue;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://nist.time.gov/actualtime.cgi?lzbc=siqm9b");
            request.Method = "GET";
            request.Accept = "text/html, application/xhtml+xml, */*";
            request.UserAgent = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)";
            request.ContentType = "application/x-www-form-urlencoded";
            request.CachePolicy = new RequestCachePolicy(RequestCacheLevel.NoCacheNoStore); //No caching
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            if (response.StatusCode == HttpStatusCode.OK)
            {
                StreamReader stream = new StreamReader(response.GetResponseStream());
                string html = stream.ReadToEnd();//<timestamp time=\"1395772696469995\" delay=\"1395772696469995\"/>
                string time = Regex.Match(html, @"(?<=\btime="")[^""]*").Value;
                double milliseconds = Convert.ToInt64(time) / 1000.0;
                dateTime = new DateTime(1970, 1, 1).AddMilliseconds(milliseconds).ToLocalTime();
            }

            return dateTime;
        }
    }
}

