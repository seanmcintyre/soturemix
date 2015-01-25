#! /bin/sh

ssh root@$1 '
cd /var/www/soturemix
git pull origin master
scripts/deploy.sh
'