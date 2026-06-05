using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.HttpOverrides;
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
        ?? (builder.Environment.IsDevelopment()
            ? "Server=127.0.0.1;Port=3306;Database=voluntariado_tccem;Uid=root;Pwd=;TreatTinyAsBoolean=true;"
            : throw new InvalidOperationException("ConnectionStrings__DefaultConnection is required in production."));

    var serverVersion = ServerVersion.AutoDetect(connectionString);
    options.UseMySql(connectionString, serverVersion);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? builder.Configuration["Cors:AllowedOrigins"]?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            ?? [];

        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod();
            return;
        }

        if (builder.Environment.IsDevelopment())
        {
            policy.SetIsOriginAllowed(origin =>
                Uri.TryCreate(origin, UriKind.Absolute, out var uri)
                && uri.Scheme is "http" or "https"
                && uri.Host is "localhost" or "127.0.0.1")
                .AllowAnyHeader()
                .AllowAnyMethod();
            return;
        }

        throw new InvalidOperationException("Cors__AllowedOrigins__0 is required in production.");
    });
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

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

var seedEnabled = builder.Configuration.GetValue("SeedDatabase", false);
if (seedEnabled)
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    AppDbSeeder.Seed(db);
}

var swaggerEnabled = app.Environment.IsDevelopment() || builder.Configuration.GetValue("Swagger:Enabled", false);
if (swaggerEnabled)
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Instituto Vitor Gabriel API v1");
        options.RoutePrefix = "swagger";
    });
}

app.UseCors("Frontend");
app.MapControllers();

app.MapGet("/", () => Results.Ok(new { name = "Instituto Vitor Gabriel API", status = "ok" }));
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));

app.Run();
