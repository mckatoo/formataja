#!/bin/bash

DIR_RELATIVO="${0%/*}"
DIR_CHAMADA="${PWD}"
SCRIPT_PATH=$DIR_CHAMADA/$DIR_RELATIVO

function start {
  /usr/local/bin/docker-compose -f "$SCRIPT_PATH/stack.yml" up -d
  echo "---- CRIANDO TABELAS ----"
  sleep 5
  docker exec -t -i database_db_1 psql -U postgres -x 123123 -d formataja -a -f database.sql
}

function stop {
  /usr/local/bin/docker-compose -f "$SCRIPT_PATH/stack.yml" down
}

if [[ -z "$1" ]]; then
  echo "Argument is necessary: status | start | stop | restart"
else
  case $1 in
    status )
      docker ps
      ;;
    start )
      start
      ;;
    stop )
      stop
      ;;
    restart )
      stop
      start
      ;;
  esac
fi

