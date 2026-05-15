using System;
using System.ComponentModel.DataAnnotations;
using VoluntaMais.Api.Models;

namespace VoluntaMais.Api.DTOs
{
    public class OportunidadeCreateDto
    {
        [Required]
        public long InstituicaoId { get; set; }

        public long? CategoriaId { get; set; }

        [Required]
        [MaxLength(180)]
        public string Titulo { get; set; } = string.Empty;

        public OportunidadeTipo Tipo { get; set; } = OportunidadeTipo.Projeto;
        public string? Descricao { get; set; }
        public string? ImagemUrl { get; set; }
        public string? Objetivo { get; set; }
        public string? Cidade { get; set; }
        public string? Estado { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime? DataFim { get; set; }
        public int Vagas { get; set; } = 1;
        public string? Requisitos { get; set; }
        public string? Turno { get; set; }
        public string? LocalDetalhado { get; set; }
        public bool AceitaSemFormacao { get; set; } = true;
        public bool PrecisaApoioCriancas { get; set; }
    }

    public class InscricaoCreateDto
    {
        [Required]
        public long OportunidadeId { get; set; }

        [Required]
        public long VoluntarioId { get; set; }
    }

    public class ReprovarInscricaoDto
    {
        [MaxLength(500)]
        public string? MotivoReprovacao { get; set; }
    }
}
