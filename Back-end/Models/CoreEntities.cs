using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VoluntaMais.Api.Models
{
    public class Instituicao : BaseEntity
    {
        public long UsuarioId { get; set; }
        public Usuario Usuario { get; set; } = null!;

        [Required]
        [MaxLength(180)]
        public string Nome { get; set; } = string.Empty;

        [MaxLength(30)]
        public string? Cnpj { get; set; }

        [MaxLength(150)]
        public string? Responsavel { get; set; }

        public string? Descricao { get; set; }

        public InstituicaoStatus Status { get; set; } = InstituicaoStatus.Pendente;

        public ICollection<Oportunidade> Oportunidades { get; set; } = new List<Oportunidade>();
    }

    public class Voluntario : BaseEntity
    {
        public long UsuarioId { get; set; }
        public Usuario Usuario { get; set; } = null!;

        public DateTime? DataNascimento { get; set; }

        [MaxLength(30)]
        public string? Genero { get; set; }

        [MaxLength(255)]
        public string? Disponibilidade { get; set; }

        [MaxLength(14)]
        public string? Cpf { get; set; }

        [MaxLength(50)]
        public string? Etnia { get; set; }

        public string? Habilidades { get; set; }
        public string? Bio { get; set; }
        public string? Experiencia { get; set; }
        public string? Interesses { get; set; }
        public string? PreferenciasAcessibilidade { get; set; }
        public bool NecessitaAcessibilidade { get; set; }
        public bool AceitaContatoWhatsapp { get; set; } = true;

        public ICollection<Inscricao> Inscricoes { get; set; } = new List<Inscricao>();
        public ICollection<VoluntarioFormacao> Formacoes { get; set; } = new List<VoluntarioFormacao>();
        public ICollection<Categoria> AreasAfinidade { get; set; } = new List<Categoria>();
    }

    public class VoluntarioFormacao : BaseEntity
    {
        public long VoluntarioId { get; set; }
        public Voluntario Voluntario { get; set; } = null!;

        [Required]
        [MaxLength(150)]
        public string Nome { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? Instituicao { get; set; }

        public int? AnoConclusao { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Tipo { get; set; } = "Formacao"; // "Formacao" ou "Ocupacao"
    }

    public class Categoria : BaseEntity
    {
        [Required]
        [MaxLength(120)]
        public string Nome { get; set; } = string.Empty;

        public ICollection<Oportunidade> Oportunidades { get; set; } = new List<Oportunidade>();
        public ICollection<Voluntario> Voluntarios { get; set; } = new List<Voluntario>();
    }

    public class Habilidade : BaseEntity
    {
        [Required]
        [MaxLength(120)]
        public string Nome { get; set; } = string.Empty;
    }

    public class PalavraBloqueada : BaseEntity
    {
        [Required]
        [MaxLength(120)]
        public string Palavra { get; set; } = string.Empty;

        public bool Ativo { get; set; } = true;
    }

    public class Ocupacao : BaseEntity
    {
        [Required]
        [MaxLength(120)]
        public string Nome { get; set; } = string.Empty;
    }
}
