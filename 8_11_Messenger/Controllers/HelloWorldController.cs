using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace _8_11_Messenger.Controllers
{
    public class HelloWorldController : Controller
    {
        // GET: HelloWorld
        public ActionResult Index(string button)
        {
            return View();
            Response.sess
        }
        
        //public string Index()
        //{
        //    return "Hi";
        //}

        public string Welcome()
        {
            return "this is welcome";
        }
    }
}