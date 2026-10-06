using Microsoft.EntityFrameworkCore;
using pim3.API.Models;

namespace pim3.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Propriedade> Propriedades { get; set; }
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Estoque> Estoques { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuração de precisão para valores decimais (obrigatório para Taxas e Quantidades)
            modelBuilder.Entity<Propriedade>()
                .Property(p => p.TaxaRoyalties).HasPrecision(5, 2);

            modelBuilder.Entity<Estoque>()
                .Property(e => e.QuantidadeAtual).HasPrecision(18, 2);

            modelBuilder.Entity<Estoque>()
                .Property(e => e.MinimoSugerido).HasPrecision(18, 2);

            // Garante que o CNPJ seja único (Regra de Negócio)
            modelBuilder.Entity<Propriedade>()
                .HasIndex(p => p.Cnpj).IsUnique();

            // Define o valor padrão da senha como "123mudar" para novos registros de Propriedade
            modelBuilder.Entity<Propriedade>()
                .Property(p => p.Senha)
                .HasDefaultValue("123mudar");

            // Desativa o Cascade nativo do EF Core para que 
            // a Trigger do SQL Server faça a limpeza controlada.
            modelBuilder.Entity<Estoque>()
                .HasOne(e => e.Propriedade)
                .WithMany(p => p.Estoques)
                .HasForeignKey(e => e.PropriedadeId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Estoque>()
                .HasOne(e => e.Produto)
                .WithMany(pr => pr.Estoques)
                .HasForeignKey(e => e.ProdutoId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}