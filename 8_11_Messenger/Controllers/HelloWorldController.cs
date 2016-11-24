using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using _8_11_Messenger.Models;

namespace _8_11_Messenger.Controllers
{
    public class HelloWorldController : Controller
    {
        // GET: HelloWorld
        public ActionResult Index()
        {
            Random rn = new Random();
            if (System.Web.HttpContext.Current.Request.Cookies["userid"] == null)
            {
                System.Web.HttpContext.Current.Response.Cookies.Add(new HttpCookie("userid") { Value = rn.Next(0, 1000).ToString() });

            }
            ViewBag.userid = System.Web.HttpContext.Current.Request.Cookies["userid"].Value;
            return View();
        }
        public string Welcome()
        {
            return "this is welcome";
        }
    }
}