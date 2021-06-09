#! usr/bin/env bash
echo 'Build for prodaction...'
#ng build --prod
scp  -r ".\\dist\\tender\\*"  root@77.222.55.82:/var/www/kozhin.tech/html/
echo 'Restart nginx...'
ssh -i "C:\Users\egkozhin\.ssh\id_rsa"  root@77.222.55.82 <<EOF
systemctl restart nginx
EOF
echo 'Bye..'

