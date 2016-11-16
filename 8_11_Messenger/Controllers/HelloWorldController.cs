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
        public ActionResult Index()
        {
            Random rn = new Random();
            //if (Session["userid"] == null)
            //{
            //    Session["userid"] = rn.Next(0, 10000).ToString();
            //}

            //ViewBag.userid = Session["userid"];
            if (System.Web.HttpContext.Current.Request.Cookies["userid"] == null)
            {
                System.Web.HttpContext.Current.Response.Cookies.Add(new HttpCookie("userid") { Value = rn.Next(0, 1000).ToString() });
               
            }
            ViewBag.userid = System.Web.HttpContext.Current.Request.Cookies["userid"].Value;
            //HttpCookie cookie = new HttpCookie("ron");
            //if (cookie.Value == null)
            //{
            //    cookie.Value = rn.Next(0, 10000).ToString();
            //    Response.Cookies.Add(cookie);
            //}

            return View();
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