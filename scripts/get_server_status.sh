#! /bin/bash
pid=""
if [[ $# -eq 0 ]] ;
  then
    pid="$(pgrep "ShooterGame")"
  else
    pid="$1"
fi
if [[ $pid -ne "" ]] ;
  then
    echo "PID: $pid"
    echo "MEM: $(eval "ps -p $pid -o rss=")";
fi
