import { useEffect, useMemo, useState } from 'react';
import { Award, CheckCircle2, ClipboardCheck, Loader2, MessageSquareText, Send, Star, UserRoundCheck } from 'lucide-react';
import { ApiException } from '../services/apiClient';
import {
  ApiFeedback,
  ApiInscricao,
  AutorFeedback,
  criarFeedback,
  listarFeedbacks,
  listarInscricoes
} from '../services/feedbackService';

interface FeedbacksPageProps {
  user: {
    voluntarioId?: number;
    instituicaoId?: number;
    nome: string;
    tipo: string;
  } | null;
  isAdmin: boolean;
  isOrganizacao: boolean;
}

type FeedbackMode = 'campanha' | 'voluntario';

interface FeedbackQuestion {
  id: string;
  label: string;
  hint: string;
}

const campaignQuestions: FeedbackQuestion[] = [
  { id: 'acolhimento', label: 'Acolhimento da equipe', hint: 'Como voce foi recebido e orientado pela instituicao.' },
  { id: 'organizacao', label: 'Organizacao da campanha', hint: 'Planejamento, horarios, responsabilidades e fluxo da atividade.' },
  { id: 'comunicacao', label: 'Comunicacao antes e durante', hint: 'Clareza das mensagens, avisos e combinados.' },
  { id: 'impacto', label: 'Percepcao de impacto social', hint: 'Quanto a campanha pareceu gerar resultado real.' },
  { id: 'estrutura', label: 'Estrutura oferecida', hint: 'Materiais, local, apoio e condicoes para atuar.' },
  { id: 'seguranca', label: 'Seguranca e bem-estar', hint: 'Cuidado com riscos, limites e conforto dos participantes.' },
  { id: 'inclusao', label: 'Inclusao e respeito', hint: 'Ambiente acessivel, respeitoso e aberto a diferencas.' },
  { id: 'aprendizado', label: 'Aprendizado pessoal', hint: 'O quanto a experiencia contribuiu para seu desenvolvimento.' },
  { id: 'reconhecimento', label: 'Reconhecimento do voluntario', hint: 'Retorno, agradecimento e valorizacao da sua participacao.' },
  { id: 'recomendacao', label: 'Recomendaria a campanha', hint: 'Sua chance de indicar essa experiencia para outra pessoa.' }
];

const volunteerQuestions: FeedbackQuestion[] = [
  { id: 'pontualidade', label: 'Pontualidade e presenca', hint: 'Cumprimento de horarios e combinados.' },
  { id: 'comprometimento', label: 'Comprometimento', hint: 'Engajamento com a atividade e responsabilidade assumida.' },
  { id: 'comunicacao', label: 'Comunicacao', hint: 'Clareza, disponibilidade para alinhamentos e retorno.' },
  { id: 'colaboracao', label: 'Colaboracao em equipe', hint: 'Trabalho conjunto com equipe, publico e outros voluntarios.' },
  { id: 'proatividade', label: 'Proatividade', hint: 'Capacidade de perceber necessidades e ajudar com autonomia.' },
  { id: 'empatia', label: 'Empatia e acolhimento', hint: 'Cuidado, escuta e postura humana durante a acao.' },
  { id: 'adaptabilidade', label: 'Adaptabilidade', hint: 'Flexibilidade diante de mudancas e imprevistos.' },
  { id: 'qualidade', label: 'Qualidade da entrega', hint: 'Capricho, atencao e efetividade nas tarefas realizadas.' },
  { id: 'respeito', label: 'Respeito as orientacoes', hint: 'Aderencia a regras, protocolos e combinados da instituicao.' },
  { id: 'recontratacao', label: 'Chamaria novamente', hint: 'Chance de convidar este voluntario para novas oportunidades.' }
];

function createInitialAnswers(questions: FeedbackQuestion[]): Record<string, number> {
  return questions.reduce<Record<string, number>>((acc, question) => {
    acc[question.id] = 5;
    return acc;
  }, {});
}

function calculateAverage(answers: Record<string, number>): number {
  const values = Object.values(answers);
  if (values.length === 0) return 5;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function parseAnswers(value?: string | null): { id: string; label: string; rating: number }[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as { respostas?: { id: string; label: string; nota: number }[] };
    return (parsed.respostas || []).map((answer) => ({
      id: answer.id,
      label: answer.label,
      rating: answer.nota
    }));
  } catch {
    return [];
  }
}

