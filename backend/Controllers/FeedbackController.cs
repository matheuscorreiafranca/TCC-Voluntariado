using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voluntariado.Api.Data;
using Voluntariado.Api.DTOs;
using Voluntariado.Api.Models;

namespace Voluntariado.Api.Controllers;

[ApiController]
[Route("feedback")]
public class FeedbackController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Feedback>>> Get()
    {
        return Ok(await db.Feedbacks
            .AsNoTracking()
            .Include(x => x.Inscricao)
            .OrderByDescending(x => x.Id)
            .ToListAsync());
    }

    [HttpPost]
    public async Task<ActionResult<Feedback>> Post(FeedbackCreateDto dto)
    {
        var inscricao = await db.Inscricoes.FindAsync(dto.InscricaoId);

        if (inscricao is null)
        {
            return BadRequest(new { message = "Inscrição não encontrada." });
        }

        if (inscricao.Status != StatusInscricao.Aprovada && inscricao.Status != StatusInscricao.Concluida)
        {
            return BadRequest(new { message = "Feedback só pode ser registrado após aprovação da inscrição." });
        }

        var feedback = new Feedback
        {
            InscricaoId = dto.InscricaoId,
            Autor = dto.Autor,
            Nota = dto.Nota,
            Comentario = dto.Comentario
        };

        db.Feedbacks.Add(feedback);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = feedback.Id }, feedback);
    }
}
