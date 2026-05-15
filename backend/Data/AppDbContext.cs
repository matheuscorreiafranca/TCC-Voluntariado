using Microsoft.EntityFrameworkCore;
using Voluntariado.Api.Models;

namespace Voluntariado.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Instituicao> Instituicoes => Set<Instituicao>();
    public DbSet<Voluntario> Voluntarios => Set<Voluntario>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Habilidade> Habilidades => Set<Habilidade>();
    public DbSet<Oportunidade> Oportunidades => Set<Oportunidade>();
    public DbSet<Inscricao> Inscricoes => Set<Inscricao>();
    public DbSet<Feedback> Feedbacks => Set<Feedback>();
    public DbSet<Notificacao> Notificacoes => Set<Notificacao>();
    public DbSet<PalavraBloqueada> PalavrasBloqueadas => Set<PalavraBloqueada>();
    public DbSet<VoluntarioHabilidade> VoluntarioHabilidades => Set<VoluntarioHabilidade>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("usuarios");
            entity.HasIndex(x => x.Email).IsUnique();
            entity.Property(x => x.Tipo).HasConversion<string>();
        });

        modelBuilder.Entity<Instituicao>(entity =>
        {
            entity.ToTable("instituicoes");
            entity.Property(x => x.Status).HasConversion<string>();
            entity.HasOne(x => x.Usuario)
                .WithOne(x => x.Instituicao)
                .HasForeignKey<Instituicao>(x => x.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Voluntario>(entity =>
        {
            entity.ToTable("voluntarios");
            entity.HasOne(x => x.Usuario)
                .WithOne(x => x.Voluntario)
                .HasForeignKey<Voluntario>(x => x.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<VoluntarioHabilidade>(entity =>
        {
            entity.ToTable("voluntario_habilidades");
            entity.HasIndex(x => new { x.VoluntarioId, x.HabilidadeId }).IsUnique();
            entity.HasOne(x => x.Voluntario)
                .WithMany(x => x.VoluntarioHabilidades)
                .HasForeignKey(x => x.VoluntarioId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.Habilidade)
                .WithMany(x => x.VoluntarioHabilidades)
                .HasForeignKey(x => x.HabilidadeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.ToTable("categorias");
            entity.HasIndex(x => x.Nome).IsUnique();
        });

        modelBuilder.Entity<Habilidade>(entity =>
        {
            entity.ToTable("habilidades");
            entity.HasIndex(x => x.Nome).IsUnique();
        });

        modelBuilder.Entity<Oportunidade>(entity =>
        {
            entity.ToTable("oportunidades");
            entity.Property(x => x.Tipo).HasConversion<string>();
            entity.Property(x => x.Status).HasConversion<string>();
            entity.HasOne(x => x.Instituicao)
                .WithMany(x => x.Oportunidades)
                .HasForeignKey(x => x.InstituicaoId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Categoria)
                .WithMany(x => x.Oportunidades)
                .HasForeignKey(x => x.CategoriaId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Inscricao>(entity =>
        {
            entity.ToTable("inscricoes");
            entity.Property(x => x.Status).HasConversion<string>();
            entity.HasIndex(x => new { x.OportunidadeId, x.VoluntarioId }).IsUnique();
            entity.HasOne(x => x.Oportunidade)
                .WithMany(x => x.Inscricoes)
                .HasForeignKey(x => x.OportunidadeId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.Voluntario)
                .WithMany(x => x.Inscricoes)
                .HasForeignKey(x => x.VoluntarioId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.ToTable("feedbacks");
            entity.Property(x => x.Autor).HasConversion<string>();
            entity.HasOne(x => x.Inscricao)
                .WithMany(x => x.Feedbacks)
                .HasForeignKey(x => x.InscricaoId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Notificacao>(entity =>
        {
            entity.ToTable("notificacoes");
            entity.HasOne(x => x.Usuario)
                .WithMany(x => x.Notificacoes)
                .HasForeignKey(x => x.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PalavraBloqueada>(entity =>
        {
            entity.ToTable("palavras_bloqueadas");
            entity.HasIndex(x => x.Palavra).IsUnique();
        });
    }
}