function formatDate(value?: string | null): string {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('pt-BR');
}

function isEligible(status: string): boolean {
  const normalized = status.toLowerCase();
  return normalized === 'aprovada' || normalized === 'aprovado' || normalized === 'concluida' || normalized === 'concluido';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'VM';
}

function getCampaignTitle(inscricao: ApiInscricao): string {
  return inscricao.oportunidade?.titulo || `Inscricao #${inscricao.id}`;
}

function getVolunteerName(inscricao: ApiInscricao): string {
  return inscricao.voluntario?.usuario?.nome || `Voluntario #${inscricao.voluntarioId}`;
}

function getOrganizationName(inscricao: ApiInscricao): string {
  return inscricao.oportunidade?.instituicao?.nome || 'Instituicao cadastrada';
}

function hasFeedback(feedbacks: ApiFeedback[], inscricaoId: number, autor: AutorFeedback): boolean {
  return feedbacks.some((feedback) => feedback.inscricaoId === inscricaoId && feedback.autor === autor);
}

function StarRating({
  value,
  onChange,
  readonly = false
}: {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(rating)}
          className={`rounded-md p-1 transition-colors ${readonly ? 'cursor-default' : 'hover:bg-[#FFD500]/20 focus:outline-none focus:ring-2 focus:ring-[#4A9DB5]'}`}
          aria-label={`${rating} estrela${rating > 1 ? 's' : ''}`}
        >
          <Star
            className={`h-5 w-5 ${rating <= value ? 'fill-[#FFD500] text-[#D7A900]' : 'text-gray-300'}`}
          />
        </button>
      ))}
    </div>
  );
}

