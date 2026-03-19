namespace pim3.API.Models
{
    public class Empresa
    {
        public int Id { get; set; } // Chave primária automática
        public string Nome { get; set; } = string.Empty;
        public string Cnpj { get; set; } = string.Empty;

        // Define se é Matriz (true) ou Filial (false)
        public bool EhMatriz { get; set; }
    }
}
