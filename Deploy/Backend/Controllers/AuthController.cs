using System.Threading.Tasks;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VoluntaMais.Api.Data;
using VoluntaMais.Api.DTOs;
using VoluntaMais.Api.Services;

namespace VoluntaMais.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly AppDbContext _context;

        public AuthController(AuthService authService, AppDbContext context)
        {
            _authService = authService;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var result = await _authService.AuthenticateAsync(loginDto.Email, loginDto.Senha);
                
                if (result == null)
                    return Unauthorized(new { message = "Email ou senha incorretos." });

                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                if (ex.Message == "AccountPermanentDeleted")
                    return Unauthorized(new { message = "Esta conta foi excluída permanentemente e não pode ser recuperada." });
                if (ex.Message == "AccountPendingDeletion")
                    return StatusCode(403, new { message = "Sua conta está agendada para exclusão. Deseja recuperá-la?", status = "AccountPendingDeletion" });
                
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("recover")]
        public async Task<IActionResult> RecoverAccount([FromBody] LoginDto loginDto)
        {
            // First verify password
            var user = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null || !_authService.VerifyPassword(loginDto.Senha, user.Senha))
                return Unauthorized(new { message = "Email ou senha incorretos." });

            if (user.DataExclusao == null)
                return BadRequest(new { message = "A conta não está em processo de exclusão." });

            if ((DateTime.UtcNow - user.DataExclusao.Value).TotalDays > 30)
                return BadRequest(new { message = "O prazo de 30 dias para recuperação expirou." });

            user.DataExclusao = null;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Conta recuperada com sucesso! Você já pode fazer login." });
        }

        [Authorize(Roles = "Superadmin")]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetDto)
        {
            var user = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == resetDto.Email);
            
            if (user == null)
                return NotFound(new { message = "Usuário não encontrado." });

            user.Senha = _authService.HashPassword(resetDto.NovaSenha);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Senha redefinida com sucesso." });
        }
    }
}
