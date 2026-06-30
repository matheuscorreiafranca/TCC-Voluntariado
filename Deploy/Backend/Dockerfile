FROM mcr.microsoft.com/dotnet/sdk:8.0-jammy AS build
WORKDIR /src

COPY VoluntaMais.Api.csproj ./
RUN dotnet restore VoluntaMais.Api.csproj

COPY . ./
RUN dotnet publish VoluntaMais.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0-jammy AS runtime
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production
ENV PORT=10000
ENV DOTNET_EnableDiagnostics=0
ENV DOTNET_gcServer=0

COPY --from=build /app/publish .
EXPOSE 10000

ENTRYPOINT ["dotnet", "VoluntaMais.Api.dll"]
