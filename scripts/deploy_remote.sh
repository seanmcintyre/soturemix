#! /bin/sh

ssh root@$1 bash -c "'
cd /var/www/soturemix
git pull origin master
scripts/deploy.sh
'"