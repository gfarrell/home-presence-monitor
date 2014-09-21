# Ping with count 1 (only need the ping to create some sort of session)
ping -c 1 192.168.1.255 >> /dev/null

rm ./arp.log
arp -a >> ./arp.log
