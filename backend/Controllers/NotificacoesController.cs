using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voluntariado.Api.Data;

namespace Voluntariado.Api.Controllers;

[ApiController]
[Route("notificacoes")]
public class NotificacoesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] long? usuarioId)
    {
        var query = db.Notificacoes.AsNoTracking();

        if (usuarioId is not null)
        {
            query = query.Where(x => x.UsuarioId == usuarioId);
        }

        return Ok(await query.OrderByDescending(x => x.Id).ToListAsync());
    }
}
