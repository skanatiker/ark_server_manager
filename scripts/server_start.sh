#! /bin/bash
# Check if gedit is running
if pgrep "ShooterGame" > /dev/null
then
    echo "Ark Server is already running ..."
else
  echo "starting ark server: $1"
  ulimit -n 100000
  ./ShooterGameServer TheIsland?listen?SessionName=$1?MaxPlayers=$4?ServerPassword=$2?ServerAdminPassword=$3 -server -log &
  echo ServerPID:$!
fi