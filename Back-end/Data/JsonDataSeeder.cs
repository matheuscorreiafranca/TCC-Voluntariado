using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using VoluntaMais.Api.Models;

namespace VoluntaMais.Api.Data
{
    public static class JsonDataSeeder
    {
        private const string LegacyInvalidPasswordHash = "$2a$11$HLrYDyJiYOV13E.I4jjD8eN4hKfS7qRXNedp19zYh72iaU.qDSe56";
        private const string DefaultPasswordHash = "$2a$11$q1XSDJeu4Dies.apWitrWeqMJz//7NT6dytA.1.BuuftTXiUgc.36";
        private static readonly HashSet<string> AllowedOpportunityTitles = new(StringComparer.OrdinalIgnoreCase)
        {
            "Programa de Protagonismo da Pessoa com Deficiência",
            "Encontro de Acolhimento para Mães Atípicas",
            "Vivência de Inclusão para Crianças com Deficiência",
            "Projeto Tecendo Projetos Inclusivos"
        };

        public static async Task SeedAsync(AppDbContext db, IWebHostEnvironment env)
        {
            await NormalizeDemoPasswordsAsync(db);

            var path = Path.Combine(env.ContentRootPath, "Data", "SeedData", "oportunidades.json");
            if (!File.Exists(path))
            {
                return;
            }

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var json = await File.ReadAllTextAsync(path);
            var items = JsonSerializer.Deserialize<List<OportunidadeSeedItem>>(json, options) ?? new();
            if (items.Count == 0)
            {
                return;
            }

            var instituicao = await EnsureInstituicaoAsync(db);

            foreach (var item in items)
            {
                if (!AllowedOpportunityTitles.Contains(item.Title))
                {
                    continue;
                }

                var categoria = await EnsureCategoriaAsync(db, item.Category);
                var (cidade, estado) = SplitLocation(item.Location);

                var oportunidade = await db.Oportunidades
                    .IgnoreQueryFilters()
                    .FirstOrDefaultAsync(o => o.Titulo == item.Title && o.InstituicaoId == instituicao.Id);

                if (oportunidade is null)
                {
                    oportunidade = new Oportunidade
                    {
                        InstituicaoId = instituicao.Id,
                        Titulo = item.Title
                    };
                    db.Oportunidades.Add(oportunidade);
                }

                oportunidade.CategoriaId = categoria.Id;
                oportunidade.Tipo = InferTipo(item.Category);
                oportunidade.Descricao = item.Descricao;
                oportunidade.Objetivo = BuildObjetivo(item);
                oportunidade.Cidade = cidade;
                oportunidade.Estado = estado;
                oportunidade.DataInicio = new DateTime(2026, 5, 15, 0, 0, 0, DateTimeKind.Utc).AddDays(item.Id - 1);
                oportunidade.DataFim = oportunidade.DataInicio.AddDays(30);
                oportunidade.Vagas = Math.Max(1, item.VagasTotal);
                oportunidade.Status = OportunidadeStatus.Ativa;
                oportunidade.Excluido = false;
            }

            await db.SaveChangesAsync();
        }

        private static async Task NormalizeDemoPasswordsAsync(AppDbContext db)
        {
            var usuarios = await db.Usuarios
                .Where(u => u.Senha == LegacyInvalidPasswordHash)
                .ToListAsync();

            if (usuarios.Count == 0)
            {
                return;
            }

            foreach (var usuario in usuarios)
            {
                usuario.Senha = DefaultPasswordHash;
            }

            await db.SaveChangesAsync();
        }

