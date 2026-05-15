using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VoluntaMais.Api.Data;

namespace VoluntaMais.Api.Controllers
{
    /// <summary>
    /// Controller público para dados de lookup (categorias, ocupações, habilidades).
    /// Não requer autenticação.
    /// </summary>
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class LookupController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LookupController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Listar todas as categorias (usadas como áreas de afinidade).
        /// </summary>
        [HttpGet("categorias")]
        public async Task<IActionResult> ListarCategorias()
        {
            var categorias = await _context.Categorias
                .OrderBy(c => c.Nome)
                .Select(c => new { c.Id, c.Nome })
                .ToListAsync();

            return Ok(categorias);
        }

        /// <summary>
        /// Listar todas as ocupações disponíveis.
        /// </summary>
        [HttpGet("ocupacoes")]
        public async Task<IActionResult> ListarOcupacoes()
        {
            var ocupacoes = await _context.Ocupacoes
                .OrderBy(o => o.Id)
                .Select(o => new { o.Id, o.Nome })
                .ToListAsync();

            return Ok(ocupacoes);
        }

        /// <summary>
        /// Listar todas as habilidades disponíveis.
        /// </summary>
        [HttpGet("habilidades")]
        public async Task<IActionResult> ListarHabilidades()
        {
            var habilidades = await _context.Habilidades
                .OrderBy(h => h.Nome)
                .Select(h => new { h.Id, h.Nome })
                .ToListAsync();

            return Ok(habilidades);
        }
    }
}
