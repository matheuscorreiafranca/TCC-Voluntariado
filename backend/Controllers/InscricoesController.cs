using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voluntariado.Api.Data;
using Voluntariado.Api.DTOs;
using Voluntariado.Api.Models;

namespace Voluntariado.Api.Controllers;

[ApiController]
[Route("inscricoes")]
public class InscricoesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Inscricao>>> Get()
    {
        return Ok(await db.Inscricoes
            .AsNoTracking()
            .Include(x => x.Oportunidade)
            .Include(x => x.Voluntario)!.ThenInclude(x => x.Usuario)
            .OrderByDescending(x => x.Id)
            .ToListAsync());
    }

    [HttpPost]
    public async Task<ActionResult<Inscricao>> Post(InscricaoCreateDto dto)
    {
        var oportunidade = await db.Oportunidades
            .Include(x => x.Inscricoes)
            .Include(x => x.Instituicao)
            .FirstOrDefaultAsync(x => x.Id == dto.OportunidadeId);

        if (oportunidade is null)
        {
            return BadRequest(new { message = "Oportunidade não encontrada." });
        }

        var voluntario = await db.Voluntarios.Include(x => x.Usuario).FirstOrDefaultAsync(x => x.Id == dto.VoluntarioId);

        if (voluntario is null)
        {
            return BadRequest(new { message = "Voluntário não encontrado." });
        }

        if (await db.Inscricoes.AnyAsync(x => x.OportunidadeId == dto.OportunidadeId && x.VoluntarioId == dto.VoluntarioId))
        {
            return Conflict(new { message = "Voluntário já inscrito nesta oportunidade." });
        }

        var ocupadas = oportunidade.Inscricoes.Count(x => x.Status is StatusInscricao.Pendente or StatusInscricao.Aprovada);
        if (ocupadas >= oportunidade.Vagas)
        {
            return BadRequest(new { message = "Esta oportunidade não possui vagas disponíveis." });
        }

        var inscricao = new Inscricao
        {
            OportunidadeId = dto.OportunidadeId,
            VoluntarioId = dto.VoluntarioId,
            Status = StatusInscricao.Pendente
        };

        db.Inscricoes.Add(inscricao);
        await db.SaveChangesAsync();

        if (oportunidade.Instituicao?.UsuarioId is long usuarioInstituicaoId)
        {
            db.Notificacoes.Add(new Notificacao
            {
                UsuarioId = usuarioInstituicaoId,
                Titulo = "Nova inscrição recebida",
                Mensagem = $"{voluntario.Usuario?.Nome ?? "Um voluntário"} se inscreveu em {oportunidade.Titulo}."
            });
            await db.SaveChangesAsync();
        }

        return CreatedAtAction(nameof(Get), new { id = inscricao.Id }, inscricao);
    }

    [HttpPatch("{id:long}/aprovar")]
    public async Task<ActionResult<Inscricao>> Aprovar(long id)
    {
        var inscricao = await db.Inscricoes
            .Include(x => x.Voluntario)
            .Include(x => x.Oportunidade)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (inscricao is null)
        {
            return NotFound();
        }

        inscricao.Status = StatusInscricao.Aprovada;
        inscricao.MotivoReprovacao = null;
        inscricao.AtualizadoEm = DateTime.UtcNow;

        if (inscricao.Voluntario?.UsuarioId is long usuarioId)
        {
            db.Notificacoes.Add(new Notificacao
            {
                UsuarioId = usuarioId,
                Titulo = "Inscrição aprovada",
                Mensagem = $"Sua inscrição em {inscricao.Oportunidade?.Titulo ?? "uma oportunidade"} foi aprovada."
            });
        }

        await db.SaveChangesAsync();
        return Ok(inscricao);
    }

    [HttpPatch("{id:long}/reprovar")]
    public async Task<ActionResult<Inscricao>> Reprovar(long id, ReprovarInscricaoDto dto)
    {
        var inscricao = await db.Inscricoes
            .Include(x => x.Voluntario)
            .Include(x => x.Oportunidade)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (inscricao is null)
        {
            return NotFound();
        }

        inscricao.Status = StatusInscricao.Reprovada;
        inscricao.MotivoReprovacao = dto.MotivoReprovacao;
        inscricao.AtualizadoEm = DateTime.UtcNow;

        if (inscricao.Voluntario?.UsuarioId is long usuarioId)
        {
            db.Notificacoes.Add(new Notificacao
            {
                UsuarioId = usuarioId,
                Titulo = "Inscrição reprovada",
                Mensagem = $"Sua inscrição em {inscricao.Oportunidade?.Titulo ?? "uma oportunidade"} não foi aprovada."
            });
        }

        await db.SaveChangesAsync();
        return Ok(inscricao);
    }
}
