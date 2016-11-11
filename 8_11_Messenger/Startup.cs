using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(_8_11_Messenger.Startup))]
namespace _8_11_Messenger
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //  ConfigureAuth(app);
            app.MapSignalR();
        }
    }
}
