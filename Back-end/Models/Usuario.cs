using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VoluntaMais.Api.Models
{
    public class Usuario : BaseEntity
    {
        [Required]
        [MaxLength(150)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Senha { get; set; } = string.Empty;

        [MaxLength(30)]
        public string? Telefone { get; set; }

        [Required]
        public UsuarioTipo Tipo { get; set; }

        [MaxLength(100)]
        public string? Cidade { get; set; }

        [MaxLength(2)]
        public string? Estado { get; set; }

        public bool Ativo { get; set; } = true;
        public bool Anonimizado { get; set; } = false;

        // Navigation Properties
        public Instituicao? Instituicao { get; set; }
        public Voluntario? Voluntario { get; set; }
        public ICollection<Notificacao> Notificacoes { get; set; } = new List<Notificacao>();
    }
}
