namespace VoluntaMais.Api.Models
{
    public enum UsuarioTipo
    {
        Superadmin,
        Admin,
        Instituicao,
        Voluntario
    }

    public enum InstituicaoStatus
    {
        Pendente,
        Aprovada,
        Reprovada
    }

    public enum OportunidadeTipo
    {
        Campanha,
        Evento,
        Projeto
    }

    public enum OportunidadeStatus
    {
        Pendente,
        Aprovada,
        Reprovada,
        Ativa,
        Encerrada
    }

    public enum InscricaoStatus
    {
        Pendente,
        Aprovada,
        Reprovada,
        Concluida,
        Cancelada
    }

    public enum FeedbackAutor
    {
        Instituicao,
        Voluntario
    }
}
