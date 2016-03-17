#!/bin/bash
#
# Start interactive spell checker
#

hunspell -t -d de_CH -i utf-8 ./content/**/*.tex
