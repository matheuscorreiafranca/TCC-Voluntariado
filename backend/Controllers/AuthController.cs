using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voluntariado.Api.Data;
using Voluntariado.Api.DTOs;

namespace Voluntariado.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController(AppDbContext db) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login(AuthLoginDto dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();
        var usuario = await db.Usuarios
            .AsNoTracking()
            .Include(x => x.Voluntario)
            .Include(x => x.Instituicao)
            .FirstOrDefaultAsync(x => x.Email == email && x.Senha == dto.Senha);

        if (usuario is null || !usuario.Ativo)
        {
            return Unauthorized(new { message = "E-mail ou senha inválidos." });
        }

        return Ok(new
        {
            usuario,
            voluntario = usuario.Voluntario,
            instituicao = usuario.Instituicao
        });
    }
}
