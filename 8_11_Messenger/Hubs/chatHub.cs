using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Diagnostics;
using System.Web.SessionState;
using System.Threading.Tasks;

namespace _8_11_Messenger.Hubs
{
    public class chatHub : Hub, System.Web.SessionState.IRequiresSessionState
    {
        static List<userDetails> connectedUser = new List<userDetails>();

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
            Clients.Group(groupid).addNewMessageToPage(name, message, dateNow);
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
            Clients.Caller.onConnected(groupid);
        }

        public void disconnect(string groupid)
        {
            Debug.WriteLine("quit");
            Groups.Remove(Context.ConnectionId, groupid);
            Clients.Group(groupid).disconnect();
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
    }
}

