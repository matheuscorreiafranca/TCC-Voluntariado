using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Voluntariado.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Server=localhost;Port=3306;Database=voluntariado_tccem;Uid=root;Pwd=;";
    var serverVersion = ServerVersion.AutoDetect(connectionString);
    options.UseMySql(connectionString, serverVersion);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy
            .SetIsOriginAllowed(origin =>
            {
                if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri))
                {
                    return false;
                }

                return uri.Scheme is "http" or "https"
                    && (uri.Host is "localhost" or "127.0.0.1"
                        || uri.Host.StartsWith("192.168.", StringComparison.Ordinal)
                        || uri.Host.StartsWith("10.", StringComparison.Ordinal)
                        || uri.Host.StartsWith("172.", StringComparison.Ordinal));
            })
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Instituto Vitor Gabriel API",
        Version = "v1",
        Description = "MVP de voluntariado do Instituto Vitor Gabriel com eventos, projetos, campanhas, voluntários, inscrições e feedbacks."
    });
});

var app = builder.Build();

var seedEnabled = builder.Configuration.GetValue("SeedDatabase", false);
if (seedEnabled)
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    AppDbSeeder.Seed(db);
}

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Instituto Vitor Gabriel API v1");
    options.RoutePrefix = "swagger";
});

app.UseCors("Frontend");
app.MapControllers();

app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();
