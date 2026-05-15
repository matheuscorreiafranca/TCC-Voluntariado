using System.ComponentModel.DataAnnotations;

namespace Voluntariado.Api.Models;

public class VoluntarioHabilidade
{
    public long Id { get; set; }
    public long VoluntarioId { get; set; }
    public long HabilidadeId { get; set; }

    [MaxLength(30)]
    public string NivelInteresse { get; set; } = "Interesse";

    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    public Voluntario? Voluntario { get; set; }
    public Habilidade? Habilidade { get; set; }
}
