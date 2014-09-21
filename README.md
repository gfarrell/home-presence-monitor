Presence Monitor
================

Checks who's home using WiFi MAC addresses of devices. Requires a locally running **redis** server.

## Usage:

  node main.js

Starts polling for present users, and also loads a web server to allow you to see who is at home.

## Adding users

To add users, at the moment you'll have to do it manually in redis:

  hmset user:_USERNAME_ id _USERNAME_ device _MAC_ADDRESS_
  sadd users _USERNAME_

Once you've done that you're ready to rock and roll.
