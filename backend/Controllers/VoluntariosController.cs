using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voluntariado.Api.Data;
using Voluntariado.Api.DTOs;
using Voluntariado.Api.Models;

namespace Voluntariado.Api.Controllers;

[ApiController]
[Route("voluntarios")]
public class VoluntariosController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Voluntario>>> Get()
    {
        return Ok(await db.Voluntarios
            .AsNoTracking()
            .Include(x => x.Usuario)
            .OrderByDescending(x => x.Id)
            .ToListAsync());
    }

    [HttpPost]
    public async Task<ActionResult<Voluntario>> Post(VoluntarioCreateDto dto)
    {
        var usuario = await db.Usuarios.FindAsync(dto.UsuarioId);

        if (usuario is null || usuario.Tipo != TipoUsuario.Voluntario)
        {
            return BadRequest(new { message = "Informe um usuário do tipo Voluntario." });
        }

        if (await db.Voluntarios.AnyAsync(x => x.UsuarioId == dto.UsuarioId))
        {
            return Conflict(new { message = "Este usuário já possui um cadastro de voluntário." });
        }

        var voluntario = new Voluntario
        {
            UsuarioId = dto.UsuarioId,
            DataNascimento = dto.DataNascimento,
            Genero = dto.Genero,
            Disponibilidade = dto.Disponibilidade,
            Habilidades = dto.Habilidades
        };

        db.Voluntarios.Add(voluntario);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = voluntario.Id }, voluntario);
    }
}
