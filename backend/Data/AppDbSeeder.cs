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
            new Categoria { Nome = "Assistência Social" },
            new Categoria { Nome = "Acolhimento Familiar" },
            new Categoria { Nome = "Inclusão" },
            new Categoria { Nome = "Cuidado" },
            new Categoria { Nome = "Formação" }
        );

        db.Habilidades.AddRange(
            new Habilidade { Nome = "Acolhimento" },
            new Habilidade { Nome = "Organização de eventos" },
            new Habilidade { Nome = "Cuidado de crianças" },
            new Habilidade { Nome = "Atendimento a famílias" },
            new Habilidade { Nome = "Apoio operacional" },
            new Habilidade { Nome = "Escuta ativa" },
            new Habilidade { Nome = "Tecnologia assistiva" },
            new Habilidade { Nome = "Recepção" },
            new Habilidade { Nome = "Comunicação" }
        );

        db.PalavrasBloqueadas.AddRange(
            new PalavraBloqueada { Palavra = "ofensa" },
            new PalavraBloqueada { Palavra = "xingamento" },
            new PalavraBloqueada { Palavra = "discriminação" }
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
            Nome = "Voluntário IVG",
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
            Cnpj = null,
            Responsavel = "Instituto Vitor Gabriel",
            Descricao = "Ações que promovem o protagonismo da pessoa com deficiência e o cuidado à sua família.",
            Status = StatusInstituicao.Aprovada
        };

        var voluntario = new Voluntario
        {
            UsuarioId = usuarioVoluntario.Id,
            DataNascimento = new DateOnly(2000, 1, 1),
            Genero = "não informado",
            Disponibilidade = "Eventos e encontros",
            Habilidades = "Acolhimento, apoio operacional, cuidado de crianças",
            Bio = "Voluntário disponível para apoiar ações do IVG com acolhimento e organização.",
            Experiencia = "Apoio em eventos sociais e cuidado familiar.",
            Interesses = "Mães atípicas, inclusão, cuidado de crianças, acolhimento familiar",
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
                Titulo = "Programa de Protagonismo da Pessoa com Deficiência",
                Tipo = TipoOportunidade.Campanha,
                Descricao = "Ação voltada ao fortalecimento do protagonismo da pessoa com deficiência.",
                Objetivo = "Promover protagonismo, autonomia e participação social da pessoa com deficiência.",
                Cidade = "Santos",
                Estado = "SP",
                DataInicio = DateTime.UtcNow,
                DataFim = DateTime.UtcNow.AddDays(30),
                Vagas = 20,
                Status = StatusOportunidade.Ativa,
                Requisitos = "Postura acolhedora, disponibilidade e compromisso com inclusão.",
                Turno = "Conforme programação",
                LocalDetalhado = "Santos/SP - local definido pelo IVG",
                AceitaSemFormacao = true
            },
            new Oportunidade
            {
                InstituicaoId = instituicao.Id,
                CategoriaId = 2,
                Titulo = "Encontro de Acolhimento para Mães Atípicas",
                Tipo = TipoOportunidade.Evento,
                Descricao = "Encontro de acolhimento, escuta e orientação para mães atípicas e familiares.",
                Objetivo = "Acolher mães atípicas, fortalecer vínculos e orientar sobre cuidado, direitos e rede de apoio.",
                Cidade = "Santos",
                Estado = "SP",
                DataInicio = DateTime.UtcNow.AddDays(7),
                DataFim = DateTime.UtcNow.AddDays(8),
                Vagas = 15,
                Status = StatusOportunidade.Ativa,
                Requisitos = "Acolhimento, escuta e apoio na organização do encontro.",
                Turno = "Tarde",
                LocalDetalhado = "Santos/SP - encontro de famílias",
                AceitaSemFormacao = true,
                PrecisaApoioCriancas = true
            },
            new Oportunidade
            {
                InstituicaoId = instituicao.Id,
                CategoriaId = 3,
                Titulo = "Projeto Autonomia e Vida Independente",
                Tipo = TipoOportunidade.Projeto,
                Descricao = "Projeto para estimular autonomia, autoestima, convivência comunitária e participação ativa.",
                Objetivo = "Incentivar independência, confiança e inclusão social da pessoa com deficiência.",
                Cidade = "Santos",
                Estado = "SP",
                DataInicio = DateTime.UtcNow.AddDays(3),
                DataFim = DateTime.UtcNow.AddDays(90),
                Vagas = 30,
                Status = StatusOportunidade.Aprovada,
                Requisitos = "Apoio operacional e convivência inclusiva.",
                Turno = "Manhã ou tarde",
                LocalDetalhado = "Santos/SP - atividades do IVG",
                AceitaSemFormacao = true
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
