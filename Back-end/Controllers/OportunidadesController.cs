using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using VoluntaMais.Api.Data;
using VoluntaMais.Api.DTOs;
using VoluntaMais.Api.Models;

namespace VoluntaMais.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class OportunidadesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OportunidadesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Listar([FromQuery] long? categoriaId, [FromQuery] string? cidade)
        {
            var query = _context.Oportunidades
                .AsNoTracking()
                .Include(o => o.Instituicao)
                .Include(o => o.Categoria)
                .Where(o => o.Status == OportunidadeStatus.Ativa || o.Status == OportunidadeStatus.Aprovada)
                .AsQueryable();

            if (categoriaId.HasValue)
            {
                query = query.Where(o => o.CategoriaId == categoriaId.Value);
            }

            if (!string.IsNullOrWhiteSpace(cidade))
            {
                query = query.Where(o => o.Cidade != null && o.Cidade.Contains(cidade));
            }

            var oportunidades = await query
                .OrderBy(o => o.DataInicio)
                .Select(o => new
                {
                    o.Id,
                    o.InstituicaoId,
                    o.CategoriaId,
                    o.Titulo,
                    Tipo = o.Tipo.ToString(),
                    o.Descricao,
                    o.ImagemUrl,
                    o.Objetivo,
                    o.Cidade,
                    o.Estado,
                    o.DataInicio,
                    o.DataFim,
                    o.Vagas,
                    Status = o.Status.ToString(),
                    VagasOcupadas = o.Inscricoes.Count(i =>
                        i.Status == InscricaoStatus.Pendente || i.Status == InscricaoStatus.Aprovada),
                    VagasDisponiveis = Math.Max(0, o.Vagas - o.Inscricoes.Count(i =>
                        i.Status == InscricaoStatus.Pendente || i.Status == InscricaoStatus.Aprovada)),
                    o.Requisitos,
                    o.Turno,
                    o.LocalDetalhado,
                    o.AceitaSemFormacao,
                    o.PrecisaApoioCriancas,
                    Instituicao = new { o.Instituicao.Id, o.Instituicao.Nome },
                    Categoria = o.Categoria == null ? null : new { o.Categoria.Id, o.Categoria.Nome }
                })
                .ToListAsync();

            return Ok(oportunidades);
        }

        [HttpGet("{id:long}")]
        public async Task<IActionResult> ObterPorId(long id)
        {
            var oportunidade = await _context.Oportunidades
                .AsNoTracking()
                .Include(o => o.Instituicao)
                .Include(o => o.Categoria)
                .Include(o => o.Inscricoes)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (oportunidade == null)
            {
                return NotFound(new { message = "Oportunidade não encontrada." });
            }

            var vagasOcupadas = oportunidade.Inscricoes.Count(i =>
                i.Status == InscricaoStatus.Pendente || i.Status == InscricaoStatus.Aprovada);

            return Ok(new
            {
                oportunidade,
                vagasOcupadas,
                vagasDisponiveis = Math.Max(0, oportunidade.Vagas - vagasOcupadas)
            });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Criar([FromBody] OportunidadeCreateDto dto)
        {
            var email = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue("email");
            if (!string.Equals(email, "admin@example.com", StringComparison.OrdinalIgnoreCase))
            {
                return Forbid();
            }

            if (dto.Vagas <= 0)
            {
                return BadRequest(new { message = "A oportunidade deve ter pelo menos uma vaga." });
            }

            if (!await _context.Instituicoes.AnyAsync(i => i.Id == dto.InstituicaoId && i.Status == InstituicaoStatus.Aprovada))
            {
                return BadRequest(new { message = "Instituição não encontrada ou não aprovada." });
            }

            if (dto.CategoriaId.HasValue && !await _context.Categorias.AnyAsync(c => c.Id == dto.CategoriaId.Value))
            {
                return BadRequest(new { message = "Categoria não encontrada." });
            }

            var oportunidade = new Oportunidade
            {
                InstituicaoId = dto.InstituicaoId,
                CategoriaId = dto.CategoriaId,
                Titulo = dto.Titulo.Trim(),
                Tipo = dto.Tipo,
                Descricao = dto.Descricao,
                ImagemUrl = dto.ImagemUrl,
                Objetivo = dto.Objetivo,
                Cidade = dto.Cidade,
                Estado = dto.Estado?.ToUpperInvariant(),
                DataInicio = dto.DataInicio == default ? DateTime.UtcNow : dto.DataInicio,
                DataFim = dto.DataFim,
                Vagas = dto.Vagas,
                Status = OportunidadeStatus.Ativa,
                Requisitos = dto.Requisitos,
                Turno = dto.Turno,
                LocalDetalhado = dto.LocalDetalhado,
                AceitaSemFormacao = dto.AceitaSemFormacao,
                PrecisaApoioCriancas = dto.PrecisaApoioCriancas
            };

            _context.Oportunidades.Add(oportunidade);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(ObterPorId), new { id = oportunidade.Id }, new
            {
                oportunidade.Id,
                oportunidade.InstituicaoId,
                oportunidade.CategoriaId,
                oportunidade.Titulo,
                Tipo = oportunidade.Tipo.ToString(),
                oportunidade.Descricao,
                oportunidade.ImagemUrl,
                oportunidade.Objetivo,
                oportunidade.Cidade,
                oportunidade.Estado,
                oportunidade.DataInicio,
                oportunidade.DataFim,
                oportunidade.Vagas,
                Status = oportunidade.Status.ToString()
            });
        }
    }
}
