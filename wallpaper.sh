#!/bin/sh

PID=$(pgrep gnome-session)
export DBUS_SESSION_BUS_ADDRESS=$(grep -z DBUS_SESSION_BUS_ADDRESS /proc/$PID/environ|cut -d= -f2-)

#set your node env path
export PATH="/home/develop/node-v4.2.4-linux-x64/bin:$PATH"

cur_dir=$(cd $(dirname ${BASH_SOURCE:-$0});pwd)
cd $cur_dir && node app.js
