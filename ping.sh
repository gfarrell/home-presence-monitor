#! /bin/bash
# Ping with count 1 (only need the ping to create some sort of session)
ping -c 1 "$1" >> /dev/null

echo "---DATA START---";
arp -a
echo "---DATA END---";
