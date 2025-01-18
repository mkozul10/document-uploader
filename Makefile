DOCKER = docker
DOCKER_COMPOSE = docker compose

start:
	$(DOCKER_COMPOSE) up -d
.PHONY: start

stop:
	$(DOCKER_COMPOSE) down
.PHONY: stop

restart: stop start
.PHONY: restart

build:
	$(DOCKER_COMPOSE) build --no-cache
.PHONY: build

clean:
	$(DOCKER_COMPOSE) down --remove-orphans --rmi all -v
.PHONY: clean

logs:
	$(DOCKER_COMPOSE) logs -f
.PHONY: logs

bash:
	$(DOCKER_COMPOSE) exec app /bin/bash
.PHONY: bash

npm-install:
	$(DOCKER_COMPOSE) run --rm npm install
.PHONY: npm-install

npm-update:
	$(DOCKER_COMPOSE) run --rm npm update
.PHONY: npm-update

test:
	$(DOCKER_COMPOSE) run --rm npm run test
.PHONY: test

test-e2e:
	$(DOCKER_COMPOSE) run --rm npm run test:e2e
.PHONY: test-e2e

test-cov:
	$(DOCKER_COMPOSE) run --rm npm run test:cov
.PHONY: test-cov

migration-create:
	$(DOCKER_COMPOSE) run --rm npm run migration:create src/migrations/$(name)
.PHONY: migration-create

migration-run:
	$(DOCKER_COMPOSE) run --rm npm run migration:run
.PHONY: migration-run

migration-revert:
	$(DOCKER_COMPOSE) run --rm npm run migration:revert
.PHONY: migration-revert
