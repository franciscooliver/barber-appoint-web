.PHONY: deploy deploy-prod build-prod down-prod logs logs-traefik check-acme deploy-check check-connection check-env check-traefik check-routes diagnose-routing debug-traefik check-ssl restart-ssl

# Variáveis
SERVER_USER = root
SERVER_HOST = 157.245.80.107
PROJECT_PATH = /opt/barber-appoint/web
SSH_OPTS = -o ConnectTimeout=30 \
           -o ServerAliveInterval=60 \
           -o ServerAliveCountMax=10 \
           -o TCPKeepAlive=yes \
           -o BatchMode=yes \
           -o ConnectionAttempts=3
MAX_RETRIES = 5
SLEEP_TIME = 20
BUILD_TIMEOUT = 1200

check-connection:
	@echo "Checking SSH connection..."
	@for i in $$(seq 1 $(MAX_RETRIES)); do \
		if ssh $(SSH_OPTS) $(SERVER_USER)@$(SERVER_HOST) 'exit' 2>/dev/null; then \
			echo "SSH connection successful!"; \
			exit 0; \
		else \
			echo "Connection attempt $$i failed. Waiting $(SLEEP_TIME) seconds..."; \
			sleep $(SLEEP_TIME); \
		fi; \
	done; \
	echo "Could not establish SSH connection after $(MAX_RETRIES) attempts"; \
	exit 1

check-env:
	@echo "Checking environment variables..."
	@ssh $(SSH_OPTS) $(SERVER_USER)@$(SERVER_HOST) 'cd $(PROJECT_PATH) && { \
		if [ ! -f .env.prod ]; then \
			echo "Error: .env.prod file not found"; \
			exit 1; \
		fi; \
		DOMAIN=$$(grep "^DOMAIN=" .env.prod | cut -d= -f2); \
		ACME_EMAIL=$$(grep "^ACME_EMAIL=" .env.prod | cut -d= -f2 | tr -d "\\\""); \
		if [ "$$DOMAIN" != "top-code.dev.br" ]; then \
			echo "Error: DOMAIN must be top-code.dev.br"; \
			exit 1; \
		fi; \
		if ! echo "$$ACME_EMAIL" | grep -qE "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$$"; then \
			echo "Error: ACME_EMAIL must be a valid email address"; \
			exit 1; \
		fi; \
		echo "Environment validation passed with:"; \
		echo "DOMAIN=$$DOMAIN"; \
		echo "ACME_EMAIL=$$ACME_EMAIL"; \
	}'

check-traefik:
	@echo "Checking Traefik configuration..."
	@ssh $(SSH_OPTS) $(SERVER_USER)@$(SERVER_HOST) '\
		cd $(PROJECT_PATH) && \
		echo "Checking Docker status..." && \
		systemctl status docker --no-pager && \
		echo "\nChecking Traefik container..." && \
		docker compose -f docker-compose.prod.yml ps traefik && \
		if ! docker compose -f docker-compose.prod.yml ps traefik | grep -q "running"; then \
			echo "\nTraefik container is not running. Attempting to show logs:" && \
			docker compose -f docker-compose.prod.yml logs traefik --tail=50 && \
			echo "\nContainer status:" && \
			docker ps -a --filter name=traefik && \
			exit 1; \
		fi'

debug-traefik:
	@echo "Debugging Traefik..."
	@ssh $(SSH_OPTS) $(SERVER_USER)@$(SERVER_HOST) '\
		cd $(PROJECT_PATH) && \
		echo "1. Checking Docker compose configuration:" && \
		docker compose -f docker-compose.prod.yml config && \
		echo "\n2. Restarting Traefik container:" && \
		docker compose -f docker-compose.prod.yml up -d traefik && \
		echo "\n3. Waiting for container to start..." && \
		sleep 10 && \
		echo "\n4. Container status:" && \
		docker compose -f docker-compose.prod.yml ps traefik && \
		echo "\n5. Recent logs:" && \
		docker compose -f docker-compose.prod.yml logs --tail=50 traefik'

