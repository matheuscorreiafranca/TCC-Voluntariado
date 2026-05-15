using System.ComponentModel.DataAnnotations;

namespace Voluntariado.Api.Models;

public class Habilidade
{
    public long Id { get; set; }

    [MaxLength(120)]
    public string Nome { get; set; } = string.Empty;

    public ICollection<VoluntarioHabilidade> VoluntarioHabilidades { get; set; } = [];
}
