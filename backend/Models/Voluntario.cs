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
    public string? Bio { get; set; }
    public string? Experiencia { get; set; }
    public string? Interesses { get; set; }
    public string? PreferenciasAcessibilidade { get; set; }
    public bool NecessitaAcessibilidade { get; set; }
    public bool AceitaContatoWhatsapp { get; set; } = true;
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    public DateTime? AtualizadoEm { get; set; }

    public Usuario? Usuario { get; set; }
    public ICollection<Inscricao> Inscricoes { get; set; } = [];
    public ICollection<VoluntarioHabilidade> VoluntarioHabilidades { get; set; } = [];
}
