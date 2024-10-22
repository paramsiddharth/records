#!/usr/bin/env bash

rm -rf dist/
mkdir dist/
(
	cp *.html dist/
	cp *.png dist/
	cp *.ico dist/
	cp .nojekyll dist/
	cp *.webmanifest dist/
	cp *.js dist/
	cp *.css dist/
	cp -r node_modules/ dist/modules/
) 2>/dev/null
gh-pages -d dist