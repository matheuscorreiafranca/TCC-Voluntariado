using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voluntariado.Api.Data;

namespace Voluntariado.Api.Controllers;

[ApiController]
[Route("habilidades")]
public class HabilidadesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await db.Habilidades.AsNoTracking().OrderBy(x => x.Nome).ToListAsync());
    }
}
