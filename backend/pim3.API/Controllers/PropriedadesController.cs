using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pim3.API.Data;
using pim3.API.Models;

namespace pim3.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropriedadesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PropriedadesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Propriedades (READ - Listar tudo)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Propriedade>>> GetPropriedades()
        {
            return await _context.Propriedades.ToListAsync();
        }

        // GET: api/Propriedades/5 (READ - Ver um específico)
        [HttpGet("{id}")]
        public async Task<ActionResult<Propriedade>> GetPropriedade(int id)
        {
            var propriedade = await _context.Propriedades.FindAsync(id);
            if (propriedade == null) return NotFound();
            return propriedade;
        }

        // POST: api/Propriedades (CREATE - Cadastrar)
        [HttpPost]
        public async Task<ActionResult<Propriedade>> PostPropriedade(Propriedade propriedade)
        {
            _context.Propriedades.Add(propriedade);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPropriedade), new { id = propriedade.Id }, propriedade);
        }

        // PUT: api/Propriedades/5 (UPDATE - Editar)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPropriedade(int id, Propriedade propriedade)
        {
            if (id != propriedade.Id) return BadRequest();

            _context.Entry(propriedade).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Propriedades.Any(e => e.Id == id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Propriedades/5 (DELETE - Excluir)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePropriedade(int id)
        {
            var propriedade = await _context.Propriedades.FindAsync(id);
            if (propriedade == null) return NotFound();

            _context.Propriedades.Remove(propriedade);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}