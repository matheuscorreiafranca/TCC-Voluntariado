using System.ComponentModel.DataAnnotations;

namespace Voluntariado.Api.Models;

public class Categoria
{
    public long Id { get; set; }

    [MaxLength(120)]
    public string Nome { get; set; } = string.Empty;

    public ICollection<Oportunidade> Oportunidades { get; set; } = [];
}
