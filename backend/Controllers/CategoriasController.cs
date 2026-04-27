using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voluntariado.Api.Data;

namespace Voluntariado.Api.Controllers;

[ApiController]
[Route("categorias")]
public class CategoriasController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await db.Categorias.AsNoTracking().OrderBy(x => x.Nome).ToListAsync());
    }
}
