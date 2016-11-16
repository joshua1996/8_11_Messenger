using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace _8_11_Messenger.Hubs
{
    public class MyUserFactory : IUserIdProvider
    {
        public string GetUserId(IRequest request)
        {
            return "thisisid";
            
        }
    }
}