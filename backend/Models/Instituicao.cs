using System.ComponentModel.DataAnnotations;

namespace Voluntariado.Api.Models;

public class Instituicao
{
    public long Id { get; set; }
    public long UsuarioId { get; set; }

    [MaxLength(180)]
    public string Nome { get; set; } = string.Empty;

    [MaxLength(30)]
    public string? Cnpj { get; set; }

    [MaxLength(150)]
    public string? Responsavel { get; set; }

    public string? Descricao { get; set; }
    public StatusInstituicao Status { get; set; } = StatusInstituicao.Pendente;
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    public Usuario? Usuario { get; set; }
    public ICollection<Oportunidade> Oportunidades { get; set; } = [];
}
