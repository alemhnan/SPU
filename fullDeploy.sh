#!/bin/bash

# Deploy LoginSignup server
# git push heroku `git subtree split --prefix Servers/LoginSignup master`:master --force

# Deploy ReadWrite server
# git push heroku `git subtree split --prefix Servers/ReadWrite master`:master --force

cd Widgets
./deploy.surge.sh


