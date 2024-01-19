using Microsoft.AspNetCore.SignalR;
using ST.ERP.Models.DAO;

namespace ST.ERP.Helper.Hubs
{
    public class LeavesHub : Hub
    {
        private readonly IHubContext<LeavesHub> _context;
        public LeavesHub(IHubContext<LeavesHub> context)
        {
            _context = context;
        }

        public async Task SendNotification(TableDependency.SqlClient.Base.EventArgs.RecordChangedEventArgs<Leave> e)
        {
            switch (e.ChangeType)
            {
                case TableDependency.SqlClient.Base.Enums.ChangeType.None:
                    break;
                case TableDependency.SqlClient.Base.Enums.ChangeType.Delete:
                    break;
                case TableDependency.SqlClient.Base.Enums.ChangeType.Insert:
                    await _context.Clients.All.SendAsync("leavesNotificationSection", e.Entity);
                    break;
                case TableDependency.SqlClient.Base.Enums.ChangeType.Update:
                    break;
                default:
                    break;
            }
        }
    }
}
