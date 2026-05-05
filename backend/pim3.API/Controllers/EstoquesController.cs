using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pim3.API.Data;
using pim3.API.DTOs;
using pim3.API.Models;

namespace pim3.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstoquesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EstoquesController(AppDbContext context) { _context = context; }

        // GET: api/Estoques/Propriedade/5
        // Filtra para que a franquia veja APENAS o dela
        [HttpGet("Propriedade/{propriedadeId}")]
        public async Task<ActionResult<IEnumerable<Estoque>>> GetEstoque(int propriedadeId)
        {
            return await _context.Estoques
                .Include(e => e.Produto) // FUNDAMENTAL para o 'i.produto?.nome' no React funcionar
                .Where(e => e.PropriedadeId == propriedadeId)
                .ToListAsync();
        }

        [HttpPost]
public async Task<ActionResult<Estoque>> PostEstoque(CriarEstoqueDTO dto)
        {
            // 1. Verificação de segurança: O DTO ou o objeto Produto dentro dele estão nulos?
            if (dto == null || dto.Produto == null || string.IsNullOrEmpty(dto.Produto.Nome))
            {
                return BadRequest("Os dados do produto não foram informados corretamente.");
            }

            // 2. Extraia o nome para uma variável local
            // Isso evita o erro de 'LINQ query parameter expression'
            string nomeBusca = dto.Produto.Nome.ToLower();

            var produto = await _context.Produtos
                .FirstOrDefaultAsync(p => p.Nome.ToLower() == nomeBusca);

            if (produto == null)
            {
                produto = new Produto
                {
                    Nome = dto.Produto?.Nome ?? "Sem Nome",
                    Categoria = dto.Produto?.Categoria ?? "",
                    UnidadePeso = dto.Produto?.UnidadePeso ?? "",
                    Status = "Ativo",
                    DataFabricacao = dto.DataFabricacao ?? DateTime.Now,
                    Validade = dto.Validade ?? DateTime.Now.AddMonths(1)
                };
                _context.Produtos.Add(produto);
                await _context.SaveChangesAsync();
            }

            var novoEstoque = new Estoque
            {
                ProdutoId = produto.Id,
                PropriedadeId = dto.PropriedadeId,
                QuantidadeAtual = dto.QuantidadeAtual,
                MinimoSugerido = dto.MinimoSugerido,
                Unidade = dto.Unidade ?? "",
                DataFabricacao = dto.DataFabricacao,
                Validade = dto.Validade
            };

            _context.Estoques.Add(novoEstoque);
            await _context.SaveChangesAsync();

            // Carrega o nome do produto para devolver ao React
            await _context.Entry(novoEstoque).Reference(e => e.Produto).LoadAsync();

            return Ok(novoEstoque);
        }
    }

}
