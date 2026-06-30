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
        private readonly IWebHostEnvironment _environment;

        public OportunidadesController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpDelete("reset-todas")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetTodasAsOportunidades()
        {
            var inscricoes = await _context.Inscricoes.ToListAsync();
            _context.Inscricoes.RemoveRange(inscricoes);
            
            var feedbacks = await _context.Feedbacks.ToListAsync();
            _context.Feedbacks.RemoveRange(feedbacks);

            var oportunidades = await _context.Oportunidades.ToListAsync();
            _context.Oportunidades.RemoveRange(oportunidades);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Todas as oportunidades, inscrições e feedbacks foram deletados com sucesso." });
        }

        [HttpGet]
        public async Task<IActionResult> Listar([FromQuery] long? categoriaId, [FromQuery] string? cidade)
        {
            var query = _context.Oportunidades
                .AsNoTracking()
                .Include(o => o.Instituicao)
                .Include(o => o.Categoria)
                .Where(o => o.Status == OportunidadeStatus.Ativa || o.Status == OportunidadeStatus.Aprovada || o.Status == OportunidadeStatus.Encerrada)
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
                .OrderBy(o => o.Status == OportunidadeStatus.Encerrada ? 1 : 0)
                .ThenBy(o => o.DataInicio)
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
                    o.DataFimInscricoes,
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


            if (dto.Vagas <= 0)
            {
                return BadRequest(new { message = "A oportunidade deve ter pelo menos uma vaga." });
            }

            // Trava de instituição removida conforme solicitado
            if (!await _context.Instituicoes.AnyAsync(i => i.Id == dto.InstituicaoId))
            {
                // Se não existir, talvez criar uma temporária ou usar a primeira?
                // Mantemos apenas a verificação de existência para não quebrar FK, mas removemos a trava de "Aprovada"
                var primeiraInst = await _context.Instituicoes.FirstOrDefaultAsync();
                if (primeiraInst != null)
                {
                    dto.InstituicaoId = primeiraInst.Id;
                }
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
                DataFimInscricoes = dto.DataFimInscricoes,
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
                oportunidade.DataFimInscricoes,
                oportunidade.Vagas,
                Status = oportunidade.Status.ToString()
            });
        }

        [HttpPut("{id:long}")]
        [Authorize(Roles = "Admin,Instituicao")]
        public async Task<IActionResult> Atualizar(long id, [FromBody] OportunidadeUpdateDto dto)
        {
            var oportunidade = await _context.Oportunidades.FirstOrDefaultAsync(o => o.Id == id);
            if (oportunidade == null)
            {
                return NotFound(new { message = "Oportunidade não encontrada." });
            }

            var userRole = User.FindFirstValue(ClaimTypes.Role);
            var userEmail = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue("email");

            if (userRole != "Admin" && userRole != "Superadmin")
            {
                var instituicao = await _context.Instituicoes.Include(i => i.Usuario).FirstOrDefaultAsync(i => i.Id == oportunidade.InstituicaoId);
                if (instituicao == null || instituicao.Usuario.Email != userEmail)
                {
                    return Forbid();
                }
            }

            if (dto.CategoriaId.HasValue && !await _context.Categorias.AnyAsync(c => c.Id == dto.CategoriaId.Value))
            {
                return BadRequest(new { message = "Categoria não encontrada." });
            }

            if (dto.CategoriaId.HasValue) oportunidade.CategoriaId = dto.CategoriaId;
            if (!string.IsNullOrWhiteSpace(dto.Titulo)) oportunidade.Titulo = dto.Titulo.Trim();
            
            // Only update if explicitly provided (assuming default is not meant to override)
            if (dto.Tipo != default) oportunidade.Tipo = dto.Tipo;
            if (dto.Descricao != null) oportunidade.Descricao = dto.Descricao;
            if (dto.ImagemUrl != null) oportunidade.ImagemUrl = dto.ImagemUrl;
            if (dto.Objetivo != null) oportunidade.Objetivo = dto.Objetivo;
            if (dto.Cidade != null) oportunidade.Cidade = dto.Cidade;
            if (dto.Estado != null) oportunidade.Estado = dto.Estado?.ToUpperInvariant();
            if (dto.DataInicio != default) oportunidade.DataInicio = dto.DataInicio;
            if (dto.DataFim != null) oportunidade.DataFim = dto.DataFim;
            if (dto.DataFimInscricoes != null) oportunidade.DataFimInscricoes = dto.DataFimInscricoes;
            if (dto.Vagas > 0) oportunidade.Vagas = dto.Vagas;
            if (dto.Requisitos != null) oportunidade.Requisitos = dto.Requisitos;
            if (dto.Turno != null) oportunidade.Turno = dto.Turno;
            if (dto.LocalDetalhado != null) oportunidade.LocalDetalhado = dto.LocalDetalhado;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Oportunidade atualizada com sucesso." });
        }

        [HttpDelete("{id:long}")]
        [Authorize(Roles = "Admin,Instituicao")]
        public async Task<IActionResult> Excluir(long id)
        {
            var oportunidade = await _context.Oportunidades.FirstOrDefaultAsync(o => o.Id == id);
            if (oportunidade == null)
            {
                return NotFound(new { message = "Oportunidade não encontrada." });
            }

            var userRole = User.FindFirstValue(ClaimTypes.Role);
            var userEmail = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue("email");

            if (userRole != "Admin" && userRole != "Superadmin")
            {
                var instituicao = await _context.Instituicoes.Include(i => i.Usuario).FirstOrDefaultAsync(i => i.Id == oportunidade.InstituicaoId);
                if (instituicao == null || instituicao.Usuario.Email != userEmail)
                {
                    return Forbid();
                }
            }

            // Soft delete by changing status
            oportunidade.Status = OportunidadeStatus.Encerrada;
            
            await _context.SaveChangesAsync();

            return Ok(new { message = "Oportunidade removida com sucesso." });
        }
    }
}
