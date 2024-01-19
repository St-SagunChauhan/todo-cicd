using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ST.ERP.Helper;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DTO;

namespace ST.ERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobController : ControllerBase
    {
        private readonly IJobService _JobService;
        public JobController(IJobService JobService)
        {
            _JobService = JobService;
        }

        [HttpPost]
        [Route("createJob")]
        [Consumes("application/json")]

        public async Task<IActionResult> CreateJob([FromBody] BidRequest request)
        {
            try
            {
                return Ok(await _JobService.CreateJob(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        [HttpPut]
        [Route("updateJob")]
        [Consumes("application/json")]

        public async Task<IActionResult> UpdateJob(BidRequest request)
        {
            try
            {
                return Ok(await _JobService.CreateJob(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }


        [HttpDelete()]
        [Route("deleteJob/Id")]
        [Consumes("application/json")]
        public async Task<IActionResult> DeleteJob(Guid id)
        {
            try
            {
                var result = await _JobService.DeleteJob(id);
                return Ok(result);                                                
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        [HttpPost]
        [Route("getAllJobs")]
        [Consumes("application/json")]

        public async Task<IActionResult> GetAllJobs(CustomDepartmentFilterRequest request)
        {
            try
            {
                return Ok(await _JobService.GetAllJobs(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        [HttpGet("{departmentId:guid}")]
        [Route("getJobsByDepartmentId/{departmentId}")]
        [Consumes("application/json")]
        public async Task<IActionResult> GetJobsByDepartmentId(Guid departmentId)
        {
            try
            {
                return Ok(await _JobService.GetJobsByDepartmentId(departmentId));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        [HttpGet("{Id:guid}")]
        [Route("getJobbyId/{id}")]
        [Consumes("application/json")]

        public async Task<IActionResult> GetJobbyId(Guid Id)
        {
            try
            {
                return Ok(await _JobService.GetJobById(Id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        [HttpGet]
        [Route("getJobCalculations")]
        [Consumes("application/json")]
        public async Task<IActionResult> GetJobCalculations()
        {
            try
            {
                return Ok(await _JobService.GetJobCalculations());
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
    }
}
