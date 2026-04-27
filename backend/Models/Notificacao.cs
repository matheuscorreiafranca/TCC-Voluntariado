using System.ComponentModel.DataAnnotations;

namespace Voluntariado.Api.Models;

public class Notificacao
{
    public long Id { get; set; }
    public long UsuarioId { get; set; }

    [MaxLength(180)]
    public string Titulo { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Mensagem { get; set; } = string.Empty;

    public bool Lida { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    public Usuario? Usuario { get; set; }
}
