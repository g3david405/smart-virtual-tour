clean:
	rm -rf node_modules/

install:
	yarn install --frozen-lockfile

test:
	yarn ci-test