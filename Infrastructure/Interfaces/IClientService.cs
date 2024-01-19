using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    /// <summary>
    /// Interface for ClientService
    /// </summary>
    public interface IClientService
    {
        Task<ClientResponse> UpdateClient(ClientRequest request);
        Task<ClientResponse> DeleteClient(Guid Id);
        Task<ClientResponse> GetClientById(Guid Id);
        Task<List<ClientResponseData>> GetClients(CustomDepartmentFilterRequest request);
        Task<ClientResponse> ImportClientListFile(ImportClientRequest model);
        Task<ClientsSampleExcelResponse> DownloadClientSampleExcel();
    }
}
