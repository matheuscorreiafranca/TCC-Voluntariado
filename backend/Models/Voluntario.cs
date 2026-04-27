using System.ComponentModel.DataAnnotations;

namespace Voluntariado.Api.Models;

public class Voluntario
{
    public long Id { get; set; }
    public long UsuarioId { get; set; }
    public DateOnly? DataNascimento { get; set; }

    [MaxLength(30)]
    public string? Genero { get; set; }

    [MaxLength(255)]
    public string? Disponibilidade { get; set; }

    public string? Habilidades { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    public Usuario? Usuario { get; set; }
    public ICollection<Inscricao> Inscricoes { get; set; } = [];
}
