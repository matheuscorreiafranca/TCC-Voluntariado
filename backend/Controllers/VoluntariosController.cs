using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voluntariado.Api.Data;
using Voluntariado.Api.DTOs;
using Voluntariado.Api.Models;

namespace Voluntariado.Api.Controllers;

[ApiController]
[Route("voluntarios")]
public class VoluntariosController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Voluntario>>> Get()
    {
        return Ok(await db.Voluntarios
            .AsNoTracking()
            .Include(x => x.Usuario)
            .Include(x => x.VoluntarioHabilidades).ThenInclude(x => x.Habilidade)
            .OrderByDescending(x => x.Id)
            .ToListAsync());
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<Voluntario>> GetById(long id)
    {
        var voluntario = await db.Voluntarios
            .AsNoTracking()
            .Include(x => x.Usuario)
            .Include(x => x.VoluntarioHabilidades).ThenInclude(x => x.Habilidade)
            .FirstOrDefaultAsync(x => x.Id == id);

        return voluntario is null ? NotFound() : Ok(voluntario);
    }

    [HttpPost]
    public async Task<ActionResult<Voluntario>> Post(VoluntarioCreateDto dto)
    {
        var usuario = await db.Usuarios.FindAsync(dto.UsuarioId);

        if (usuario is null || usuario.Tipo != TipoUsuario.Voluntario)
        {
            return BadRequest(new { message = "Informe um usuário do tipo Voluntario." });
        }

        if (await db.Voluntarios.AnyAsync(x => x.UsuarioId == dto.UsuarioId))
        {
            return Conflict(new { message = "Este usuário já possui um cadastro de voluntário." });
        }

        var voluntario = new Voluntario
        {
            UsuarioId = dto.UsuarioId,
            DataNascimento = dto.DataNascimento,
            Genero = dto.Genero,
            Disponibilidade = dto.Disponibilidade,
            Habilidades = dto.Habilidades,
            Bio = dto.Bio,
            Experiencia = dto.Experiencia,
            Interesses = dto.Interesses,
            PreferenciasAcessibilidade = dto.PreferenciasAcessibilidade,
            NecessitaAcessibilidade = dto.NecessitaAcessibilidade,
            AceitaContatoWhatsapp = dto.AceitaContatoWhatsapp
        };

        db.Voluntarios.Add(voluntario);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = voluntario.Id }, voluntario);
    }

    [HttpPost("cadastro")]
    public async Task<IActionResult> Cadastro(VoluntarioCadastroDto dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();
        await using var transaction = await db.Database.BeginTransactionAsync();

        var usuario = await db.Usuarios
            .Include(x => x.Voluntario)
            .FirstOrDefaultAsync(x => x.Email == email);

        if (usuario is not null && usuario.Tipo != TipoUsuario.Voluntario)
        {
            return Conflict(new { message = "Este e-mail já pertence a outro tipo de usuário." });
        }

        if (usuario?.Voluntario is not null)
        {
            return Conflict(new { message = "Este e-mail já possui cadastro de voluntário. Use o login para acessar o portal." });
        }

        if (usuario is null)
        {
            usuario = new Usuario
            {
                Nome = dto.Nome.Trim(),
                Email = email,
                Senha = dto.Senha,
                Tipo = TipoUsuario.Voluntario,
                Telefone = dto.Telefone,
                Cidade = dto.Cidade,
                Estado = dto.Estado?.ToUpperInvariant()
            };
            db.Usuarios.Add(usuario);
            await db.SaveChangesAsync();
        }

        var voluntario = new Voluntario
        {
            UsuarioId = usuario.Id,
            DataNascimento = dto.DataNascimento,
            Genero = dto.Genero,
            Disponibilidade = dto.Disponibilidade,
            Habilidades = dto.Habilidades,
            Bio = dto.Bio,
            Experiencia = dto.Experiencia,
            Interesses = dto.Interesses,
            PreferenciasAcessibilidade = dto.PreferenciasAcessibilidade,
            NecessitaAcessibilidade = dto.NecessitaAcessibilidade,
            AceitaContatoWhatsapp = dto.AceitaContatoWhatsapp
        };

        db.Voluntarios.Add(voluntario);
        await db.SaveChangesAsync();
        await transaction.CommitAsync();

        var result = await db.Voluntarios
            .AsNoTracking()
            .Include(x => x.Usuario)
            .FirstAsync(x => x.Id == voluntario.Id);

        return CreatedAtAction(nameof(GetById), new { id = result.Id }, new { usuario = result.Usuario, voluntario = result });
    }

    [HttpGet("{id:long}/portal")]
    public async Task<IActionResult> Portal(long id)
    {
        var voluntario = await db.Voluntarios
            .AsNoTracking()
            .Include(x => x.Usuario)
            .Include(x => x.VoluntarioHabilidades).ThenInclude(x => x.Habilidade)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (voluntario is null)
        {
            return NotFound(new { message = "Voluntário não encontrado." });
        }

        var inscricoes = await db.Inscricoes
            .AsNoTracking()
            .Include(x => x.Oportunidade!).ThenInclude(x => x.Categoria)
            .Include(x => x.Oportunidade!).ThenInclude(x => x.Instituicao)
            .Where(x => x.VoluntarioId == id)
            .OrderByDescending(x => x.Id)
            .ToListAsync();

        var notificacoes = await db.Notificacoes
            .AsNoTracking()
            .Where(x => x.UsuarioId == voluntario.UsuarioId)
            .OrderByDescending(x => x.Id)
            .Take(8)
            .ToListAsync();

        var feedbacks = await db.Feedbacks
            .AsNoTracking()
            .Include(x => x.Inscricao!).ThenInclude(x => x.Oportunidade)
            .Where(x => x.Inscricao != null && x.Inscricao.VoluntarioId == id)
            .OrderByDescending(x => x.Id)
            .Take(8)
            .ToListAsync();

        var recomendacoes = await BuildRecomendacoes(id, 6);
        var aprovadas = inscricoes.Count(x => x.Status == StatusInscricao.Aprovada);
        var concluidas = inscricoes.Count(x => x.Status == StatusInscricao.Concluida);

        return Ok(new
        {
            voluntario,
            metricas = new
            {
                inscricoes = inscricoes.Count,
                pendentes = inscricoes.Count(x => x.Status == StatusInscricao.Pendente),
                aprovadas,
                concluidas,
                horasEstimadas = concluidas * 4 + aprovadas * 2
            },
            inscricoes,
            recomendacoes,
            notificacoes,
            feedbacks
        });
    }

    [HttpPatch("{id:long}/perfil")]
    public async Task<ActionResult<Voluntario>> AtualizarPerfil(long id, VoluntarioPerfilUpdateDto dto)
    {
        var voluntario = await db.Voluntarios.Include(x => x.Usuario).FirstOrDefaultAsync(x => x.Id == id);

        if (voluntario is null)
        {
            return NotFound(new { message = "Voluntário não encontrado." });
        }

        if (voluntario.Usuario is not null)
        {
            voluntario.Usuario.Nome = string.IsNullOrWhiteSpace(dto.Nome) ? voluntario.Usuario.Nome : dto.Nome.Trim();
            voluntario.Usuario.Telefone = dto.Telefone;
            voluntario.Usuario.Cidade = dto.Cidade;
            voluntario.Usuario.Estado = dto.Estado?.ToUpperInvariant();
        }

        voluntario.Genero = dto.Genero;
        voluntario.Disponibilidade = dto.Disponibilidade;
        voluntario.Bio = dto.Bio;
        voluntario.Experiencia = dto.Experiencia;
        voluntario.Interesses = dto.Interesses;
        voluntario.PreferenciasAcessibilidade = dto.PreferenciasAcessibilidade;
        voluntario.NecessitaAcessibilidade = dto.NecessitaAcessibilidade;
        voluntario.AceitaContatoWhatsapp = dto.AceitaContatoWhatsapp;
        voluntario.AtualizadoEm = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return Ok(voluntario);
    }

    [HttpGet("{id:long}/habilidades")]
    public async Task<IActionResult> GetHabilidades(long id)
    {
        if (!await db.Voluntarios.AnyAsync(x => x.Id == id))
        {
            return NotFound(new { message = "Voluntário não encontrado." });
        }

        var todas = await db.Habilidades.AsNoTracking().OrderBy(x => x.Nome).ToListAsync();
        var selecionadas = await db.VoluntarioHabilidades
            .AsNoTracking()
            .Include(x => x.Habilidade)
            .Where(x => x.VoluntarioId == id)
            .OrderBy(x => x.Habilidade!.Nome)
            .ToListAsync();

        return Ok(new { todas, selecionadas });
    }

    [HttpPut("{id:long}/habilidades")]
    public async Task<IActionResult> PutHabilidades(long id, VoluntarioHabilidadesUpdateDto dto)
    {
        var voluntario = await db.Voluntarios.FirstOrDefaultAsync(x => x.Id == id);
        if (voluntario is null)
        {
            return NotFound(new { message = "Voluntário não encontrado." });
        }

        var habilidadeIds = dto.HabilidadeIds.Distinct().ToArray();
        var validas = await db.Habilidades
            .Where(x => habilidadeIds.Contains(x.Id))
            .Select(x => x.Id)
            .ToListAsync();

        var atuais = db.VoluntarioHabilidades.Where(x => x.VoluntarioId == id);
        db.VoluntarioHabilidades.RemoveRange(atuais);

        foreach (var habilidadeId in validas)
        {
            db.VoluntarioHabilidades.Add(new VoluntarioHabilidade
            {
                VoluntarioId = id,
                HabilidadeId = habilidadeId,
                NivelInteresse = "Interesse"
            });
        }

        voluntario.Interesses = dto.Interesses;
        voluntario.Habilidades = dto.HabilidadesTexto;
        voluntario.AtualizadoEm = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return Ok(new { message = "Habilidades atualizadas." });
    }

    [HttpGet("{id:long}/recomendacoes")]
    public async Task<IActionResult> Recomendacoes(long id)
    {
        if (!await db.Voluntarios.AnyAsync(x => x.Id == id))
        {
            return NotFound(new { message = "Voluntário não encontrado." });
        }

        return Ok(await BuildRecomendacoes(id, 12));
    }

    private async Task<List<object>> BuildRecomendacoes(long voluntarioId, int limit)
    {
        var voluntario = await db.Voluntarios
            .AsNoTracking()
            .Include(x => x.VoluntarioHabilidades).ThenInclude(x => x.Habilidade)
            .FirstAsync(x => x.Id == voluntarioId);

        var termos = new List<string>();
        termos.AddRange(voluntario.VoluntarioHabilidades.Select(x => x.Habilidade?.Nome ?? ""));
        termos.AddRange((voluntario.Habilidades ?? "").Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries));
        termos.AddRange((voluntario.Interesses ?? "").Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries));
        termos = termos.Where(x => !string.IsNullOrWhiteSpace(x)).Select(x => x.ToLowerInvariant()).Distinct().ToList();

        var inscritas = await db.Inscricoes
            .Where(x => x.VoluntarioId == voluntarioId)
            .Select(x => x.OportunidadeId)
            .ToListAsync();

        var oportunidades = await db.Oportunidades
            .AsNoTracking()
            .Include(x => x.Categoria)
            .Include(x => x.Instituicao)
            .Include(x => x.Inscricoes)
            .Where(x => x.InstituicaoId == 6 && !inscritas.Contains(x.Id) && x.Status != StatusOportunidade.Encerrada)
            .OrderBy(x => x.DataInicio)
            .ToListAsync();

        return oportunidades
            .Select(x =>
            {
                var texto = $"{x.Titulo} {x.Descricao} {x.Objetivo} {x.Requisitos} {x.Categoria?.Nome}".ToLowerInvariant();
                var score = termos.Count(t => texto.Contains(t));
                if (x.AceitaSemFormacao) score += 1;
                if (x.PrecisaApoioCriancas && texto.Contains("criança")) score += 1;

                return new
                {
                    oportunidade = x,
                    score,
                    motivo = score > 1 ? "Compatível com seu perfil e interesses" : "Aberta para novos voluntários"
                };
            })
            .OrderByDescending(x => x.score)
            .ThenBy(x => x.oportunidade.DataInicio)
            .Take(limit)
            .Cast<object>()
            .ToList();
    }
}
