using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VoluntaMais.Api.Models
{
    public class Oportunidade : BaseEntity
    {
        public long InstituicaoId { get; set; }
        public Instituicao Instituicao { get; set; } = null!;

        public long? CategoriaId { get; set; }
        public Categoria? Categoria { get; set; }

        [Required]
        [MaxLength(180)]
        public string Titulo { get; set; } = string.Empty;

        public OportunidadeTipo Tipo { get; set; }

        public string? Descricao { get; set; }
        public string? ImagemUrl { get; set; }
        public string? Objetivo { get; set; }

        [MaxLength(100)]
        public string? Cidade { get; set; }

        [MaxLength(2)]
        public string? Estado { get; set; }

        public DateTime DataInicio { get; set; }
        public DateTime? DataFim { get; set; }

        public int Vagas { get; set; } = 1;

        public OportunidadeStatus Status { get; set; } = OportunidadeStatus.Pendente;
        public string? Requisitos { get; set; }

        [MaxLength(60)]
        public string? Turno { get; set; }

        [MaxLength(180)]
        public string? LocalDetalhado { get; set; }

        public bool AceitaSemFormacao { get; set; } = true;
        public bool PrecisaApoioCriancas { get; set; }

        public ICollection<Inscricao> Inscricoes { get; set; } = new List<Inscricao>();
    }

    public class Inscricao : BaseEntity
    {
        public long OportunidadeId { get; set; }
        public Oportunidade Oportunidade { get; set; } = null!;

        public long VoluntarioId { get; set; }
        public Voluntario Voluntario { get; set; } = null!;

        public InscricaoStatus Status { get; set; } = InscricaoStatus.Pendente;

        [MaxLength(500)]
        public string? MotivoReprovacao { get; set; }

        public ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();
    }

    public class Feedback : BaseEntity
    {
        public long InscricaoId { get; set; }
        public Inscricao Inscricao { get; set; } = null!;

        public FeedbackAutor Autor { get; set; }

        public byte Nota { get; set; }

        [MaxLength(500)]
        public string? Comentario { get; set; }
    }

    public class Notificacao : BaseEntity
    {
        public long UsuarioId { get; set; }
        public Usuario Usuario { get; set; } = null!;

        [Required]
        [MaxLength(180)]
        public string Titulo { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Mensagem { get; set; } = string.Empty;

        public bool Lida { get; set; } = false;
    }
}
