using System.ComponentModel.DataAnnotations;

namespace Voluntariado.Api.Models;

public class Inscricao
{
    public long Id { get; set; }
    public long OportunidadeId { get; set; }
    public long VoluntarioId { get; set; }
    public StatusInscricao Status { get; set; } = StatusInscricao.Pendente;

    [MaxLength(500)]
    public string? MotivoReprovacao { get; set; }

    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    public DateTime? AtualizadoEm { get; set; }

    public Oportunidade? Oportunidade { get; set; }
    public Voluntario? Voluntario { get; set; }
    public ICollection<Feedback> Feedbacks { get; set; } = [];
}
