namespace pim3.API.Models
{
    public class Produto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public string UnidadePeso { get; set; } = string.Empty; // ex: "KG"
        public string Status { get; set; } = string.Empty; // ex: "Ativo", "Descontinuado"
        public DateTime DataFabricacao { get; set; }
        public DateTime Validade { get; set; }

        public ICollection<Estoque> Estoques { get; set; } = new List<Estoque>();
    }
}
