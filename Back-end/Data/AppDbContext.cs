using Microsoft.EntityFrameworkCore;
using VoluntaMais.Api.Models;

namespace VoluntaMais.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; } = null!;
        public DbSet<Instituicao> Instituicoes { get; set; } = null!;
        public DbSet<Voluntario> Voluntarios { get; set; } = null!;
        public DbSet<VoluntarioFormacao> VoluntarioFormacoes { get; set; } = null!;
        public DbSet<Categoria> Categorias { get; set; } = null!;
        public DbSet<Habilidade> Habilidades { get; set; } = null!;
        public DbSet<Oportunidade> Oportunidades { get; set; } = null!;
        public DbSet<Inscricao> Inscricoes { get; set; } = null!;
        public DbSet<Feedback> Feedbacks { get; set; } = null!;
        public DbSet<Notificacao> Notificacoes { get; set; } = null!;
        public DbSet<PalavraBloqueada> PalavrasBloqueadas { get; set; } = null!;
        public DbSet<Ocupacao> Ocupacoes { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Ignore<VoluntarioFormacao>();

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable("usuarios");
                IgnoreAuditExceptCreated(entity);
                entity.Property(u => u.Tipo).HasConversion<string>();
                entity.Property(u => u.DataInsercao).HasColumnName("CriadoEm");
                entity.Ignore(u => u.Anonimizado);
                entity.HasIndex(u => u.Email).IsUnique();
            });

            modelBuilder.Entity<Instituicao>(entity =>
            {
                entity.ToTable("instituicoes");
                IgnoreAuditExceptCreated(entity);
                entity.Property(i => i.Status).HasConversion<string>();
                entity.Property(i => i.DataInsercao).HasColumnName("CriadoEm");
                entity.HasOne(i => i.Usuario)
                    .WithOne(u => u.Instituicao)
                    .HasForeignKey<Instituicao>(i => i.UsuarioId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Voluntario>(entity =>
            {
                entity.ToTable("voluntarios");
                IgnoreAudit(entity);
                entity.Property(v => v.DataInsercao).HasColumnName("CriadoEm");
                entity.Property(v => v.DataAtualizacao).HasColumnName("AtualizadoEm");
                entity.Ignore(v => v.Cpf);
                entity.Ignore(v => v.Etnia);
                entity.Ignore(v => v.Formacoes);
                entity.Ignore(v => v.AreasAfinidade);
                entity.HasOne(v => v.Usuario)
                    .WithOne(u => u.Voluntario)
                    .HasForeignKey<Voluntario>(v => v.UsuarioId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.ToTable("categorias");
                IgnoreAllAudit(entity);
                entity.Ignore(c => c.Voluntarios);
                entity.HasIndex(c => c.Nome).IsUnique();
            });

            modelBuilder.Entity<Habilidade>(entity =>
            {
                entity.ToTable("habilidades");
                IgnoreAllAudit(entity);
                entity.HasIndex(h => h.Nome).IsUnique();
            });

            modelBuilder.Entity<Oportunidade>(entity =>
            {
                entity.ToTable("oportunidades");
                IgnoreAuditExceptCreated(entity);
                entity.Property(o => o.DataInsercao).HasColumnName("CriadoEm");
                entity.Property(o => o.Tipo).HasConversion<string>();
                entity.Property(o => o.Status).HasConversion<string>();
                entity.HasOne(o => o.Instituicao)
                    .WithMany(i => i.Oportunidades)
                    .HasForeignKey(o => o.InstituicaoId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(o => o.Categoria)
                    .WithMany(c => c.Oportunidades)
                    .HasForeignKey(o => o.CategoriaId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<Inscricao>(entity =>
            {
                entity.ToTable("inscricoes");
                IgnoreAudit(entity);
                entity.Property(i => i.DataInsercao).HasColumnName("CriadoEm");
                entity.Property(i => i.DataAtualizacao).HasColumnName("AtualizadoEm");
                entity.Property(i => i.Status).HasConversion<string>();
                entity.HasIndex(i => new { i.OportunidadeId, i.VoluntarioId }).IsUnique();
                entity.HasOne(i => i.Oportunidade)
                    .WithMany(o => o.Inscricoes)
                    .HasForeignKey(i => i.OportunidadeId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(i => i.Voluntario)
                    .WithMany(v => v.Inscricoes)
                    .HasForeignKey(i => i.VoluntarioId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Feedback>(entity =>
            {
                entity.ToTable("feedbacks");
                IgnoreAuditExceptCreated(entity);
                entity.Property(f => f.DataInsercao).HasColumnName("CriadoEm");
                entity.Property(f => f.Autor).HasConversion<string>();
                entity.HasOne(f => f.Inscricao)
                    .WithMany(i => i.Feedbacks)
                    .HasForeignKey(f => f.InscricaoId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Notificacao>(entity =>
            {
                entity.ToTable("notificacoes");
                IgnoreAuditExceptCreated(entity);
                entity.Property(n => n.DataInsercao).HasColumnName("CriadoEm");
                entity.HasOne(n => n.Usuario)
                    .WithMany(u => u.Notificacoes)
                    .HasForeignKey(n => n.UsuarioId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<PalavraBloqueada>(entity =>
            {
                entity.ToTable("palavras_bloqueadas");
                IgnoreAllAudit(entity);
                entity.HasIndex(p => p.Palavra).IsUnique();
            });

            modelBuilder.Entity<Ocupacao>(entity =>
            {
                entity.ToTable("ocupacoes");
                IgnoreAllAudit(entity);
                entity.HasIndex(o => o.Nome).IsUnique();
            });
        }

        public override int SaveChanges()
        {
            ApplyAuditInformation();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyAuditInformation();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void ApplyAuditInformation()
        {
            var now = DateTime.UtcNow;
            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
            {
                if (entry.State == EntityState.Added && entry.Entity.DataInsercao == default)
                {
                    entry.Entity.DataInsercao = now;
                }

                if (entry.State == EntityState.Modified)
                {
                    entry.Entity.DataAtualizacao = now;
                }
            }
        }

        private static void IgnoreAllAudit<T>(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<T> entity)
            where T : BaseEntity
        {
            entity.Ignore(e => e.DataInsercao);
            entity.Ignore(e => e.DataAtualizacao);
            entity.Ignore(e => e.DataDelecao);
            entity.Ignore(e => e.Excluido);
            entity.Ignore(e => e.VersaoRegistro);
        }

        private static void IgnoreAuditExceptCreated<T>(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<T> entity)
            where T : BaseEntity
        {
            entity.Ignore(e => e.DataAtualizacao);
            entity.Ignore(e => e.DataDelecao);
            entity.Ignore(e => e.Excluido);
            entity.Ignore(e => e.VersaoRegistro);
        }

        private static void IgnoreAudit<T>(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<T> entity)
            where T : BaseEntity
        {
            entity.Ignore(e => e.DataDelecao);
            entity.Ignore(e => e.Excluido);
            entity.Ignore(e => e.VersaoRegistro);
        }
    }
}
