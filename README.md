# VoluntaMais MVP

MVP fullstack de voluntariado com API em ASP.NET Core, EF Core SQLite, Swagger e frontend Next.js App Router.

## Estrutura

```text
tc-voluntariado/
  backend/
    Controllers/
    Data/
    DTOs/
    Models/
    Program.cs
    Voluntariado.Api.csproj
  frontend/
    app/
    components/
    public/logos/
    services/api.ts
```

## Backend

Requisitos:

- .NET 8 SDK

Executar:

```bash
cd tc-voluntariado/backend
dotnet restore
dotnet run
```

A API sobe em:

```text
http://localhost:5000
```

Swagger:

```text
http://localhost:5000/swagger
```

Banco:

- SQLite
- arquivo criado automaticamente: `backend/voluntariado.db`
- seed automático com usuários, instituição, voluntário, categorias, habilidades e oportunidades
- SQL de referência: `backend/Data/voluntariado_minimo.sql`

## Frontend

Requisitos:

- Node.js 20+

Configurar:

```bash
cd tc-voluntariado/frontend
cp .env.example .env.local
npm install
npm run dev
```

Abrir:

```text
http://localhost:3000
```

Variável de API:

```text
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Fluxo mínimo

1. Acesse `/dashboard` para ver resumo.
2. Acesse `/oportunidades` para listar e se inscrever.
3. Acesse `/oportunidades/criar` para publicar oportunidade.
4. Acesse `/inscricoes` para aprovar ou reprovar voluntários.
5. Acesse `/instituicoes` para cadastrar/listar instituições.

## Observação de validação

Neste ambiente, `dotnet` não está instalado e `npm install` falhou por falta de espaço em disco (`ENOSPC`). O projeto foi criado completo para execução em ambiente com .NET 8 SDK e espaço livre para dependências Node.
