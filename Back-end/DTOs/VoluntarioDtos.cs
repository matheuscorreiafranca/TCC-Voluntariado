using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VoluntaMais.Api.DTOs
{
    // DTO para cadastro de voluntário (Request)
    public class CadastroVoluntarioDto
    {
        // Dados do Usuário
        [Required(ErrorMessage = "Nome é obrigatório.")]
        [MaxLength(150)]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "CPF é obrigatório.")]
        [MaxLength(14)]
        public string Cpf { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email é obrigatório.")]
        [EmailAddress(ErrorMessage = "Email inválido.")]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(30)]
        public string? Telefone { get; set; }

        [Required(ErrorMessage = "Senha é obrigatória.")]
        [MinLength(6, ErrorMessage = "Senha deve ter no mínimo 6 caracteres.")]
        public string Senha { get; set; } = string.Empty;

        // Dados do Voluntário
        public DateTime? DataNascimento { get; set; }

        [MaxLength(30)]
        public string? Genero { get; set; }

        [MaxLength(50)]
        public string? Etnia { get; set; }

        [MaxLength(255)]
        public string? Disponibilidade { get; set; }

        public string? Habilidades { get; set; }

        [MaxLength(100)]
        public string? Cidade { get; set; }

        [MaxLength(2)]
        public string? Estado { get; set; }

        // Formações / Ocupações (lista)
        public List<FormacaoDto>? Formacoes { get; set; }

        // Áreas de Afinidade (lista de IDs de Categorias)
        public List<long>? AreasAfinidadeIds { get; set; }
    }

    public class FormacaoDto
    {
        [Required(ErrorMessage = "Nome da formação/ocupação é obrigatório.")]
        [MaxLength(150)]
        public string Nome { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? Instituicao { get; set; }

        public int? AnoConclusao { get; set; }

        [Required]
        [MaxLength(50)]
        public string Tipo { get; set; } = "Formacao"; // "Formacao" ou "Ocupacao"
    }

    // DTO de resposta do voluntário
    public class VoluntarioResponseDto
    {
        public long Id { get; set; }
        public long UsuarioId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Cpf { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Telefone { get; set; }
        public DateTime? DataNascimento { get; set; }
        public string? Genero { get; set; }
        public string? Etnia { get; set; }
        public string? Disponibilidade { get; set; }
        public string? Habilidades { get; set; }
        public string? Cidade { get; set; }
        public string? Estado { get; set; }
        public bool Ativo { get; set; }
        public bool Anonimizado { get; set; }
        public DateTime DataInsercao { get; set; }
        public List<FormacaoResponseDto> Formacoes { get; set; } = new();
        public List<CategoriaResponseDto> AreasAfinidade { get; set; } = new();
    }

    public class FormacaoResponseDto
    {
        public long Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Instituicao { get; set; }
        public int? AnoConclusao { get; set; }
        public string Tipo { get; set; } = string.Empty;
    }

    public class CategoriaResponseDto
    {
        public long Id { get; set; }
        public string Nome { get; set; } = string.Empty;
    }
}
