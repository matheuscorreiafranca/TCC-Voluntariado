using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VoluntaMais.Api.Data;
using VoluntaMais.Api.DTOs;
using VoluntaMais.Api.Models;

namespace VoluntaMais.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FeedbackController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var feedbacks = await _context.Feedbacks
                .AsNoTracking()
                .Include(f => f.Inscricao).ThenInclude(i => i.Oportunidade).ThenInclude(o => o.Instituicao)
                .Include(f => f.Inscricao).ThenInclude(i => i.Voluntario).ThenInclude(v => v.Usuario)
                .OrderByDescending(f => f.DataInsercao)
                .Select(f => new
                {
                    f.Id,
                    f.InscricaoId,
                    Autor = f.Autor.ToString(),
                    f.Nota,
                    f.Comentario,
                    f.RespostasJson,
                    CriadoEm = f.DataInsercao,
                    Inscricao = new
                    {
                        f.Inscricao.Id,
                        f.Inscricao.OportunidadeId,
                        f.Inscricao.VoluntarioId,
                        Status = f.Inscricao.Status.ToString(),
                        CriadoEm = f.Inscricao.DataInsercao,
                        AtualizadoEm = f.Inscricao.DataAtualizacao,
                        Oportunidade = new
                        {
                            f.Inscricao.Oportunidade.Id,
                            f.Inscricao.Oportunidade.InstituicaoId,
                            f.Inscricao.Oportunidade.Titulo,
                            Tipo = f.Inscricao.Oportunidade.Tipo.ToString(),
                            f.Inscricao.Oportunidade.Cidade,
                            f.Inscricao.Oportunidade.Estado,
                            Instituicao = new
                            {
                                f.Inscricao.Oportunidade.Instituicao.Id,
                                f.Inscricao.Oportunidade.Instituicao.Nome,
                                f.Inscricao.Oportunidade.Instituicao.Responsavel
                            }
                        },
                        Voluntario = new
                        {
                            f.Inscricao.Voluntario.Id,
                            f.Inscricao.Voluntario.UsuarioId,
                            Usuario = new
                            {
                                f.Inscricao.Voluntario.Usuario.Id,
                                f.Inscricao.Voluntario.Usuario.Nome,
                                f.Inscricao.Voluntario.Usuario.Email
                            }
                        }
                    }
                })
                .ToListAsync();

            return Ok(feedbacks);
        }

        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] FeedbackCreateDto dto)
        {
            var inscricao = await _context.Inscricoes
                .Include(i => i.Feedbacks)
                .FirstOrDefaultAsync(i => i.Id == dto.InscricaoId);

            if (inscricao == null)
            {
                return BadRequest(new { message = "Inscricao nao encontrada." });
            }

            if (inscricao.Status != InscricaoStatus.Aprovada && inscricao.Status != InscricaoStatus.Concluida)
            {
                return BadRequest(new { message = "Feedback so pode ser registrado apos aprovacao da inscricao." });
            }

            if (inscricao.Feedbacks.Any(f => f.Autor == dto.Autor))
            {
                return Conflict(new { message = "Este feedback ja foi registrado para esta inscricao." });
            }

            var feedback = new Feedback
            {
                InscricaoId = dto.InscricaoId,
                Autor = dto.Autor,
                Nota = dto.Nota,
                Comentario = string.IsNullOrWhiteSpace(dto.Comentario) ? null : dto.Comentario.Trim(),
                RespostasJson = string.IsNullOrWhiteSpace(dto.RespostasJson) ? null : dto.RespostasJson.Trim()
            };

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Listar), new { id = feedback.Id }, new
            {
                feedback.Id,
                feedback.InscricaoId,
                Autor = feedback.Autor.ToString(),
                feedback.Nota,
                feedback.Comentario,
                feedback.RespostasJson,
                CriadoEm = feedback.DataInsercao,
                message = "Feedback registrado com sucesso."
            });
        }
    }
}
