using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using VoluntaMais.Api.Data;
using VoluntaMais.Api.DTOs;
using VoluntaMais.Api.Models;

namespace VoluntaMais.Api.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool VerifyPassword(string password, string hash)
        {
            if (hash.StartsWith("$2", StringComparison.Ordinal))
            {
                return BCrypt.Net.BCrypt.Verify(password, hash);
            }

            return string.Equals(password, hash, StringComparison.Ordinal);
        }

        public string GenerateJwtToken(Usuario usuario)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var jwtKey = jwtSettings["Key"] ?? throw new InvalidOperationException("Jwt__Key is required.");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.Tipo.ToString()),
                new Claim("Nome", usuario.Nome)
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(int.Parse(jwtSettings["ExpireHours"] ?? "12")),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public async Task<AuthResponseDto?> AuthenticateAsync(string email, string password)
        {
            var user = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == email && u.Ativo);

            if (user == null || !VerifyPassword(password, user.Senha))
            {
                return null;
            }

            var voluntarioId = await _context.Voluntarios
                .Where(v => v.UsuarioId == user.Id)
                .Select(v => (long?)v.Id)
                .FirstOrDefaultAsync();

            var instituicaoId = await _context.Instituicoes
                .Where(i => i.UsuarioId == user.Id)
                .Select(i => (long?)i.Id)
                .FirstOrDefaultAsync();

            return new AuthResponseDto
            {
                Token = GenerateJwtToken(user),
                UsuarioId = user.Id,
                VoluntarioId = voluntarioId,
                InstituicaoId = instituicaoId,
                Nome = user.Nome,
                Email = user.Email,
                Tipo = user.Tipo.ToString()
            };
        }
    }
}
