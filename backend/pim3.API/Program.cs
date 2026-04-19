using Microsoft.EntityFrameworkCore; // NOVO: Necessário para o UseSqlServer
using pim3.API.Data; // NOVO: Substitua pelo namespace correto da sua pasta Data

var builder = WebApplication.CreateBuilder(args);

// --- ADICIONE ESTA LINHA ABAIXO ---
// Configura o Banco de Dados usando a ConnectionString do appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// ---------------------------------

builder.Services.AddControllers();

// OpenAPI (Swagger)
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();