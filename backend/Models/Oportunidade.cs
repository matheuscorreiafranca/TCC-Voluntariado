using System.ComponentModel.DataAnnotations;

namespace Voluntariado.Api.Models;

public class Oportunidade
{
    public long Id { get; set; }
    public long InstituicaoId { get; set; }
    public long? CategoriaId { get; set; }

    [MaxLength(180)]
    public string Titulo { get; set; } = string.Empty;

    public TipoOportunidade Tipo { get; set; }
    public string? Descricao { get; set; }
    public string? Objetivo { get; set; }

    [MaxLength(100)]
    public string? Cidade { get; set; }

    [MaxLength(2)]
    public string? Estado { get; set; }

    public DateTime DataInicio { get; set; }
    public DateTime? DataFim { get; set; }
    public int Vagas { get; set; } = 1;
    public StatusOportunidade Status { get; set; } = StatusOportunidade.Pendente;
    public string? Requisitos { get; set; }

    [MaxLength(60)]
    public string? Turno { get; set; }

    [MaxLength(180)]
    public string? LocalDetalhado { get; set; }

    public bool AceitaSemFormacao { get; set; } = true;
    public bool PrecisaApoioCriancas { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    public Instituicao? Instituicao { get; set; }
    public Categoria? Categoria { get; set; }
    public ICollection<Inscricao> Inscricoes { get; set; } = [];
}
