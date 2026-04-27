using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voluntariado.Api.Data;
using Voluntariado.Api.DTOs;
using Voluntariado.Api.Models;

namespace Voluntariado.Api.Controllers;

[ApiController]
[Route("oportunidades")]
public class OportunidadesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Oportunidade>>> Get([FromQuery] string? tipo, [FromQuery] long? categoriaId)
    {
        var query = db.Oportunidades
            .AsNoTracking()
            .Include(x => x.Instituicao)
            .Include(x => x.Categoria)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(tipo) && Enum.TryParse<TipoOportunidade>(tipo, true, out var parsedTipo))
        {
            query = query.Where(x => x.Tipo == parsedTipo);
        }

        if (categoriaId is not null)
        {
            query = query.Where(x => x.CategoriaId == categoriaId);
        }

        return Ok(await query.OrderBy(x => x.DataInicio).ToListAsync());
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<Oportunidade>> GetById(long id)
    {
        var oportunidade = await db.Oportunidades
            .AsNoTracking()
            .Include(x => x.Instituicao)
            .Include(x => x.Categoria)
            .Include(x => x.Inscricoes)
            .FirstOrDefaultAsync(x => x.Id == id);

        return oportunidade is null ? NotFound() : Ok(oportunidade);
    }

    [HttpPost]
    public async Task<ActionResult<Oportunidade>> Post(OportunidadeCreateDto dto)
    {
        if (!await db.Instituicoes.AnyAsync(x => x.Id == dto.InstituicaoId))
        {
            return BadRequest(new { message = "Instituição não encontrada." });
        }

        if (dto.CategoriaId is not null && !await db.Categorias.AnyAsync(x => x.Id == dto.CategoriaId))
        {
            return BadRequest(new { message = "Categoria não encontrada." });
        }

        if (dto.Vagas <= 0)
        {
            return BadRequest(new { message = "A oportunidade deve ter pelo menos uma vaga." });
        }

        var oportunidade = new Oportunidade
        {
            InstituicaoId = dto.InstituicaoId,
            CategoriaId = dto.CategoriaId,
            Titulo = dto.Titulo.Trim(),
            Tipo = dto.Tipo,
            Descricao = dto.Descricao,
            Objetivo = dto.Objetivo,
            Cidade = dto.Cidade,
            Estado = dto.Estado?.ToUpperInvariant(),
            DataInicio = dto.DataInicio,
            DataFim = dto.DataFim,
            Vagas = dto.Vagas,
            Status = dto.Status ?? StatusOportunidade.Pendente
        };

        db.Oportunidades.Add(oportunidade);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = oportunidade.Id }, oportunidade);
    }
}
