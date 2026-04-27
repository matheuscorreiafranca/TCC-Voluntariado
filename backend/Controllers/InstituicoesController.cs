using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voluntariado.Api.Data;
using Voluntariado.Api.DTOs;
using Voluntariado.Api.Models;

namespace Voluntariado.Api.Controllers;

[ApiController]
[Route("instituicoes")]
public class InstituicoesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Instituicao>>> Get()
    {
        return Ok(await db.Instituicoes
            .AsNoTracking()
            .Include(x => x.Usuario)
            .OrderByDescending(x => x.Id)
            .ToListAsync());
    }

    [HttpPost]
    public async Task<ActionResult<Instituicao>> Post(InstituicaoCreateDto dto)
    {
        var usuario = await db.Usuarios.FindAsync(dto.UsuarioId);

        if (usuario is null || usuario.Tipo != TipoUsuario.Instituicao)
        {
            return BadRequest(new { message = "Informe um usuário do tipo Instituicao." });
        }

        if (await db.Instituicoes.AnyAsync(x => x.UsuarioId == dto.UsuarioId))
        {
            return Conflict(new { message = "Este usuário já possui uma instituição." });
        }

        var instituicao = new Instituicao
        {
            UsuarioId = dto.UsuarioId,
            Nome = dto.Nome.Trim(),
            Cnpj = dto.Cnpj,
            Responsavel = dto.Responsavel,
            Descricao = dto.Descricao
        };

        db.Instituicoes.Add(instituicao);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = instituicao.Id }, instituicao);
    }
}
