using Microsoft.Owin;
using Owin;
using _8_11_Messenger.Hubs;
using Microsoft.AspNet.SignalR;
using System.Web.Http;

[assembly: OwinStartupAttribute(typeof(_8_11_Messenger.Startup))]
namespace _8_11_Messenger
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //  ConfigureAuth(app);
            var userIdProvider = new MyUserFactory();
            GlobalHost.DependencyResolver.Register(typeof(IUserIdProvider), () => userIdProvider);

            var config = new HttpConfiguration();
            config.Routes.MapHttpRoute(name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new
                {
                    id = RouteParameter.Optional
                });
            System.Web.HttpContext.Current.SetSessionStateBehavior(System.Web.SessionState.SessionStateBehavior.Required);
            app.UseWebApi(config);
            app.MapSignalR();
        }
    }
}
