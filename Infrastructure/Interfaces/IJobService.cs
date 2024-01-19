using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    public interface IJobService
    {
        Task<BidRecordResponse> CreateJob(BidRequest request);
        Task<BidRecordResponse> DeleteJob(Guid Id);
        Task<BidRecordResponse> GetJobById(Guid Id);
        Task<List<BidResponse>> GetAllJobs(CustomDepartmentFilterRequest request);
        Task<List<BidReportResponse>> GetJobCalculations();
        Task<List<BidResponse>> GetJobsByDepartmentId(Guid? departmentId);
    }
}
