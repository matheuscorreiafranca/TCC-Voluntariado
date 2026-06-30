# Correção: certificado e conexão local com a API

## Erro observado

Ao concluir uma inscrição e gerar certificado, o navegador exibia um erro de validação da API:

```json
{
  "errors": {
    "Horas": ["The field Horas must be between 1 and 1000."]
  }
}
```

Além disso, na versão local do deploy, o login e os dados do cadastro, como ocupações e áreas de afinidade, não eram carregados.

## Causa

O endpoint `PATCH /api/v1/Inscricoes/{id}/finalizar` espera o campo `horas` no corpo da requisição. O frontend estava enviando `cargaHoraria`, então o DTO do backend recebia `horas` como `0` e disparava a validação.

No ambiente local, o frontend também estava configurado para chamar a API por uma URL absoluta ou por um proxy apontando para a porta antiga `5055`, enquanto a API de deploy estava rodando na porta `5234`. Por isso, login, oportunidades, ocupações e áreas de afinidade falhavam.

## Correção aplicada

- O frontend agora envia `{ horas: cargaHoraria }` ao finalizar a inscrição.
- O Vite foi ajustado para encaminhar `/api` para `http://127.0.0.1:5234`.
- A API aplica o inicializador de schema quando `ApplyDatabaseSchema=true`, incluindo colunas usadas pela versão de deploy, como `DataFimInscricoes`, `HorasComprovadas` e `CertificadoGerado`.

## Como validar localmente

1. Suba a API em `http://localhost:5234`.
2. Suba o frontend em `http://localhost:4173`.
3. Acesse pelo frontend:

```bash
curl http://localhost:4173/api/v1/Lookup/categorias
curl http://localhost:4173/api/v1/Lookup/ocupacoes
curl http://localhost:4173/api/v1/Oportunidades
```

Todos devem retornar `200` com dados do banco.
