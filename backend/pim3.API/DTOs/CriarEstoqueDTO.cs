namespace pim3.API.DTOs
{
    public class CriarEstoqueDTO
    {
        // O '?' remove o aviso CS8618 dizendo que pode ser nulo
        public ProdutoDTO? Produto { get; set; }

        public decimal QuantidadeAtual { get; set; }
        public decimal MinimoSugerido { get; set; }
        public string? Unidade { get; set; } // Adicione '?' aqui também
        public DateTime? DataFabricacao { get; set; }
        public DateTime? Validade { get; set; }
        public int PropriedadeId { get; set; }
    }

    public class ProdutoDTO
    {
        public string? Nome { get; set; }
        public string? Categoria { get; set; }
        public string? UnidadePeso { get; set; }
    }
}
