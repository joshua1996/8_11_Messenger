﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Diagnostics;

namespace _8_11_Messenger.Hubs
{
    public class MyConnection1 : PersistentConnection
    {
        protected override Task OnConnected(IRequest request, string connectionId)
        {
            Debug.WriteLine("welcome");
            return Connection.Send(connectionId, "Welcome!");
        }

        protected override Task OnReceived(IRequest request, string connectionId, string data)
        {
            return Connection.Broadcast(data);
        }

        protected override Task OnDisconnected(IRequest request, string connectionId,bool data)
        {
            Debug.WriteLine("welcome");
            return Connection.Broadcast(connectionId);
        }
    }
}