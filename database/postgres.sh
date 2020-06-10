#!/bin/bash

DIR_RELATIVO="${0%/*}"
DIR_CHAMADA="${PWD}"
SCRIPT_PATH=$DIR_CHAMADA/$DIR_RELATIVO

if [[ -z "$1" ]]; then
  echo "Argument is necessary: status | start | stop | restart"
else
  case $1 in
    status )
      docker ps
      ;;
    start )
      /usr/local/bin/docker-compose -f "$SCRIPT_PATH/stack.yml" up -d
      ;;
    stop )
      /usr/local/bin/docker-compose -f "$SCRIPT_PATH/stack.yml" down
      ;;
    restart )
      /usr/local/bin/docker-compose -f "$SCRIPT_PATH/stack.yml" down
      /usr/local/bin/docker-compose -f "$SCRIPT_PATH/stack.yml" up -d
      ;;
  esac
fi