        private static async Task<Instituicao> EnsureInstituicaoAsync(AppDbContext db)
        {
            var instituicao = await db.Instituicoes.FirstOrDefaultAsync(i =>
                i.Nome == "Instituto Victor Gabriel" || i.Nome == "Instituto Vitor Gabriel");
            if (instituicao is not null)
            {
                instituicao.Nome = "Instituto Victor Gabriel";
                instituicao.Responsavel = "Instituto Victor Gabriel";
                instituicao.Status = InstituicaoStatus.Aprovada;
                await db.SaveChangesAsync();
                return instituicao;
            }

            var usuario = await db.Usuarios.FirstOrDefaultAsync(u => u.Email == "admin@ivg.local");
            if (usuario is null)
            {
                usuario = new Usuario
                {
                    Nome = "Admin Instituto Victor Gabriel",
                    Email = "admin@ivg.local",
                    Senha = "$2a$11$q1XSDJeu4Dies.apWitrWeqMJz//7NT6dytA.1.BuuftTXiUgc.36",
                    Tipo = UsuarioTipo.Instituicao,
                    Cidade = "Santos",
                    Estado = "SP"
                };
                db.Usuarios.Add(usuario);
                await db.SaveChangesAsync();
            }

            instituicao = await db.Instituicoes.FirstOrDefaultAsync(i => i.UsuarioId == usuario.Id);
            if (instituicao is not null)
            {
                instituicao.Nome = "Instituto Victor Gabriel";
                instituicao.Responsavel = "Instituto Victor Gabriel";
                instituicao.Descricao ??= "Acoes que promovem inclusao, autonomia e apoio as familias.";
                instituicao.Status = InstituicaoStatus.Aprovada;
                await db.SaveChangesAsync();
                return instituicao;
            }

            instituicao = new Instituicao
            {
                UsuarioId = usuario.Id,
                Nome = "Instituto Victor Gabriel",
                Responsavel = "Instituto Victor Gabriel",
                Descricao = "Acoes que promovem inclusao, autonomia e apoio as familias.",
                Status = InstituicaoStatus.Aprovada
            };
            db.Instituicoes.Add(instituicao);
            await db.SaveChangesAsync();
            return instituicao;
        }

        private static async Task<Categoria> EnsureCategoriaAsync(AppDbContext db, string nome)
        {
            var categoria = await db.Categorias.FirstOrDefaultAsync(c => c.Nome == nome);
            if (categoria is not null)
            {
                return categoria;
            }

            categoria = new Categoria { Nome = nome };
            db.Categorias.Add(categoria);
            await db.SaveChangesAsync();
            return categoria;
        }

        private static OportunidadeTipo InferTipo(string category)
        {
            return category.Equals("Eventos", StringComparison.OrdinalIgnoreCase)
                ? OportunidadeTipo.Evento
                : OportunidadeTipo.Projeto;
        }

        private static (string? Cidade, string? Estado) SplitLocation(string location)
        {
            var parts = location.Split('-', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
            return parts.Length >= 2 ? (parts[0], parts[1]) : (location, null);
        }

        private static string BuildObjetivo(OportunidadeSeedItem item)
        {
            var requisitos = item.Requisitos.Count == 0 ? "" : $"Requisitos: {string.Join("; ", item.Requisitos)}.";
            var beneficios = item.Beneficios.Count == 0 ? "" : $" Beneficios: {string.Join("; ", item.Beneficios)}.";
            var contato = string.IsNullOrWhiteSpace(item.Contato) ? "" : $" Contato: {item.Contato}.";
            return $"{item.Time}. {requisitos}{beneficios}{contato}".Trim();
        }

        private sealed class OportunidadeSeedItem
        {
            public int Id { get; set; }
            public string Title { get; set; } = string.Empty;
            public string Category { get; set; } = string.Empty;
            public string Location { get; set; } = string.Empty;
            public string Time { get; set; } = string.Empty;
            public int VagasTotal { get; set; }
            public int VagasPreenchidas { get; set; }
            public string Descricao { get; set; } = string.Empty;
            public List<string> Requisitos { get; set; } = new();
            public List<string> Beneficios { get; set; } = new();
            public string Organizacao { get; set; } = string.Empty;
            public string Contato { get; set; } = string.Empty;
        }
    }
}
