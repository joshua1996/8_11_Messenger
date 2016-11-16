using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace _8_11_Messenger.Hubs
{
    public class userDetails
    {
        public string userID { get; set; }
        public string  connectionID { get; set; }
        public bool wantChat { get; set; }
    }
}