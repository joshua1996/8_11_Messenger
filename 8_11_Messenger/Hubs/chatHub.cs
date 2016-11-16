using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Diagnostics;
using System.Web.SessionState;

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
            return "thisisid";
        }


        public void send(string name, string message, string dateNow, string groupid)
        {
            Debug.WriteLine(groupid);
            Clients.Group(groupid).addNewMessageToPage(name, message, dateNow);
            Debug.WriteLine(groupid + "A");
        }

        public void sendTimeAgo(string time)
        {
            Clients.All.changeTimeAgo(time);
        }

        public void connect(string userid)
        {
            var context = HttpContext.Current;
            context.Response.Cookies.Add(new HttpCookie("useruser") { Value = "aa" });


            userDetails toUserID = new userDetails();
            var id = Context.ConnectionId;
            if (connectedUser.Count(x => x.connectionID == id) == 0)
            {
                connectedUser.Add(new userDetails { connectionID = id, userID = userid, wantChat = true });
            }
            userDetails currentUser = connectedUser.Where(u => u.connectionID == id).FirstOrDefault();
            if (connectedUser.Count > 1)
            {
                Random r = new Random();
                string groupID = r.Next(0, 10000).ToString();
                toUserID = connectedUser[r.Next(0, connectedUser.Count - 1)];//r.Next(0, connectedUser.Count - 1);
                Groups.Add(currentUser.connectionID, groupID);
                Groups.Add(toUserID.connectionID, groupID);
                currentUser.wantChat = false;
                toUserID.wantChat = false;
                Debug.WriteLine(Context.User.Identity.Name);
                //   Clients.Group(groupID).onConnected(groupID, currentUser.connectionID, toUserID.connectionID);
                Clients.User(GetSignalrID()).onConnected(groupID, currentUser.connectionID, toUserID.connectionID);
            }
        }

        public void reconnect(string groupid, string currentUserID, string toUserID)
        {
            Debug.WriteLine(Context.User.Identity.Name);
            Groups.Add(currentUserID, groupid);
            Groups.Add(toUserID, groupid);
            Clients.Caller.onConnected(groupid, currentUserID, toUserID);
        }

        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            //var item = connectedUser.FirstOrDefault(x => x.connectionID == Context.ConnectionId);
            //if (item != null)
            //{
            //    connectedUser.Remove(item);
            //    if (connectedUser.Where(u => u.userID == item.userID).Count() == 0)
            //    {
            //        var id = item.userID;
            //        //  Clients.All.onUserDisconnected(id, item.userID);
            //    }
            //}
            return base.OnDisconnected(stopCalled);
        }

        public string GetUserId(IRequest request)
        {
            return "thisisid";
        }
    }
}

