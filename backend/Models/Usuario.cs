using System.ComponentModel.DataAnnotations;

namespace Voluntariado.Api.Models;

public class Usuario
{
    public long Id { get; set; }

    [MaxLength(150)]
    public string Nome { get; set; } = string.Empty;

    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(255)]
    public string Senha { get; set; } = string.Empty;

    [MaxLength(30)]
    public string? Telefone { get; set; }

    public TipoUsuario Tipo { get; set; }

    [MaxLength(100)]
    public string? Cidade { get; set; }

    [MaxLength(2)]
    public string? Estado { get; set; }

    public bool Ativo { get; set; } = true;
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    public Instituicao? Instituicao { get; set; }
    public Voluntario? Voluntario { get; set; }
    public ICollection<Notificacao> Notificacoes { get; set; } = [];
}
