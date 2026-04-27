using System.ComponentModel.DataAnnotations;

namespace Voluntariado.Api.Models;

public class PalavraBloqueada
{
    public long Id { get; set; }

    [MaxLength(120)]
    public string Palavra { get; set; } = string.Empty;

    public bool Ativo { get; set; } = true;
}
