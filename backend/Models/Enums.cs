namespace Voluntariado.Api.Models;

public enum TipoUsuario
{
    Superadmin,
    Admin,
    Instituicao,
    Voluntario
}

public enum StatusInstituicao
{
    Pendente,
    Aprovada,
    Reprovada
}

public enum TipoOportunidade
{
    Campanha,
    Evento,
    Projeto
}

public enum StatusOportunidade
{
    Pendente,
    Aprovada,
    Reprovada,
    Ativa,
    Encerrada
}

public enum StatusInscricao
{
    Pendente,
    Aprovada,
    Reprovada,
    Concluida,
    Cancelada
}

public enum AutorFeedback
{
    Instituicao,
    Voluntario
}
