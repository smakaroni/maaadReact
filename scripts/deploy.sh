#! /bin/bash

# default ENV is dev
env=dev

while test $# -gt 0; do
  case "$1" in
    -env)
      shift
      if test $# -gt 0; then
        env=$1
      fi
      # shift
      ;;
    *)
    break
    ;;
done

cd ../../maaadReact
source .env
go build -o cmd/recipes/recipes cmd/main.go
cmd/rgb/rgb -env $env &