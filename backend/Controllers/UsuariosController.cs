using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voluntariado.Api.Data;
using Voluntariado.Api.DTOs;
using Voluntariado.Api.Models;

namespace Voluntariado.Api.Controllers;

[ApiController]
[Route("usuarios")]
public class UsuariosController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Usuario>>> Get()
    {
        return Ok(await db.Usuarios
            .AsNoTracking()
            .OrderByDescending(x => x.Id)
            .ToListAsync());
    }

    [HttpPost]
    public async Task<ActionResult<Usuario>> Post(UsuarioCreateDto dto)
    {
        var emailExists = await db.Usuarios.AnyAsync(x => x.Email == dto.Email);

        if (emailExists)
        {
            return Conflict(new { message = "E-mail já cadastrado." });
        }

        var usuario = new Usuario
        {
            Nome = dto.Nome.Trim(),
            Email = dto.Email.Trim().ToLowerInvariant(),
            Senha = dto.Senha,
            Tipo = dto.Tipo,
            Telefone = dto.Telefone,
            Cidade = dto.Cidade,
            Estado = dto.Estado?.ToUpperInvariant()
        };

        db.Usuarios.Add(usuario);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = usuario.Id }, usuario);
    }
}
