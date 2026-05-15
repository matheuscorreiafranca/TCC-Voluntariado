-- Rollback da migration 20260504_01_portal_voluntario.sql.
-- Use somente se precisar voltar ao schema anterior. Dados das colunas novas serão perdidos.

DROP TABLE IF EXISTS voluntario_habilidades;

ALTER TABLE oportunidades
  DROP INDEX ix_oportunidades_instituicao_tipo_status,
  DROP INDEX ix_oportunidades_categoria_data;

ALTER TABLE inscricoes DROP INDEX ix_inscricoes_voluntario_status;
ALTER TABLE notificacoes DROP INDEX ix_notificacoes_usuario_lida;

ALTER TABLE oportunidades
  DROP COLUMN Requisitos,
  DROP COLUMN Turno,
  DROP COLUMN LocalDetalhado,
  DROP COLUMN AceitaSemFormacao,
  DROP COLUMN PrecisaApoioCriancas;

ALTER TABLE voluntarios
  DROP COLUMN Bio,
  DROP COLUMN Experiencia,
  DROP COLUMN Interesses,
  DROP COLUMN PreferenciasAcessibilidade,
  DROP COLUMN NecessitaAcessibilidade,
  DROP COLUMN AceitaContatoWhatsapp,
  DROP COLUMN AtualizadoEm;

ALTER TABLE usuarios
  MODIFY Tipo ENUM('Admin','Instituicao','Voluntario') NOT NULL;
