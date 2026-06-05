FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Back-end/VoluntaMais.Api.csproj Back-end/
RUN dotnet restore Back-end/VoluntaMais.Api.csproj

COPY Back-end/ Back-end/
RUN dotnet publish Back-end/VoluntaMais.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production
ENV PORT=10000

COPY --from=build /app/publish .
EXPOSE 10000

ENTRYPOINT ["dotnet", "VoluntaMais.Api.dll"]
