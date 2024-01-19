using ST.ERP.Helper.Hubs;
using ST.ERP.Models.DAO;
using TableDependency.SqlClient;

namespace ST.ERP.Helper.SubscribeTableDependencies
{
    public class SubscribeLeaveTableDependency : ISubscribeTableDependency
    {
        SqlTableDependency<Leave> tableDependency;
        private readonly LeavesHub leavesHub;
        private readonly IConfiguration _configuration;

        public SubscribeLeaveTableDependency( IConfiguration configuration, LeavesHub leavesHub)
        {
            _configuration = configuration;
            this.leavesHub = leavesHub;
        }

        public void SubscribeTableDependency(string connectionString)
        {
            tableDependency = new SqlTableDependency<Leave>(connectionString);
            tableDependency.OnChanged += TableDependency_OnChanged;
            tableDependency.OnError += TableDependency_OnError;
            tableDependency.Start();
        }

        private void TableDependency_OnChanged(object sender, TableDependency.SqlClient.Base.EventArgs.RecordChangedEventArgs<Leave> e)
        {
            if (e.ChangeType is not TableDependency.SqlClient.Base.Enums.ChangeType.None)
            {
                this.leavesHub.SendNotification(e);
            }
        }

        private void TableDependency_OnError(object sender, TableDependency.SqlClient.Base.EventArgs.ErrorEventArgs e)
        {
            Console.WriteLine($"{nameof(Leave)} SqlTableDependency error: {e.Error.Message}");
        }
    }
}
