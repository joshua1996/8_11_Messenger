using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace _8_11_Messenger.Hubs
{
    public class chatHub : Hub
    {
        public void Hello()
        {
            Clients.All.hello();
        }
        //
        public void Send(string name,string message,string dateNow)
        {
            Clients.All.addNewMessageToPage(name, message,dateNow);
            
        }

        public void sendTimeAgo(string time)
        {
            Clients.All.changeTimeAgo(time);
        }

        public void connect(string userid)
        {

        }
    }
}