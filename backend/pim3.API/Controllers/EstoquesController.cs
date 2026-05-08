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
            if (dto == null || dto.Produto == null || string.IsNullOrEmpty(dto.Produto.Nome))
            {
                return BadRequest("Os dados do produto não foram informados corretamente.");
            }

            // REMOVEMOS a busca por 'nomeBusca'. 
            // Criamos SEMPRE um novo produto para garantir que ele pertença apenas a esta propriedade.
            var produto = new Produto
            {
                Nome = dto.Produto.Nome,
                Categoria = dto.Produto.Categoria ?? "",
                UnidadePeso = dto.Produto.UnidadePeso ?? "",
                Status = "Ativo",
                // No seu modelo, a tabela Produto também tem essas datas, então preenchemos
                DataFabricacao = dto.DataFabricacao ?? DateTime.Now,
                Validade = dto.Validade ?? DateTime.Now.AddMonths(1)
            };

            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync(); // Aqui geramos o Id do Produto único

            var novoEstoque = new Estoque
            {
                ProdutoId = produto.Id, // Vincula ao produto exclusivo que acabamos de criar
                PropriedadeId = dto.PropriedadeId,
                QuantidadeAtual = dto.QuantidadeAtual,
                MinimoSugerido = dto.MinimoSugerido,
                Unidade = dto.Unidade ?? "",
                DataFabricacao = dto.DataFabricacao,
                Validade = dto.Validade
            };

            _context.Estoques.Add(novoEstoque);
            await _context.SaveChangesAsync();

            await _context.Entry(novoEstoque).Reference(e => e.Produto).LoadAsync();

            return Ok(novoEstoque);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEstoque(int id, CriarEstoqueDTO dto)
        {
            // 1. Busca o estoque no banco incluindo o produto
            var estoque = await _context.Estoques
                .Include(e => e.Produto)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (estoque == null) return NotFound();

            // 2. Atualiza os dados do Produto vinculado
            if (estoque.Produto != null && dto.Produto != null)
            {
                estoque.Produto.Nome = dto.Produto.Nome ?? "";
                estoque.Produto.Categoria = dto.Produto.Categoria ?? "";
                estoque.Produto.UnidadePeso = dto.Produto.UnidadePeso ?? "";
            }

            // 3. Atualiza os dados do Estoque
            estoque.QuantidadeAtual = dto.QuantidadeAtual;
            estoque.MinimoSugerido = dto.MinimoSugerido;
            estoque.Unidade = dto.Unidade ?? "";
            estoque.DataFabricacao = dto.DataFabricacao;
            estoque.Validade = dto.Validade;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EstoqueExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // Método auxiliar que o EF costuma pedir no final do Controller
        private bool EstoqueExists(int id)
        {
            return _context.Estoques.Any(e => e.Id == id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEstoque(int id)
        {
            // 1. Buscamos o estoque pelo ID (que vem do React) 
            // Incluímos o Produto para podermos deletá-lo também
            var estoque = await _context.Estoques
                .Include(e => e.Produto)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (estoque == null)
            {
                return NotFound("Item de estoque não encontrado.");
            }

            // Armazenamos o produto vinculado antes de remover o estoque
            var produtoVinculado = estoque.Produto;

            // 2. Removemos o estoque primeiro (devido à restrição de chave estrangeira)
            _context.Estoques.Remove(estoque);

            // 3. Agora removemos o produto. Como garantimos no POST que ele é exclusivo, 
            // não há risco de afetar outras franquias.
            if (produtoVinculado != null)
            {
                _context.Produtos.Remove(produtoVinculado);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

}
