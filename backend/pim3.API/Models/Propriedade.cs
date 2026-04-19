namespace pim3.API.Models
{
    public class Propriedade
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string RazaoSocial { get; set; } = string.Empty;
        public string Cnpj { get; set; } = string.Empty;
        public string Uf { get; set; } = string.Empty; // Cidade/Estado
        public bool EhFranqueadora { get; set; }
        public decimal TaxaRoyalties { get; set; }
        public DateTime DataAbertura { get; set; }

        // Relacionamento: Uma propriedade tem muitos itens no estoque
        public ICollection<Estoque> Estoques { get; set; } = new List<Estoque>();
    }
}