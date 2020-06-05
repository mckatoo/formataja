#!/bin/bash

if [[ -z "$1" ]]; then
  echo "Argument is necessary: status | start | stop | restart"
else
  case $1 in
    status )
      docker ps
      ;;
    start )
      /usr/local/bin/docker-compose -f stack.yml up -d
      ;;
    stop )
      /usr/local/bin/docker-compose -f stack.yml down
      ;;
    restart )
      /usr/local/bin/docker-compose -f stack.yml down
      /usr/local/bin/docker-compose -f stack.yml up -d
      ;;
  esac
fi

