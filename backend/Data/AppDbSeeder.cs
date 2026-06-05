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
            new Categoria { Nome = "Assistencia Social" },
            new Categoria { Nome = "Acolhimento Familiar" },
            new Categoria { Nome = "Inclusao" },
            new Categoria { Nome = "Cuidado" },
            new Categoria { Nome = "Formacao" }
        );

        db.Habilidades.AddRange(
            new Habilidade { Nome = "Acolhimento" },
            new Habilidade { Nome = "Organizacao de eventos" },
            new Habilidade { Nome = "Cuidado de criancas" },
            new Habilidade { Nome = "Atendimento a familias" },
            new Habilidade { Nome = "Apoio operacional" },
            new Habilidade { Nome = "Escuta ativa" },
            new Habilidade { Nome = "Tecnologia assistiva" },
            new Habilidade { Nome = "Recepcao" },
            new Habilidade { Nome = "Comunicacao" }
        );

        db.PalavrasBloqueadas.AddRange(
            new PalavraBloqueada { Palavra = "ofensa" },
            new PalavraBloqueada { Palavra = "xingamento" },
            new PalavraBloqueada { Palavra = "discriminacao" }
        );

        var admin = new Usuario
        {
            Nome = "Superadmin IVG",
            Email = "superadmin@ivg.local",
            Senha = "123456",
            Tipo = TipoUsuario.Superadmin,
            Cidade = "Santos",
            Estado = "SP"
        };

        var usuarioInstituicao = new Usuario
        {
            Nome = "Admin Instituto Vitor Gabriel",
            Email = "admin@ivg.local",
            Senha = "123456",
            Tipo = TipoUsuario.Instituicao,
            Cidade = "Santos",
            Estado = "SP"
        };

        var usuarioVoluntario = new Usuario
        {
            Nome = "Voluntario IVG",
            Email = "voluntario@ivg.local",
            Senha = "123456",
            Tipo = TipoUsuario.Voluntario,
            Cidade = "Santos",
            Estado = "SP"
        };

        db.Usuarios.AddRange(admin, usuarioInstituicao, usuarioVoluntario);
        db.SaveChanges();

        var instituicao = new Instituicao
        {
            UsuarioId = usuarioInstituicao.Id,
            Nome = "Instituto Vitor Gabriel",
            Responsavel = "Instituto Vitor Gabriel",
            Descricao = "Acoes que promovem o protagonismo da pessoa com deficiencia e o cuidado a sua familia.",
            Status = StatusInstituicao.Aprovada
        };

        var voluntario = new Voluntario
        {
            UsuarioId = usuarioVoluntario.Id,
            DataNascimento = new DateOnly(2000, 1, 1),
            Genero = "nao informado",
            Disponibilidade = "Eventos e encontros",
            Habilidades = "Acolhimento, apoio operacional, cuidado de criancas",
            Bio = "Voluntario disponivel para apoiar acoes do IVG com acolhimento e organizacao.",
            Experiencia = "Apoio em eventos sociais e cuidado familiar.",
            Interesses = "Maes atipicas, inclusao, cuidado de criancas, acolhimento familiar",
            AceitaContatoWhatsapp = true
        };

        db.Instituicoes.Add(instituicao);
        db.Voluntarios.Add(voluntario);
        db.SaveChanges();

        db.Oportunidades.AddRange(
            new Oportunidade
            {
                InstituicaoId = instituicao.Id,
                CategoriaId = 3,
                Titulo = "Programa de Protagonismo da Pessoa com Deficiencia",
                Tipo = TipoOportunidade.Campanha,
                Descricao = "Acao voltada ao fortalecimento do protagonismo da pessoa com deficiencia.",
                Objetivo = "Promover protagonismo, autonomia e participacao social da pessoa com deficiencia.",
                Cidade = "Santos",
                Estado = "SP",
                DataInicio = DateTime.UtcNow,
                DataFim = DateTime.UtcNow.AddDays(30),
                Vagas = 20,
                Status = StatusOportunidade.Ativa,
                Requisitos = "Postura acolhedora, disponibilidade e compromisso com inclusao.",
                Turno = "Conforme programacao",
                LocalDetalhado = "Santos/SP - local definido pelo IVG",
                AceitaSemFormacao = true
            },
            new Oportunidade
            {
                InstituicaoId = instituicao.Id,
                CategoriaId = 2,
                Titulo = "Encontro de Acolhimento para Maes Atipicas",
                Tipo = TipoOportunidade.Evento,
                Descricao = "Encontro de acolhimento, escuta e orientacao para maes atipicas e familiares.",
                Objetivo = "Acolher maes atipicas, fortalecer vinculos e orientar sobre cuidado, direitos e rede de apoio.",
                Cidade = "Santos",
                Estado = "SP",
                DataInicio = DateTime.UtcNow.AddDays(7),
                DataFim = DateTime.UtcNow.AddDays(8),
                Vagas = 15,
                Status = StatusOportunidade.Ativa,
                Requisitos = "Acolhimento, escuta e apoio na organizacao do encontro.",
                Turno = "Tarde",
                LocalDetalhado = "Santos/SP - encontro de familias",
                AceitaSemFormacao = true,
                PrecisaApoioCriancas = true
            }
        );

        db.SaveChanges();

        db.VoluntarioHabilidades.AddRange(
            new VoluntarioHabilidade { VoluntarioId = voluntario.Id, HabilidadeId = 1 },
            new VoluntarioHabilidade { VoluntarioId = voluntario.Id, HabilidadeId = 2 },
            new VoluntarioHabilidade { VoluntarioId = voluntario.Id, HabilidadeId = 3 }
        );

        db.SaveChanges();
    }
}
