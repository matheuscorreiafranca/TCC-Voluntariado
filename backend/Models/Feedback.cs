using System.ComponentModel.DataAnnotations;

namespace Voluntariado.Api.Models;

public class Feedback
{
    public long Id { get; set; }
    public long InscricaoId { get; set; }
    public AutorFeedback Autor { get; set; }
    public byte Nota { get; set; }

    [MaxLength(500)]
    public string? Comentario { get; set; }

    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    public Inscricao? Inscricao { get; set; }
}
