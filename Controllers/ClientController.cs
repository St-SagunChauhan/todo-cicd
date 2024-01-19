using Microsoft.AspNetCore.Mvc;
using ST.ERP.Helper;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DTO;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        #region Constructor and service initialization

        private readonly IClientService _clientService;

        public ClientController(IClientService clientService)
        {
            _clientService = clientService;
        }

        #endregion

        /// <summary>
        /// Update Client
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPut]
        [Route("updateClient")]
        [Consumes("application/json")]
        [Authorize($"{nameof(Role.Admin)},{nameof(Role.BD)},{nameof(Role.BDM)}")]
        public async Task<IActionResult> UpdateClient(ClientRequest request)
        {
            try
            {
                return Ok(await _clientService.UpdateClient(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Delete Client
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpDelete("{Id:guid}")]
        [Route("deleteClient")]
        [Consumes("application/json")]
        [Authorize($"{nameof(Role.Admin)},{nameof(Role.BD)},{nameof(Role.BDM)}")]
        public async Task<IActionResult> DeleteClient(Guid id)
        {
            try
            {
                await _clientService.DeleteClient(id);
                return Ok();
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Client By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpGet("{Id:guid}")]
        [Route("getClientById/{id}")]
        [Consumes("application/json")]
        public async Task<IActionResult> GetClientById(Guid id)
        {
            try
            {
                return Ok(await _clientService.GetClientById(id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get All Clients
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("getAllClients")]
        [Consumes("application/json")]
        public async Task<IActionResult> GetAllClients(CustomDepartmentFilterRequest request)
        {
            try
            {
                return Ok(await _clientService.GetClients(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Upload Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("UploadExcel")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadClientData([FromForm] ImportClientRequest model)
        {
            try
            {
                if (model is not null)
                {
                    return Ok(await _clientService.ImportClientListFile(model));
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        #region Download Client Excel Sample

        /// <summary>
        /// Download Client Excel Sample
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("downloadClientSampleExcel")]
        public async Task<FileStreamResult> DownloadClientSampleExcel()
        {
            try
            {
                var response = await _clientService.DownloadClientSampleExcel();

                if (response.Success)
                {
                    return File(response.Streams, "application/octet-stream", "");
                }

                throw new AppException("");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }
        
        #endregion
    }
}
