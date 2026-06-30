using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
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
    public class InscricoesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InscricoesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var inscricoes = await _context.Inscricoes
                .AsNoTracking()
                .Include(i => i.Oportunidade)
                .Include(i => i.Voluntario).ThenInclude(v => v.Usuario)
                .OrderByDescending(i => i.DataInsercao)
                .Select(i => new
                {
                    i.Id,
                    i.OportunidadeId,
                    OportunidadeTitulo = i.Oportunidade.Titulo,
                    Oportunidade = new
                    {
                        i.Oportunidade.Id,
                        i.Oportunidade.InstituicaoId,
                        i.Oportunidade.Titulo,
                        Tipo = i.Oportunidade.Tipo.ToString(),
                        i.Oportunidade.Cidade,
                        i.Oportunidade.Estado,
                        Instituicao = new
                        {
                            i.Oportunidade.Instituicao.Id,
                            i.Oportunidade.Instituicao.Nome,
                            i.Oportunidade.Instituicao.Responsavel
                        }
                    },
                    i.VoluntarioId,
                    VoluntarioNome = i.Voluntario.Usuario.Nome,
                    Voluntario = new
                    {
                        i.Voluntario.Id,
                        i.Voluntario.UsuarioId,
                        Usuario = new
                        {
                            i.Voluntario.Usuario.Id,
                            i.Voluntario.Usuario.Nome,
                            i.Voluntario.Usuario.Email
                        }
                    },
                    Status = i.Status.ToString(),
                    i.MotivoReprovacao,
                    i.DataInsercao,
                    i.DataAtualizacao
                })
                .ToListAsync();

            return Ok(inscricoes);
        }

        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] InscricaoCreateDto dto)
        {
            var oportunidade = await _context.Oportunidades
                .Include(o => o.Inscricoes)
                .Include(o => o.Instituicao)
                .FirstOrDefaultAsync(o => o.Id == dto.OportunidadeId);

            if (oportunidade == null)
            {
                return BadRequest(new { message = "Oportunidade não encontrada." });
            }

            if (oportunidade.Status != OportunidadeStatus.Ativa && oportunidade.Status != OportunidadeStatus.Aprovada)
            {
                return BadRequest(new { message = "Oportunidade não está aberta para inscrições." });
            }

            var voluntario = await _context.Voluntarios
                .Include(v => v.Usuario)
                .FirstOrDefaultAsync(v => v.Id == dto.VoluntarioId);

            if (voluntario == null || voluntario.Usuario.Anonimizado || !voluntario.Usuario.Ativo)
            {
                return BadRequest(new { message = "Voluntário não encontrado ou inativo." });
            }

            if (await _context.Inscricoes.AnyAsync(i => i.OportunidadeId == dto.OportunidadeId && i.VoluntarioId == dto.VoluntarioId))
            {
                return Conflict(new { message = "Voluntário já inscrito nesta oportunidade." });
            }

            var vagasOcupadas = oportunidade.Inscricoes.Count(i =>
                i.Status == InscricaoStatus.Pendente || i.Status == InscricaoStatus.Aprovada);

            if (vagasOcupadas >= oportunidade.Vagas)
            {
                return BadRequest(new { message = "Esta oportunidade não possui vagas disponíveis." });
            }

            var inscricao = new Inscricao
            {
                OportunidadeId = oportunidade.Id,
                VoluntarioId = voluntario.Id,
                Status = InscricaoStatus.Pendente,
                Motivacao = dto.Motivacao,
                Disponibilidade = dto.Disponibilidade,
                Experiencia = dto.Experiencia
            };

            _context.Inscricoes.Add(inscricao);

            if (oportunidade.Instituicao.UsuarioId > 0)
            {
                _context.Notificacoes.Add(new Notificacao
                {
                    UsuarioId = oportunidade.Instituicao.UsuarioId,
                    Titulo = "Nova inscrição recebida",
                    Mensagem = $"{voluntario.Usuario.Nome} se inscreveu em {oportunidade.Titulo}."
                });
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Listar), new { id = inscricao.Id }, new
            {
                inscricao.Id,
                inscricao.OportunidadeId,
                OportunidadeTitulo = oportunidade.Titulo,
                inscricao.VoluntarioId,
                VoluntarioNome = voluntario.Usuario.Nome,
                Status = inscricao.Status.ToString(),
                inscricao.MotivoReprovacao,
                inscricao.DataInsercao,
                message = "Inscrição realizada com sucesso."
            });
        }

        [HttpPatch("{id:long}/aprovar")]
        [Authorize(Roles = "Admin,Superadmin,Instituicao")]
        public async Task<IActionResult> Aprovar(long id)
        {
            var inscricao = await _context.Inscricoes
                .Include(i => i.Voluntario)
                .Include(i => i.Oportunidade)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (inscricao == null)
            {
                return NotFound(new { message = "Inscrição não encontrada." });
            }

            inscricao.Status = InscricaoStatus.Aprovada;
            inscricao.MotivoReprovacao = null;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                inscricao.Id,
                inscricao.OportunidadeId,
                inscricao.VoluntarioId,
                Status = inscricao.Status.ToString(),
                inscricao.MotivoReprovacao,
                message = "Inscrição aprovada com sucesso."
            });
        }

        [HttpPatch("{id:long}/reprovar")]
        [Authorize(Roles = "Admin,Superadmin,Instituicao")]
        public async Task<IActionResult> Reprovar(long id, [FromBody] ReprovarInscricaoDto dto)
        {
            var inscricao = await _context.Inscricoes
                .Include(i => i.Voluntario)
                .Include(i => i.Oportunidade)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (inscricao == null)
            {
                return NotFound(new { message = "Inscrição não encontrada." });
            }

            inscricao.Status = InscricaoStatus.Reprovada;
            inscricao.MotivoReprovacao = dto.MotivoReprovacao;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                inscricao.Id,
                inscricao.OportunidadeId,
                inscricao.VoluntarioId,
                Status = inscricao.Status.ToString(),
                inscricao.MotivoReprovacao,
                message = "Inscrição reprovada com sucesso."
            });
        }

        [HttpPatch("{id:long}/finalizar")]
        [Authorize(Roles = "Admin,Superadmin,Instituicao")]
        public async Task<IActionResult> Finalizar(long id, [FromBody] FinalizarInscricaoDto dto)
        {
            var inscricao = await _context.Inscricoes
                .Include(i => i.Voluntario)
                .Include(i => i.Oportunidade)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (inscricao == null)
            {
                return NotFound(new { message = "Inscrição não encontrada." });
            }

            if (inscricao.Status != InscricaoStatus.Aprovada)
            {
                return BadRequest(new { message = "Apenas inscrições aprovadas podem ser finalizadas." });
            }

            inscricao.Status = InscricaoStatus.Concluida;
            inscricao.HorasComprovadas = dto.Horas;
            inscricao.CertificadoGerado = true;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                inscricao.Id,
                inscricao.OportunidadeId,
                inscricao.VoluntarioId,
                Status = inscricao.Status.ToString(),
                inscricao.HorasComprovadas,
                inscricao.CertificadoGerado,
                message = "Inscrição finalizada e certificado gerado com sucesso."
            });
        }

        [HttpDelete("{id:long}")]
        [Authorize(Roles = "Admin,Superadmin")]
        public async Task<IActionResult> Excluir(long id)
        {
            var inscricao = await _context.Inscricoes.FindAsync(id);
            if (inscricao == null)
            {
                return NotFound(new { message = "Inscrição não encontrada." });
            }

            _context.Inscricoes.Remove(inscricao);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
