using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    /// <summary>
    /// Interface  for Leaves Service
    /// </summary>
    public interface ILeavesService
    {
        Task<LeaveResponse> ApplyLeaves(LeaveRequest request);
        Task<List<LeaveResponseData>> GetLeaves(CustomFilterRequest request);
        Task<LeaveResponse> GetLeaveById(Guid Id);
        Task<LeaveResponse> RemoveLeave(Guid Id);
        Task<List<LeaveResponseData>> SearchLeaves(LeaveRequest model);
        //Task<LeaveResponse> GetLeaveByEmployeeId(Guid Id);
        Task NotifyToChangeLeaveStatus();
    }
}