check-routes:
	@echo "🔍 Checking Traefik routes..."
	@ssh $(SSH_OPTS) $(SERVER_USER)@$(SERVER_HOST) '\
		cd $(PROJECT_PATH) && \
		echo "1. Checking Traefik status:" && \
		docker compose -f docker-compose.prod.yml ps traefik && \
		echo "\n2. Verifying configured routes:" && \
		docker compose -f docker-compose.prod.yml exec traefik traefik api --api.insecure=true 2>/dev/null || true && \
		echo "\n3. Testing domain resolution:" && \
		source .env.prod && \
		echo "Testing domain: $$DOMAIN" && \
		curl -v -H "Host: $$DOMAIN" http://localhost:80 && \
		echo "\n4. Checking Traefik logs:" && \
		docker compose -f docker-compose.prod.yml logs traefik --tail=50'

diagnose-routing:
	@echo "🔄 Starting routing diagnosis..."
	@ssh $(SSH_OPTS) $(SERVER_USER)@$(SERVER_HOST) '\
		cd $(PROJECT_PATH) && \
		echo "1. Current directory contents:" && \
		ls -la && \
		echo "\n2. Docker networks:" && \
		docker network ls && \
		echo "\n3. Environment variables:" && \
		cat .env | grep -v "PASSWORD\|KEY" && \
		echo "\n4. Docker compose config:" && \
		docker compose -f docker-compose.prod.yml config && \
		echo "\n5. Container status:" && \
		docker compose -f docker-compose.prod.yml ps && \
		echo "\n6. Network connections:" && \
		ss -tulpn | grep -E ":(80|443)" && \
		echo "\n7. Docker network inspect:" && \
		docker network inspect $(shell basename $(PROJECT_PATH))_default && \
		echo "\n8. Traefik dynamic config:" && \
		docker compose -f docker-compose.prod.yml exec traefik cat /etc/traefik/dynamic_conf.yml || true'

check-ssl:
	@echo "Checking SSL configuration..."
	@ssh $(SSH_OPTS) $(SERVER_USER)@$(SERVER_HOST) '\
		cd $(PROJECT_PATH) && \
		echo "Checking environment..." && \
		if [ ! -f .env ]; then \
			echo "Error: .env file not found"; \
			exit 1; \
		fi && \
		source .env && \
		ACME_EMAIL=$${ACME_EMAIL//\\"/"} && \
		echo "ACME Email: $$ACME_EMAIL" && \
		echo "Domain: $$DOMAIN" && \
		echo "Checking acme.json..." && \
		if [ ! -f acme.json ]; then \
			echo "Creating acme.json..." && \
			touch acme.json; \
		fi && \
		chmod 600 acme.json && \
		echo "Restarting Traefik with new configuration..." && \
		docker compose -f docker-compose.prod.yml restart traefik && \
		sleep 10 && \
		if docker compose -f docker-compose.prod.yml logs traefik | grep -i "error"; then \
			echo "Found errors in Traefik logs"; \
			docker compose -f docker-compose.prod.yml logs traefik --tail=50; \
			exit 1; \
		fi'

restart-ssl:
	@echo "Restarting SSL configuration..."
	@ssh $(SSH_OPTS) $(SERVER_USER)@$(SERVER_HOST) '\
		cd $(PROJECT_PATH) && \
		echo "Removing old certificates..." && \
		rm -f acme.json && \
		touch acme.json && \
		chmod 600 acme.json && \
		echo "Restarting Traefik..." && \
		docker compose -f docker-compose.prod.yml restart traefik && \
		sleep 10 && \
		echo "New certificate status:" && \
		docker compose -f docker-compose.prod.yml logs --tail=50 traefik'

deploy: check-connection check-env
	@echo "Starting deployment process..."
	@make check-ssl || (echo "WARNING: SSL check failed, continuing anyway...")
	@make check-traefik || (echo "WARNING: Traefik check failed, attempting to fix..." && make debug-traefik)
	@make deploy-prod
	@make check-routes || (echo "WARNING: Route check failed. Running diagnosis..." && make diagnose-routing)
	@echo "Deployment process completed"

