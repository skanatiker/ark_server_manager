#! /bin/bash
now=$(date +%Y-%m-%d-%H-%M-%S)
if [ ! -z $2 ] ;
  then
  	echo "Starting Backup for Date $now"
    zip -r $2/${now}.zip $1/ShooterGame/Saved/
fi
echo "Starting update of ark server"
./steamcmd.sh +login anonymous +force_install_dir $1 +app_update "376030 validate" +quit