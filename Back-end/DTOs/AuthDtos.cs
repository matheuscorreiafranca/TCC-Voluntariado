using System.ComponentModel.DataAnnotations;
using VoluntaMais.Api.Models;

namespace VoluntaMais.Api.DTOs
{
    public class LoginDto
    {
        [Required]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Senha { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public long UsuarioId { get; set; }
        public long? VoluntarioId { get; set; }
        public long? InstituicaoId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty;
    }

    public class ResetPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string NovaSenha { get; set; } = string.Empty;
    }
}