deploy-prod:
	@echo "🔄 Starting deployment process..."
	@ssh $(SSH_OPTS) $(SERVER_USER)@$(SERVER_HOST) '\
		cd $(PROJECT_PATH) && \
		docker compose -f docker-compose.prod.yml down --remove-orphans --volumes || true && \
		rm -rf * .env* && \
		mkdir -p $(PROJECT_PATH) && \
		chmod 755 $(PROJECT_PATH)'

	@echo "📂 Copying project files..."
	@rsync -avz --timeout=60 --progress \
		--exclude 'node_modules' \
		--exclude '.git' \
		--exclude 'dist' \
		./ $(SERVER_USER)@$(SERVER_HOST):$(PROJECT_PATH)/

	@echo "⚙️ Setting up environment..."
	@ssh $(SSH_OPTS) $(SERVER_USER)@$(SERVER_HOST) '\
		cd $(PROJECT_PATH) && \
		cp .env.prod .env && \
		sed -i "s/\r//g" .env && \
		sed -i "s|^DOMAIN=.*|DOMAIN=top-code.dev.br|" .env && \
		sed -i "s|^ACME_EMAIL=.*|ACME_EMAIL=\\\"frandevjobs@gmail.com\\\"|" .env && \
		sed -i "s|^VITE_APP_API_URL=.*|VITE_APP_API_URL=https://api.seudominio.com|" .env && \
		echo "Environment file contents:" && \
		cat .env'

	@echo "🔨 Building and starting services..."
	@ssh $(SSH_OPTS) $(SERVER_USER)@$(SERVER_HOST) '\
		cd $(PROJECT_PATH) && \
		echo "Building images..." && \
		DOCKER_BUILDKIT=1 \
		COMPOSE_DOCKER_CLI_BUILD=1 \
		docker compose -f docker-compose.prod.yml build --no-cache && \
		echo "Starting containers..." && \
		DOCKER_CLIENT_TIMEOUT=300 \
		COMPOSE_HTTP_TIMEOUT=300 \
		NODE_OPTIONS="--max-old-space-size=8192" \
		docker compose -f docker-compose.prod.yml up -d && \
		echo "Waiting for startup..." && \
		sleep 20 && \
		echo "Checking containers:" && \
		docker compose -f docker-compose.prod.yml ps && \
		echo "Recent logs:" && \
		docker compose -f docker-compose.prod.yml logs --tail=50 || \
		(echo "❌ Deployment failed" && exit 1)'

	@echo "✅ Deployment completed!"

deploy-check:
	@echo "Checking container status..."
	@for i in $$(seq 1 $(MAX_RETRIES)); do \
		if ssh $(SSH_OPTS) $(SERVER_USER)@$(SERVER_HOST) '\
			cd $(PROJECT_PATH) && \
			docker compose -f docker-compose.prod.yml ps && \
			echo "\nContainer logs:" && \
			docker compose -f docker-compose.prod.yml logs --tail=50'; then \
			exit 0; \
		else \
			echo "Attempt $$i failed. Waiting $(SLEEP_TIME) seconds..."; \
			sleep $(SLEEP_TIME); \
		fi; \
	done; \
	echo "Failed to check deployment after $(MAX_RETRIES) attempts"; \
	exit 1

build-prod:
	docker compose -f docker-compose.prod.yml build

down-prod:
	docker compose -f docker-compose.prod.yml down

logs:
	docker compose -f docker-compose.prod.yml logs -f

logs-traefik:
	docker compose -f docker-compose.prod.yml logs -f traefik

check-acme:
	ssh $(SSH_OPTS) $(SERVER_USER)@$(SERVER_HOST) 'cd $(PROJECT_PATH) && docker compose -f docker-compose.prod.yml exec traefik cat /etc/traefik/acme.json'

setup-server:
	@echo "Setting up server..."
	ssh $(SSH_OPTS) $(SERVER_USER)@$(SERVER_HOST) 'mkdir -p $(PROJECT_PATH) && \
		curl -fsSL https://get.docker.com | sh && \
		sudo usermod -aG docker $$USER && \
		sudo systemctl enable docker && \
		sudo systemctl start docker'
