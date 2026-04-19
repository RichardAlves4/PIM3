namespace pim3.API.Models
{
    public class Estoque
    {
        public int Id { get; set; }

        // Chaves Estrangeiras
        public int PropriedadeId { get; set; }
        public Propriedade? Propriedade { get; set; }

        public int ProdutoId { get; set; }
        public Produto? Produto { get; set; }

        public decimal QuantidadeAtual { get; set; }
        public decimal MinimoSugerido { get; set; }
    }
}