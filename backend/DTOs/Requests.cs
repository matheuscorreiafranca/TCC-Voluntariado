using System.ComponentModel.DataAnnotations;
using Voluntariado.Api.Models;

namespace Voluntariado.Api.DTOs;

public record UsuarioCreateDto(
    [Required, MaxLength(150)] string Nome,
    [Required, EmailAddress, MaxLength(150)] string Email,
    [Required, MinLength(6), MaxLength(255)] string Senha,
    [Required] TipoUsuario Tipo,
    string? Telefone,
    string? Cidade,
    string? Estado
);

public record AuthLoginDto(
    [Required, EmailAddress, MaxLength(150)] string Email,
    [Required, MaxLength(255)] string Senha
);

public record InstituicaoCreateDto(
    [Required] long UsuarioId,
    [Required, MaxLength(180)] string Nome,
    string? Cnpj,
    string? Responsavel,
    string? Descricao
);

public record VoluntarioCreateDto(
    [Required] long UsuarioId,
    DateOnly? DataNascimento,
    string? Genero,
    string? Disponibilidade,
    string? Habilidades,
    string? Bio,
    string? Experiencia,
    string? Interesses,
    string? PreferenciasAcessibilidade,
    bool NecessitaAcessibilidade,
    bool AceitaContatoWhatsapp
);

public record VoluntarioCadastroDto(
    [Required, MaxLength(150)] string Nome,
    [Required, EmailAddress, MaxLength(150)] string Email,
    [Required, MinLength(6), MaxLength(255)] string Senha,
    string? Telefone,
    string? Cidade,
    string? Estado,
    DateOnly? DataNascimento,
    string? Genero,
    string? Disponibilidade,
    string? Habilidades,
    string? Bio,
    string? Experiencia,
    string? Interesses,
    string? PreferenciasAcessibilidade,
    bool NecessitaAcessibilidade,
    bool AceitaContatoWhatsapp
);

public record VoluntarioPerfilUpdateDto(
    string? Nome,
    string? Telefone,
    string? Cidade,
    string? Estado,
    string? Genero,
    string? Disponibilidade,
    string? Bio,
    string? Experiencia,
    string? Interesses,
    string? PreferenciasAcessibilidade,
    bool NecessitaAcessibilidade,
    bool AceitaContatoWhatsapp
);

public record VoluntarioHabilidadesUpdateDto(
    long[] HabilidadeIds,
    string? Interesses,
    string? HabilidadesTexto
);

public record OportunidadeCreateDto(
    [Required] long InstituicaoId,
    long? CategoriaId,
    [Required, MaxLength(180)] string Titulo,
    [Required] TipoOportunidade Tipo,
    string? Descricao,
    string? Objetivo,
    string? Cidade,
    string? Estado,
    [Required] DateTime DataInicio,
    DateTime? DataFim,
    int Vagas,
    StatusOportunidade? Status,
    string? Requisitos,
    string? Turno,
    string? LocalDetalhado,
    bool AceitaSemFormacao,
    bool PrecisaApoioCriancas
);

public record InscricaoCreateDto(
    [Required] long OportunidadeId,
    [Required] long VoluntarioId
);

public record ReprovarInscricaoDto(string? MotivoReprovacao);

public record FeedbackCreateDto(
    [Required] long InscricaoId,
    [Required] AutorFeedback Autor,
    [Range(1, 5)] byte Nota,
    string? Comentario
);
