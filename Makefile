SHELL=/bin/bash

.PHONY: build dist install start clean

build:
	@docker build -f Dockerfile -t andrewmackrodt/ts-node-vue-monorepo .

dist: install clean-dist
	@yarn build

install:
	@yarn install

start:
	@docker run --rm \
		-e PORT=8080 \
		-p 8080:8080 \
		andrewmackrodt/ts-node-vue-monorepo

clean-dist:
	@if [[ -d ./build/ ]]; then \
		yarn clean ; \
	fi

clean-docker:
	@docker rmi -f andrewmackrodt/ts-node-vue-monorepo

clean: clean-dist clean-docker
