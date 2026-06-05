FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY backend/Voluntariado.Api.csproj backend/
RUN dotnet restore backend/Voluntariado.Api.csproj

COPY backend/ backend/
RUN dotnet publish backend/Voluntariado.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:5000

COPY --from=build /app/publish .
EXPOSE 5000

ENTRYPOINT ["dotnet", "Voluntariado.Api.dll"]
