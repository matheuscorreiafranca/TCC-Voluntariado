using System.Linq;
using System.Threading.Tasks;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VoluntaMais.Api.Data;
using VoluntaMais.Api.DTOs;
using VoluntaMais.Api.Models;
using VoluntaMais.Api.Services;

namespace VoluntaMais.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class VoluntarioController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AuthService _authService;

        public VoluntarioController(AppDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        /// <summary>
        /// Cadastro de novo voluntário (público).
        /// </summary>
        [HttpPost("cadastro")]
        public async Task<IActionResult> Cadastrar([FromBody] CadastroVoluntarioDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Verificar duplicidade de email
            var emailExiste = await _context.Usuarios.AnyAsync(u => u.Email == dto.Email);
            if (emailExiste)
                return Conflict(new { message = "Já existe um usuário com este email." });

            // Criar o Usuário
            var usuario = new Usuario
            {
                Nome = dto.Nome,
                Email = dto.Email,
                Senha = _authService.HashPassword(dto.Senha),
                Telefone = dto.Telefone,
                Tipo = UsuarioTipo.Voluntario,
                Cidade = dto.Cidade,
                Estado = dto.Estado
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            // Criar o Voluntário vinculado ao Usuário
            var voluntario = new Voluntario
            {
                UsuarioId = usuario.Id,
                DataNascimento = dto.DataNascimento,
                Genero = dto.Genero,
                Disponibilidade = dto.Disponibilidade,
                Habilidades = dto.Habilidades
            };

            _context.Voluntarios.Add(voluntario);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(ObterPorId), new { id = voluntario.Id }, new { message = "Voluntário cadastrado com sucesso.", voluntarioId = voluntario.Id });
        }

        /// <summary>
        /// Obter dados de um voluntário por ID.
        /// </summary>
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> ObterPorId(long id)
        {
            var voluntario = await _context.Voluntarios
                .Include(v => v.Usuario)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (voluntario == null)
                return NotFound(new { message = "Voluntário não encontrado." });

            // Respeitar anonimização
            var response = new VoluntarioResponseDto
            {
                Id = voluntario.Id,
                UsuarioId = voluntario.UsuarioId,
                Nome = voluntario.Usuario.Anonimizado ? "Anônimo" : voluntario.Usuario.Nome,
                Cpf = voluntario.Usuario.Anonimizado ? "***.***.***-**" : (voluntario.Cpf ?? ""),
                Email = voluntario.Usuario.Anonimizado ? "***@***.***" : voluntario.Usuario.Email,
                Telefone = voluntario.Usuario.Anonimizado ? null : voluntario.Usuario.Telefone,
                DataNascimento = voluntario.DataNascimento,
                Genero = voluntario.Genero,
                Disponibilidade = voluntario.Disponibilidade,
                Habilidades = voluntario.Habilidades,
                Cidade = voluntario.Usuario.Cidade,
                Estado = voluntario.Usuario.Estado,
                Ativo = voluntario.Usuario.Ativo,
                Anonimizado = voluntario.Usuario.Anonimizado,
                DataInsercao = voluntario.DataInsercao,
                Formacoes = new(),
                AreasAfinidade = new()
            };

            return Ok(response);
        }

        /// <summary>
        /// Obter o dashboard do voluntário autenticado.
        /// </summary>
        [Authorize]
        [HttpGet("dashboard")]
        public async Task<IActionResult> Dashboard()
        {
            var usuarioIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value 
                            ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            
            if (string.IsNullOrEmpty(usuarioIdStr) || !long.TryParse(usuarioIdStr, out long usuarioId))
            {
                return Unauthorized(new { message = "Usuário não autenticado." });
            }

            var voluntario = await _context.Voluntarios
                .Include(v => v.Inscricoes)
                .ThenInclude(i => i.Oportunidade)
                .ThenInclude(o => o.Instituicao)
                .FirstOrDefaultAsync(v => v.UsuarioId == usuarioId);

            if (voluntario == null)
            {
                return NotFound(new { message = "Perfil de voluntário não encontrado." });
            }

            var inscricoesList = voluntario.Inscricoes
                .OrderByDescending(i => i.DataInsercao)
                .Select(i => new
                {
                    i.Id,
                    i.OportunidadeId,
                    OportunidadeTitulo = i.Oportunidade.Titulo,
                    InstituicaoNome = i.Oportunidade.Instituicao.Nome,
                    Status = i.Status.ToString(),
                    DataInscricao = i.DataInsercao,
                    DataAtualizacao = i.DataAtualizacao,
                    i.Motivacao,
                    i.Experiencia,
                    i.Disponibilidade,
                    i.MotivoReprovacao,
                    i.CertificadoGerado,
                    i.HorasComprovadas,
                    Oportunidade = new
                    {
                        i.Oportunidade.Id,
                        i.Oportunidade.Titulo,
                        i.Oportunidade.Descricao,
                        i.Oportunidade.DataInicio,
                        i.Oportunidade.DataFim,
                        i.Oportunidade.Cidade,
                        i.Oportunidade.Estado,
                        i.Oportunidade.ImagemUrl,
                        Tipo = i.Oportunidade.Tipo.ToString(),
                        InstituicaoNome = i.Oportunidade.Instituicao.Nome
                    }
                }).Cast<object>().ToList();

            var dashboardDto = new VoluntarioDashboardDto
            {
                HorasVoluntarias = voluntario.Inscricoes
                    .Where(i => i.Status == InscricaoStatus.Concluida && i.HorasComprovadas.HasValue)
                    .Sum(i => i.HorasComprovadas!.Value),
                Certificados = voluntario.Inscricoes.Count(i => i.CertificadoGerado),
                InscricoesAtivas = voluntario.Inscricoes.Count(i => i.Status == InscricaoStatus.Aprovada || i.Status == InscricaoStatus.Pendente),
                Inscricoes = inscricoesList
            };

            return Ok(dashboardDto);
        }

        /// <summary>
        /// Listar todos os voluntários (apenas admin/superadmin).
        /// </summary>
        [Authorize(Roles = "Superadmin,Instituicao")]
        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var voluntarios = await _context.Voluntarios
                .Include(v => v.Usuario)
                .ToListAsync();

            var response = voluntarios.Select(v => new VoluntarioResponseDto
            {
                Id = v.Id,
                UsuarioId = v.UsuarioId,
                Nome = v.Usuario.Anonimizado ? "Anônimo" : v.Usuario.Nome,
                Cpf = v.Usuario.Anonimizado ? "***.***.***-**" : (v.Cpf ?? ""),
                Email = v.Usuario.Anonimizado ? "***@***.***" : v.Usuario.Email,
                Telefone = v.Usuario.Anonimizado ? null : v.Usuario.Telefone,
                DataNascimento = v.DataNascimento,
                Genero = v.Genero,
                Disponibilidade = v.Disponibilidade,
                Habilidades = v.Habilidades,
                Cidade = v.Usuario.Cidade,
                Estado = v.Usuario.Estado,
                Ativo = v.Usuario.Ativo,
                Anonimizado = v.Usuario.Anonimizado,
                DataInsercao = v.DataInsercao,
                Formacoes = new(),
                AreasAfinidade = new()
            }).ToList();

            return Ok(response);
        }

        /// <summary>
        /// Bloquear/Desbloquear voluntário (apenas superadmin).
        /// </summary>
        [Authorize(Roles = "Superadmin")]
        [HttpPatch("{id}/bloquear")]
        public async Task<IActionResult> AlternarBloqueio(long id)
        {
            var voluntario = await _context.Voluntarios
                .Include(v => v.Usuario)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (voluntario == null)
                return NotFound(new { message = "Voluntário não encontrado." });

            voluntario.Usuario.Ativo = !voluntario.Usuario.Ativo;
            await _context.SaveChangesAsync();

            var status = voluntario.Usuario.Ativo ? "desbloqueado" : "bloqueado";
            return Ok(new { message = $"Voluntário {status} com sucesso." });
        }

        /// <summary>
        /// Anonimizar dados sensíveis do voluntário (LGPD).
        /// </summary>
        [Authorize(Roles = "Superadmin")]
        [HttpPatch("{id}/anonimizar")]
        public async Task<IActionResult> Anonimizar(long id)
        {
            var voluntario = await _context.Voluntarios
                .Include(v => v.Usuario)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (voluntario == null)
                return NotFound(new { message = "Voluntário não encontrado." });

            voluntario.Usuario.Anonimizado = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Dados do voluntário anonimizados com sucesso." });
        }
        [HttpDelete("me")]
        public async Task<IActionResult> DeleteMyAccount()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int usuarioId))
            {
                return Unauthorized();
            }

            var usuario = await _context.Usuarios.FindAsync(usuarioId);
            if (usuario == null)
            {
                return NotFound(new { message = "Usuário não encontrado." });
            }

            usuario.DataExclusao = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Conta agendada para exclusão. Ela será removida permanentemente em 30 dias." });
        }
    }
}
