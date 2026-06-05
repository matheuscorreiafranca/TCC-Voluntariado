# Deploy em VPS com Docker Compose

## O que contratar/configurar

- VPS Ubuntu 22.04 ou 24.04 com 2 vCPU, 2 GB RAM e 30 GB SSD ou superior.
- Dois registros DNS `A` apontando para o IP da VPS:
  - `sistema.seudominio.com.br`
  - `api.sistema.seudominio.com.br`
- Portas liberadas no firewall: `22`, `80` e `443`.

## Preparacao do servidor

```bash
sudo apt update
sudo apt install -y ca-certificates curl git ufw
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

Entre novamente no SSH para ativar o grupo `docker`.

## Publicacao

```bash
git clone <URL_DO_REPOSITORIO> tc-voluntariado
cd tc-voluntariado
cp .env.example .env
nano .env
```

Edite também `nginx/conf.d/voluntariado.conf` e troque `sistema.seudominio.com.br` e `api.sistema.seudominio.com.br` pelos domínios reais.

Para emitir certificados:

```bash
mkdir -p certbot/www certbot/conf
docker compose up -d mysql backend frontend
docker run --rm -p 80:80 -v "$PWD/certbot/conf:/etc/letsencrypt" -v "$PWD/certbot/www:/var/www/certbot" certbot/certbot certonly --standalone -d sistema.seudominio.com.br --email admin@seudominio.com.br --agree-tos --no-eff-email
docker run --rm -p 80:80 -v "$PWD/certbot/conf:/etc/letsencrypt" -v "$PWD/certbot/www:/var/www/certbot" certbot/certbot certonly --standalone -d api.sistema.seudominio.com.br --email admin@seudominio.com.br --agree-tos --no-eff-email
docker compose up -d --build
```

## Operacao

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
docker compose restart backend frontend nginx
docker compose down
docker compose up -d --build
```

## Backup MySQL

```bash
mkdir -p backups
docker compose exec mysql mysqldump -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" > "backups/voluntariado_$(date +%F_%H%M).sql"
```
