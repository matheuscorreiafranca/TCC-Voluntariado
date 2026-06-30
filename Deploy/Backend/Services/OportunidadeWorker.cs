using Microsoft.EntityFrameworkCore;
using VoluntaMais.Api.Data;
using VoluntaMais.Api.Models;

namespace VoluntaMais.Api.Services
{
    public class OportunidadeWorker : BackgroundService
    {
        private readonly ILogger<OportunidadeWorker> _logger;
        private readonly IServiceProvider _serviceProvider;

        public OportunidadeWorker(ILogger<OportunidadeWorker> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("OportunidadeWorker started.");

            // Verifica a cada minuto para o desenvolvimento/homologação.
            // Para produção, poderia ser a cada hora.
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await EncerrarOportunidadesExpiradasAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred executing OportunidadeWorker.");
                }

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }

        private async Task EncerrarOportunidadesExpiradasAsync(CancellationToken stoppingToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // Pegamos apenas a data atual para comparar com a dataFim
            var agora = DateTime.UtcNow.Date;

            // Encerra as oportunidades que já passaram da DataFim
            var oportunidadesExpiradas = await context.Oportunidades
                .Where(o => (o.Status == OportunidadeStatus.Ativa || o.Status == OportunidadeStatus.Aprovada) 
                            && o.DataFim.HasValue 
                            && o.DataFim.Value.Date < agora)
                .ToListAsync(stoppingToken);

            if (oportunidadesExpiradas.Any())
            {
                foreach (var op in oportunidadesExpiradas)
                {
                    op.Status = OportunidadeStatus.Encerrada;
                    op.DataAtualizacao = DateTime.UtcNow;
                }

                await context.SaveChangesAsync(stoppingToken);
                _logger.LogInformation($"Encerradas {oportunidadesExpiradas.Count} oportunidades expiradas automaticamente.");
            }
        }
    }
}
