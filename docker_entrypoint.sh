#!/bin/sh

_term() {
    kill -TERM "$relay_process" 2>/dev/null
}

chown -R $APP_USER:$APP_USER /data

/app/wisp &
relay_process=$!

trap _term TERM
wait $relay_process
