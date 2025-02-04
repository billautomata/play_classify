#!/bin/bash

MONGO_DATABASE="shake"
APP_NAME="play_project"

MONGO_HOST="127.0.0.1"
MONGO_PORT="27017"
TIMESTAMP=`date -u +%F-%H%M-UTC`
MONGODUMP_PATH="mongodump"
BACKUPS_DIR="/Users/bill/play_classifier/backups/$APP_NAME"
BACKUP_NAME="$APP_NAME-$TIMESTAMP"

# mongo admin --eval "printjson(db.fsyncLock())"
$MONGODUMP_PATH -h $MONGO_HOST:$MONGO_PORT -d $MONGO_DATABASE
# $MONGODUMP_PATH -d $MONGO_DATABASE
# mongo admin --eval "printjson(db.fsyncUnlock())"

mkdir -p $BACKUPS_DIR
mv dump $BACKUP_NAME
tar -zcvf $BACKUPS_DIR/$BACKUP_NAME.tgz $BACKUP_NAME
rm -rf $BACKUP_NAME
