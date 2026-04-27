using Voluntariado.Api.Models;

namespace Voluntariado.Api.Data;

public static class AppDbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Usuarios.Any())
        {
            return;
        }

        db.Categorias.AddRange(
            new Categoria { Nome = "Educação" },
            new Categoria { Nome = "Saúde" },
            new Categoria { Nome = "Meio Ambiente" },
            new Categoria { Nome = "Assistência Social" },
            new Categoria { Nome = "Cultura" }
        );

        db.Habilidades.AddRange(
            new Habilidade { Nome = "Comunicação" },
            new Habilidade { Nome = "Organização" },
            new Habilidade { Nome = "Ensino" },
            new Habilidade { Nome = "Atendimento" },
            new Habilidade { Nome = "Logística" }
        );

        db.PalavrasBloqueadas.AddRange(
            new PalavraBloqueada { Palavra = "ofensa" },
            new PalavraBloqueada { Palavra = "xingamento" },
            new PalavraBloqueada { Palavra = "discriminação" }
        );

        var admin = new Usuario
        {
            Nome = "Administrador",
            Email = "admin@example.com",
            Senha = "123456",
            Tipo = TipoUsuario.Admin,
            Cidade = "Cubatão",
            Estado = "SP"
        };

        var usuarioInstituicao = new Usuario
        {
            Nome = "Instituição Exemplo",
            Email = "instituicao@example.com",
            Senha = "123456",
            Tipo = TipoUsuario.Instituicao,
            Cidade = "Cubatão",
            Estado = "SP"
        };

        var usuarioVoluntario = new Usuario
        {
            Nome = "Voluntário Exemplo",
            Email = "voluntario@example.com",
            Senha = "123456",
            Tipo = TipoUsuario.Voluntario,
            Cidade = "Cubatão",
            Estado = "SP"
        };

        db.Usuarios.AddRange(admin, usuarioInstituicao, usuarioVoluntario);
        db.SaveChanges();

        var instituicao = new Instituicao
        {
            UsuarioId = usuarioInstituicao.Id,
            Nome = "Instituição Exemplo",
            Cnpj = "00.000.000/0001-00",
            Responsavel = "Responsável Exemplo",
            Descricao = "Instituição de apoio social.",
            Status = StatusInstituicao.Aprovada
        };

        var voluntario = new Voluntario
        {
            UsuarioId = usuarioVoluntario.Id,
            DataNascimento = new DateOnly(2000, 1, 1),
            Genero = "não informado",
            Disponibilidade = "Finais de semana",
            Habilidades = "Comunicação, Atendimento"
        };

        db.Instituicoes.Add(instituicao);
        db.Voluntarios.Add(voluntario);
        db.SaveChanges();

        db.Oportunidades.AddRange(
            new Oportunidade
            {
                InstituicaoId = instituicao.Id,
                CategoriaId = 1,
                Titulo = "Campanha de Reforço Escolar",
                Tipo = TipoOportunidade.Campanha,
                Descricao = "Campanha para apoio educacional.",
                Objetivo = "Apoiar estudantes da comunidade.",
                Cidade = "Cubatão",
                Estado = "SP",
                DataInicio = DateTime.UtcNow,
                DataFim = DateTime.UtcNow.AddDays(30),
                Vagas = 20,
                Status = StatusOportunidade.Ativa
            },
            new Oportunidade
            {
                InstituicaoId = instituicao.Id,
                CategoriaId = 4,
                Titulo = "Evento de Arrecadação Solidária",
                Tipo = TipoOportunidade.Evento,
                Descricao = "Evento para arrecadar doações.",
                Objetivo = "Organizar doações para famílias.",
                Cidade = "Cubatão",
                Estado = "SP",
                DataInicio = DateTime.UtcNow.AddDays(7),
                DataFim = DateTime.UtcNow.AddDays(8),
                Vagas = 15,
                Status = StatusOportunidade.Ativa
            },
            new Oportunidade
            {
                InstituicaoId = instituicao.Id,
                CategoriaId = 3,
                Titulo = "Projeto Bairro Limpo",
                Tipo = TipoOportunidade.Projeto,
                Descricao = "Projeto de limpeza e conscientização ambiental.",
                Objetivo = "Melhorar o bairro.",
                Cidade = "Cubatão",
                Estado = "SP",
                DataInicio = DateTime.UtcNow.AddDays(3),
                DataFim = DateTime.UtcNow.AddDays(90),
                Vagas = 30,
                Status = StatusOportunidade.Aprovada
            }
        );

        db.SaveChanges();
    }
}
