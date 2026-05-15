using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace VoluntaMais.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categorias",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    DataInsercao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DataDelecao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Excluido = table.Column<bool>(type: "INTEGER", nullable: false),
                    VersaoRegistro = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categorias", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Habilidades",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    DataInsercao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DataDelecao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Excluido = table.Column<bool>(type: "INTEGER", nullable: false),
                    VersaoRegistro = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Habilidades", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PalavrasBloqueadas",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Palavra = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false),
                    DataInsercao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DataDelecao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Excluido = table.Column<bool>(type: "INTEGER", nullable: false),
                    VersaoRegistro = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PalavrasBloqueadas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    Senha = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Telefone = table.Column<string>(type: "TEXT", maxLength: 30, nullable: true),
                    Tipo = table.Column<int>(type: "INTEGER", nullable: false),
                    Cidade = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Estado = table.Column<string>(type: "TEXT", maxLength: 2, nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false),
                    Anonimizado = table.Column<bool>(type: "INTEGER", nullable: false),
                    DataInsercao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DataDelecao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Excluido = table.Column<bool>(type: "INTEGER", nullable: false),
                    VersaoRegistro = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Instituicoes",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UsuarioId = table.Column<long>(type: "INTEGER", nullable: false),
                    Nome = table.Column<string>(type: "TEXT", maxLength: 180, nullable: false),
                    Cnpj = table.Column<string>(type: "TEXT", maxLength: 30, nullable: true),
                    Responsavel = table.Column<string>(type: "TEXT", maxLength: 150, nullable: true),
                    Descricao = table.Column<string>(type: "TEXT", nullable: true),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    DataInsercao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DataDelecao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Excluido = table.Column<bool>(type: "INTEGER", nullable: false),
                    VersaoRegistro = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Instituicoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Instituicoes_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Notificacoes",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UsuarioId = table.Column<long>(type: "INTEGER", nullable: false),
                    Titulo = table.Column<string>(type: "TEXT", maxLength: 180, nullable: false),
                    Mensagem = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    Lida = table.Column<bool>(type: "INTEGER", nullable: false),
                    DataInsercao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DataDelecao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Excluido = table.Column<bool>(type: "INTEGER", nullable: false),
                    VersaoRegistro = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notificacoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notificacoes_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Voluntarios",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UsuarioId = table.Column<long>(type: "INTEGER", nullable: false),
                    DataNascimento = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Genero = table.Column<string>(type: "TEXT", maxLength: 30, nullable: true),
                    Disponibilidade = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Cpf = table.Column<string>(type: "TEXT", maxLength: 14, nullable: true),
                    Etnia = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    Habilidades = table.Column<string>(type: "TEXT", nullable: true),
                    DataInsercao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DataDelecao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Excluido = table.Column<bool>(type: "INTEGER", nullable: false),
                    VersaoRegistro = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Voluntarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Voluntarios_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Oportunidades",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    InstituicaoId = table.Column<long>(type: "INTEGER", nullable: false),
                    CategoriaId = table.Column<long>(type: "INTEGER", nullable: true),
                    Titulo = table.Column<string>(type: "TEXT", maxLength: 180, nullable: false),
                    Tipo = table.Column<int>(type: "INTEGER", nullable: false),
                    Descricao = table.Column<string>(type: "TEXT", nullable: true),
                    Objetivo = table.Column<string>(type: "TEXT", nullable: true),
                    Cidade = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Estado = table.Column<string>(type: "TEXT", maxLength: 2, nullable: true),
                    DataInicio = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataFim = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Vagas = table.Column<int>(type: "INTEGER", nullable: false),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    DataInsercao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DataDelecao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Excluido = table.Column<bool>(type: "INTEGER", nullable: false),
                    VersaoRegistro = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Oportunidades", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Oportunidades_Categorias_CategoriaId",
                        column: x => x.CategoriaId,
                        principalTable: "Categorias",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Oportunidades_Instituicoes_InstituicaoId",
                        column: x => x.InstituicaoId,
                        principalTable: "Instituicoes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CategoriaVoluntario",
                columns: table => new
                {
                    AreasAfinidadeId = table.Column<long>(type: "INTEGER", nullable: false),
                    VoluntariosId = table.Column<long>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoriaVoluntario", x => new { x.AreasAfinidadeId, x.VoluntariosId });
                    table.ForeignKey(
                        name: "FK_CategoriaVoluntario_Categorias_AreasAfinidadeId",
                        column: x => x.AreasAfinidadeId,
                        principalTable: "Categorias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CategoriaVoluntario_Voluntarios_VoluntariosId",
                        column: x => x.VoluntariosId,
                        principalTable: "Voluntarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VoluntarioFormacoes",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    VoluntarioId = table.Column<long>(type: "INTEGER", nullable: false),
                    Nome = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    Instituicao = table.Column<string>(type: "TEXT", maxLength: 150, nullable: true),
                    AnoConclusao = table.Column<int>(type: "INTEGER", nullable: true),
                    Tipo = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    DataInsercao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DataDelecao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Excluido = table.Column<bool>(type: "INTEGER", nullable: false),
                    VersaoRegistro = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VoluntarioFormacoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VoluntarioFormacoes_Voluntarios_VoluntarioId",
                        column: x => x.VoluntarioId,
                        principalTable: "Voluntarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Inscricoes",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    OportunidadeId = table.Column<long>(type: "INTEGER", nullable: false),
                    VoluntarioId = table.Column<long>(type: "INTEGER", nullable: false),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    MotivoReprovacao = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    DataInsercao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DataDelecao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Excluido = table.Column<bool>(type: "INTEGER", nullable: false),
                    VersaoRegistro = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inscricoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Inscricoes_Oportunidades_OportunidadeId",
                        column: x => x.OportunidadeId,
                        principalTable: "Oportunidades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Inscricoes_Voluntarios_VoluntarioId",
                        column: x => x.VoluntarioId,
                        principalTable: "Voluntarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Feedbacks",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    InscricaoId = table.Column<long>(type: "INTEGER", nullable: false),
                    Autor = table.Column<int>(type: "INTEGER", nullable: false),
                    Nota = table.Column<byte>(type: "INTEGER", nullable: false),
                    Comentario = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    DataInsercao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DataDelecao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Excluido = table.Column<bool>(type: "INTEGER", nullable: false),
                    VersaoRegistro = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Feedbacks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Feedbacks_Inscricoes_InscricaoId",
                        column: x => x.InscricaoId,
                        principalTable: "Inscricoes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categorias",
                columns: new[] { "Id", "DataAtualizacao", "DataDelecao", "DataInsercao", "Excluido", "Nome", "VersaoRegistro" },
                values: new object[,]
                {
                    { 1L, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Assistencia Social", new Guid("a0000001-0000-0000-0000-000000000001") },
                    { 2L, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Acolhimento Familiar", new Guid("a0000001-0000-0000-0000-000000000002") },
                    { 3L, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Inclusao", new Guid("a0000001-0000-0000-0000-000000000003") },
                    { 4L, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Cuidado", new Guid("a0000001-0000-0000-0000-000000000004") },
                    { 5L, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Formacao", new Guid("a0000001-0000-0000-0000-000000000005") }
                });

            migrationBuilder.InsertData(
                table: "Habilidades",
                columns: new[] { "Id", "DataAtualizacao", "DataDelecao", "DataInsercao", "Excluido", "Nome", "VersaoRegistro" },
                values: new object[,]
                {
                    { 1L, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Acolhimento", new Guid("b0000001-0000-0000-0000-000000000001") },
                    { 2L, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Organizacao de eventos", new Guid("b0000001-0000-0000-0000-000000000002") },
                    { 3L, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Cuidado de criancas", new Guid("b0000001-0000-0000-0000-000000000003") },
                    { 4L, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Atendimento a familias", new Guid("b0000001-0000-0000-0000-000000000004") },
                    { 5L, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Apoio operacional", new Guid("b0000001-0000-0000-0000-000000000005") }
                });

            migrationBuilder.InsertData(
                table: "PalavrasBloqueadas",
                columns: new[] { "Id", "Ativo", "DataAtualizacao", "DataDelecao", "DataInsercao", "Excluido", "Palavra", "VersaoRegistro" },
                values: new object[,]
                {
                    { 1L, true, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "ofensa", new Guid("c0000001-0000-0000-0000-000000000001") },
                    { 2L, true, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "xingamento", new Guid("c0000001-0000-0000-0000-000000000002") },
                    { 3L, true, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "discriminacao", new Guid("c0000001-0000-0000-0000-000000000003") }
                });

            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "Id", "Anonimizado", "Ativo", "Cidade", "DataAtualizacao", "DataDelecao", "DataInsercao", "Email", "Estado", "Excluido", "Nome", "Senha", "Telefone", "Tipo", "VersaoRegistro" },
                values: new object[,]
                {
                    { 1L, false, true, "Santos", null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), "superadmin@ivg.local", "SP", false, "Superadmin IVG", "$2a$11$q1XSDJeu4Dies.apWitrWeqMJz//7NT6dytA.1.BuuftTXiUgc.36", null, 0, new Guid("d0000001-0000-0000-0000-000000000001") },
                    { 2L, false, true, "Santos", null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@ivg.local", "SP", false, "Admin Instituto Vitor Gabriel", "$2a$11$q1XSDJeu4Dies.apWitrWeqMJz//7NT6dytA.1.BuuftTXiUgc.36", null, 2, new Guid("d0000001-0000-0000-0000-000000000002") },
                    { 3L, false, true, "Santos", null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), "voluntario@ivg.local", "SP", false, "Voluntario IVG", "$2a$11$q1XSDJeu4Dies.apWitrWeqMJz//7NT6dytA.1.BuuftTXiUgc.36", null, 3, new Guid("d0000001-0000-0000-0000-000000000003") }
                });

            migrationBuilder.InsertData(
                table: "Instituicoes",
                columns: new[] { "Id", "Cnpj", "DataAtualizacao", "DataDelecao", "DataInsercao", "Descricao", "Excluido", "Nome", "Responsavel", "Status", "UsuarioId", "VersaoRegistro" },
                values: new object[] { 1L, null, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Acoes que promovem o protagonismo da pessoa com deficiencia e o cuidado a sua familia.", false, "Instituto Vitor Gabriel", "Instituto Vitor Gabriel", 1, 2L, new Guid("e0000001-0000-0000-0000-000000000001") });

            migrationBuilder.InsertData(
                table: "Voluntarios",
                columns: new[] { "Id", "Cpf", "DataAtualizacao", "DataDelecao", "DataInsercao", "DataNascimento", "Disponibilidade", "Etnia", "Excluido", "Genero", "Habilidades", "UsuarioId", "VersaoRegistro" },
                values: new object[] { 1L, null, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2000, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Eventos e encontros", null, false, "nao informado", "Acolhimento, apoio operacional, cuidado de criancas", 3L, new Guid("f0000001-0000-0000-0000-000000000001") });

            migrationBuilder.InsertData(
                table: "Oportunidades",
                columns: new[] { "Id", "CategoriaId", "Cidade", "DataAtualizacao", "DataDelecao", "DataFim", "DataInicio", "DataInsercao", "Descricao", "Estado", "Excluido", "InstituicaoId", "Objetivo", "Status", "Tipo", "Titulo", "Vagas", "VersaoRegistro" },
                values: new object[,]
                {
                    { 1L, 3L, "Santos", null, null, new DateTime(2026, 5, 31, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Acao voltada ao fortalecimento do protagonismo da pessoa com deficiencia.", "SP", false, 1L, "Promover protagonismo, autonomia e participacao social da pessoa com deficiencia.", 3, 0, "Programa de Protagonismo da Pessoa com Deficiencia", 20, new Guid("00000001-0000-0000-0000-000000000001") },
                    { 2L, 2L, "Santos", null, null, new DateTime(2026, 5, 9, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 5, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Encontro de acolhimento, escuta e orientacao para maes atipicas e familiares.", "SP", false, 1L, "Acolher maes atipicas, fortalecer vinculos e orientar sobre cuidado, direitos e rede de apoio.", 3, 1, "Encontro de Acolhimento para Maes Atipicas", 15, new Guid("00000001-0000-0000-0000-000000000002") },
                    { 3L, 3L, "Santos", null, null, new DateTime(2026, 7, 30, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 5, 4, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Projeto para estimular autonomia, autoestima, convivencia comunitaria e participacao ativa.", "SP", false, 1L, "Incentivar independencia, confianca e inclusao social da pessoa com deficiencia.", 1, 2, "Projeto Autonomia e Vida Independente", 30, new Guid("00000001-0000-0000-0000-000000000003") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categorias_Nome",
                table: "Categorias",
                column: "Nome",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CategoriaVoluntario_VoluntariosId",
                table: "CategoriaVoluntario",
                column: "VoluntariosId");

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_InscricaoId",
                table: "Feedbacks",
                column: "InscricaoId");

            migrationBuilder.CreateIndex(
                name: "IX_Habilidades_Nome",
                table: "Habilidades",
                column: "Nome",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Inscricoes_OportunidadeId_VoluntarioId",
                table: "Inscricoes",
                columns: new[] { "OportunidadeId", "VoluntarioId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Inscricoes_VoluntarioId",
                table: "Inscricoes",
                column: "VoluntarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Instituicoes_UsuarioId",
                table: "Instituicoes",
                column: "UsuarioId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notificacoes_UsuarioId",
                table: "Notificacoes",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Oportunidades_CategoriaId",
                table: "Oportunidades",
                column: "CategoriaId");

            migrationBuilder.CreateIndex(
                name: "IX_Oportunidades_InstituicaoId",
                table: "Oportunidades",
                column: "InstituicaoId");

            migrationBuilder.CreateIndex(
                name: "IX_PalavrasBloqueadas_Palavra",
                table: "PalavrasBloqueadas",
                column: "Palavra",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VoluntarioFormacoes_VoluntarioId",
                table: "VoluntarioFormacoes",
                column: "VoluntarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Voluntarios_UsuarioId",
                table: "Voluntarios",
                column: "UsuarioId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CategoriaVoluntario");

            migrationBuilder.DropTable(
                name: "Feedbacks");

            migrationBuilder.DropTable(
                name: "Habilidades");

            migrationBuilder.DropTable(
                name: "Notificacoes");

            migrationBuilder.DropTable(
                name: "PalavrasBloqueadas");

            migrationBuilder.DropTable(
                name: "VoluntarioFormacoes");

            migrationBuilder.DropTable(
                name: "Inscricoes");

            migrationBuilder.DropTable(
                name: "Oportunidades");

            migrationBuilder.DropTable(
                name: "Voluntarios");

            migrationBuilder.DropTable(
                name: "Categorias");

            migrationBuilder.DropTable(
                name: "Instituicoes");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
