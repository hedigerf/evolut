#!/bin/bash
#
# Build latex document
#

pdflatex --shell-escape --write-18 .\main.tex
bibtex main
pdflatex --shell-escape --write-18 .\main.tex
