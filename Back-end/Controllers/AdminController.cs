using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VoluntaMais.Api.Data;
using VoluntaMais.Api.Models;

namespace VoluntaMais.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Authorize(Roles = "Admin,Superadmin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> Dashboard()
        {
            var inscricoesPorStatus = await _context.Inscricoes
                .AsNoTracking()
                .GroupBy(i => i.Status)
                .Select(g => new { Status = g.Key, Total = g.Count() })
                .ToListAsync();

            var inscricoes = await _context.Inscricoes
                .AsNoTracking()
                .Include(i => i.Oportunidade).ThenInclude(o => o.Instituicao)
                .Include(i => i.Voluntario).ThenInclude(v => v.Usuario)
                .OrderByDescending(i => i.DataInsercao)
                .Select(i => new
                {
                    i.Id,
                    i.OportunidadeId,
                    OportunidadeTitulo = i.Oportunidade.Titulo,
                    Instituicao = i.Oportunidade.Instituicao.Nome,
                    i.VoluntarioId,
                    VoluntarioNome = i.Voluntario.Usuario.Nome,
                    VoluntarioEmail = i.Voluntario.Usuario.Email,
                    Status = i.Status.ToString(),
                    i.MotivoReprovacao,
                    i.DataInsercao,
                    i.DataAtualizacao
                })
                .ToListAsync();

            var oportunidades = await _context.Oportunidades
                .AsNoTracking()
                .Include(o => o.Categoria)
                .Include(o => o.Instituicao)
                .Include(o => o.Inscricoes)
                .OrderByDescending(o => o.DataInsercao)
                .Select(o => new
                {
                    o.Id,
                    o.Titulo,
                    Tipo = o.Tipo.ToString(),
                    Status = o.Status.ToString(),
                    o.ImagemUrl,
                    Categoria = o.Categoria != null ? o.Categoria.Nome : null,
                    Instituicao = o.Instituicao.Nome,
                    o.Cidade,
                    o.Estado,
                    o.DataInicio,
                    o.DataFim,
                    o.Vagas,
                    VagasOcupadas = o.Inscricoes.Count(i => i.Status == InscricaoStatus.Pendente || i.Status == InscricaoStatus.Aprovada),
                    VagasDisponiveis = o.Vagas - o.Inscricoes.Count(i => i.Status == InscricaoStatus.Pendente || i.Status == InscricaoStatus.Aprovada)
                })
                .ToListAsync();

            var usuarios = await _context.Usuarios
                .AsNoTracking()
                .OrderByDescending(u => u.DataInsercao)
                .Select(u => new
                {
                    u.Id,
                    u.Nome,
                    u.Email,
                    Tipo = u.Tipo.ToString(),
                    u.Telefone,
                    u.Cidade,
                    u.Estado,
                    u.Ativo,
                    u.DataInsercao
                })
                .ToListAsync();

            var instituicoes = await _context.Instituicoes
                .AsNoTracking()
                .Include(i => i.Usuario)
                .OrderByDescending(i => i.DataInsercao)
                .Select(i => new
                {
                    i.Id,
                    i.Nome,
                    i.Responsavel,
                    Status = i.Status.ToString(),
                    i.UsuarioId,
                    Email = i.Usuario.Email,
                    i.DataInsercao
                })
                .ToListAsync();

            int CountStatus(InscricaoStatus status) =>
                inscricoesPorStatus.FirstOrDefault(i => i.Status == status)?.Total ?? 0;

            return Ok(new
            {
                Resumo = new
                {
                    Usuarios = await _context.Usuarios.CountAsync(),
                    Voluntarios = await _context.Voluntarios.CountAsync(),
                    Instituicoes = await _context.Instituicoes.CountAsync(),
                    Oportunidades = await _context.Oportunidades.CountAsync(),
                    Inscricoes = await _context.Inscricoes.CountAsync(),
                    Pendentes = CountStatus(InscricaoStatus.Pendente),
                    Aprovadas = CountStatus(InscricaoStatus.Aprovada),
                    Reprovadas = CountStatus(InscricaoStatus.Reprovada),
                    Concluidas = CountStatus(InscricaoStatus.Concluida)
                },
                Inscricoes = inscricoes,
                Oportunidades = oportunidades,
                Usuarios = usuarios,
                Instituicoes = instituicoes
            });
        }
    }
}