export function FeedbacksPage({ user, isAdmin, isOrganizacao }: FeedbacksPageProps) {
  const [inscricoes, setInscricoes] = useState<ApiInscricao[]>([]);
  const [feedbacks, setFeedbacks] = useState<ApiFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mode, setMode] = useState<FeedbackMode>(isOrganizacao || isAdmin ? 'voluntario' : 'campanha');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const questions = mode === 'campanha' ? campaignQuestions : volunteerQuestions;
  const [answers, setAnswers] = useState<Record<string, number>>(() => createInitialAnswers(questions));
  const [comentario, setComentario] = useState('');

  const canEvaluateVolunteer = isOrganizacao || isAdmin;
  const canEvaluateCampaign = !!user?.voluntarioId;
  const autor: AutorFeedback = mode === 'voluntario' ? 'Instituicao' : 'Voluntario';

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [inscricoesData, feedbacksData] = await Promise.all([listarInscricoes(), listarFeedbacks()]);
      setInscricoes(inscricoesData);
      setFeedbacks(feedbacksData);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Nao foi possivel carregar a area de feedbacks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (mode === 'campanha' && !canEvaluateCampaign && canEvaluateVolunteer) {
      setMode('voluntario');
    }
    if (mode === 'voluntario' && !canEvaluateVolunteer && canEvaluateCampaign) {
      setMode('campanha');
    }
  }, [canEvaluateCampaign, canEvaluateVolunteer, mode]);

  const elegiveis = useMemo(() => {
    return inscricoes
      .filter((inscricao) => isEligible(inscricao.status))
      .filter((inscricao) => {
        if (isAdmin) return true;
        if (mode === 'campanha') return inscricao.voluntarioId === user?.voluntarioId;
        return inscricao.oportunidade?.instituicaoId === user?.instituicaoId;
      })
      .filter((inscricao) => !hasFeedback(feedbacks, inscricao.id, autor));
  }, [autor, feedbacks, inscricoes, isAdmin, mode, user?.instituicaoId, user?.voluntarioId]);

  const minhasAvaliacoes = useMemo(() => {
    return feedbacks
      .filter((feedback) => {
        if (isAdmin) return true;
        if (feedback.autor === 'Voluntario') return feedback.inscricao?.voluntarioId === user?.voluntarioId;
        return feedback.inscricao?.oportunidade?.instituicaoId === user?.instituicaoId;
      })
      .slice(0, 6);
  }, [feedbacks, isAdmin, user?.instituicaoId, user?.voluntarioId]);

  useEffect(() => {
    setSelectedId(elegiveis[0]?.id ?? null);
  }, [elegiveis]);

  const selectedInscricao = elegiveis.find((inscricao) => inscricao.id === selectedId) ?? null;
  const average = calculateAverage(answers);
  const roundedAverage = Math.max(1, Math.min(5, Math.round(average)));

  useEffect(() => {
    setAnswers(createInitialAnswers(questions));
    setComentario('');
  }, [mode]);

  const updateAnswer = (questionId: string, rating: number) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: rating
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedInscricao) return;

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const created = await criarFeedback({
        inscricaoId: selectedInscricao.id,
        autor,
        nota: roundedAverage,
        comentario: comentario.trim() || undefined,
        respostasJson: JSON.stringify({
          tipo: mode,
          media: Number(average.toFixed(1)),
          respostas: questions.map((question) => ({
            id: question.id,
            label: question.label,
            nota: answers[question.id] ?? 5
          }))
        })
      });
      setFeedbacks((current) => [created, ...current]);
      setComentario('');
      setAnswers(createInitialAnswers(questions));
      setSuccess('Feedback registrado com sucesso.');
      await loadData();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Erro ao registrar feedback.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-[#4A9DB5] to-[#5BACBD] py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/85">
            <MessageSquareText className="h-4 w-4" />
            Area de feedbacks
          </div>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Avaliacoes da experiencia voluntaria</h1>
          <p className="mt-2 max-w-2xl text-white/90">
            Avalie com criterios claros, nota por estrelas e um historico organizado para voluntarios, instituicoes e administracao.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#4A9DB5]/10 text-[#4A9DB5]">
                <MessageSquareText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">{feedbacks.length}</div>
                <div className="text-sm text-gray-600">feedbacks registrados</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FFD500]/20 text-[#B38F00]">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">{elegiveis.length}</div>
                <div className="text-sm text-gray-600">avaliacoes pendentes</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">{inscricoes.filter((item) => isEligible(item.status)).length}</div>
                <div className="text-sm text-gray-600">participacoes aptas</div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Carregando feedbacks...
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Novo feedback</h2>
                    <p className="text-sm text-gray-600">Escolha uma participacao aprovada ou concluida para avaliar.</p>
                  </div>
                  <div className="inline-flex overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-1">
                    {canEvaluateCampaign && (
                      <button
                        onClick={() => setMode('campanha')}
                        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${mode === 'campanha' ? 'bg-[#4A9DB5] text-white' : 'text-gray-700 hover:bg-white'}`}
                      >
                        Campanha
                      </button>
                    )}
                    {canEvaluateVolunteer && (
                      <button
                        onClick={() => setMode('voluntario')}
                        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${mode === 'voluntario' ? 'bg-[#4A9DB5] text-white' : 'text-gray-700 hover:bg-white'}`}
                      >
                        Voluntario
                      </button>
                    )}
                  </div>
                </div>

                {elegiveis.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
                    <Award className="mx-auto mb-3 h-10 w-10 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">Nenhuma avaliacao pendente</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Quando houver uma inscricao aprovada ou concluida sem feedback, ela aparecera aqui.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-gray-700">
                        {mode === 'campanha' ? 'Campanha avaliada' : 'Voluntario avaliado'}
                      </span>
                      <select
                        value={selectedId ?? ''}
                        onChange={(event) => setSelectedId(Number(event.target.value))}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-[#4A9DB5] focus:outline-none focus:ring-2 focus:ring-[#4A9DB5]/20"
                      >
                        {elegiveis.map((inscricao) => (
                          <option key={inscricao.id} value={inscricao.id}>
                            {mode === 'campanha'
                              ? `${getCampaignTitle(inscricao)} - ${getOrganizationName(inscricao)}`
                              : `${getVolunteerName(inscricao)} - ${getCampaignTitle(inscricao)}`}
                          </option>
                        ))}
                      </select>
                    </label>

                    {selectedInscricao && (
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4A9DB5] text-sm font-semibold text-white">
                            {getInitials(mode === 'campanha' ? getCampaignTitle(selectedInscricao) : getVolunteerName(selectedInscricao))}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {mode === 'campanha' ? getCampaignTitle(selectedInscricao) : getVolunteerName(selectedInscricao)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {mode === 'campanha' ? getOrganizationName(selectedInscricao) : getCampaignTitle(selectedInscricao)}
                            </p>
                          </div>
                          </div>
                          <div className="rounded-lg bg-white px-4 py-3 text-left shadow-sm sm:text-right">
                            <div className="text-xs font-medium uppercase text-gray-500">Media atual</div>
                            <div className="flex items-center gap-2 sm:justify-end">
                              <span className="text-2xl font-semibold text-gray-900">{average.toFixed(1)}</span>
                              <Star className="h-5 w-5 fill-[#FFD500] text-[#D7A900]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
                        <ClipboardCheck className="h-5 w-5 text-[#4A9DB5]" />
                        <div>
                          <h3 className="font-medium text-gray-900">Criterios da avaliacao</h3>
                          <p className="text-sm text-gray-600">Responda todas as 10 perguntas usando notas de 1 a 5 estrelas.</p>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {questions.map((question, index) => (
                          <div key={question.id} className="grid gap-3 px-4 py-4 md:grid-cols-[1fr_auto] md:items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4A9DB5]/10 text-xs font-semibold text-[#2F7F94]">
                                  {index + 1}
                                </span>
                                <h4 className="font-medium text-gray-900">{question.label}</h4>
                              </div>
                              <p className="mt-1 pl-9 text-sm text-gray-600">{question.hint}</p>
                            </div>
                            <div className="pl-9 md:pl-0">
                              <StarRating value={answers[question.id] ?? 5} onChange={(rating) => updateAnswer(question.id, rating)} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-gray-700">Comentario final</span>
                      <textarea
                        value={comentario}
                        onChange={(event) => setComentario(event.target.value.slice(0, 500))}
                        rows={5}
                        placeholder={mode === 'campanha' ? 'Acrescente um ponto forte, um ponto de melhoria ou um relato da experiencia...' : 'Acrescente observacoes sobre conduta, destaque ou orientacoes para proximas acoes...'}
                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#4A9DB5] focus:outline-none focus:ring-2 focus:ring-[#4A9DB5]/20"
                      />
                      <span className="mt-1 block text-right text-xs text-gray-500">{comentario.length}/500</span>
                    </label>

                    <button
                      type="submit"
                      disabled={saving || !selectedInscricao}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFD500] px-5 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-[#FFC700] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Enviar avaliacao com {average.toFixed(1)} estrelas
                    </button>
                  </form>
                )}
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Historico recente</h3>
                <div className="space-y-3">
                  {minhasAvaliacoes.length === 0 ? (
                    <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">Nenhum feedback registrado ainda.</p>
                  ) : (
                    minhasAvaliacoes.map((feedback) => {
                      const detailedAnswers = parseAnswers(feedback.respostasJson);

                      return (
                      <div key={feedback.id} className="rounded-lg bg-gray-50 p-4">
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {feedback.autor === 'Voluntario'
                                ? getCampaignTitle(feedback.inscricao || {} as ApiInscricao)
                                : getVolunteerName(feedback.inscricao || {} as ApiInscricao)}
                            </div>
                            <div className="text-xs text-gray-500">{formatDate(feedback.criadoEm)}</div>
                          </div>
                          <StarRating value={feedback.nota} readonly />
                        </div>
                        {feedback.comentario && <p className="text-sm text-gray-600">{feedback.comentario}</p>}
                        {detailedAnswers.length > 0 && (
                          <div className="mt-3 grid gap-2">
                            {detailedAnswers.slice(0, 3).map((answer) => (
                              <div key={answer.id} className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-xs">
                                <span className="text-gray-600">{answer.label}</span>
                                <span className="font-semibold text-gray-900">{answer.rating}/5</span>
                              </div>
                            ))}
                            {detailedAnswers.length > 3 && (
                              <div className="text-xs text-gray-500">+{detailedAnswers.length - 3} criterios avaliados</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                    })
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-3 flex items-center gap-2 text-gray-900">
                  <UserRoundCheck className="h-5 w-5 text-[#4A9DB5]" />
                  <h3 className="text-lg font-semibold">Boas praticas</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>Use comentarios objetivos sobre presenca, comunicacao, preparo e acolhimento.</p>
                  <p>A nota deve refletir a experiencia completa da participacao.</p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
