#!/bin/bash

cp Common/scripts.js Containers/MainContainer/common.scripts.js
surge Containers/MainContainer

#cp Common/scripts.js Containers/BadContainer/common.scripts.js
# surge Containers/BadContainer

#cp Common/scripts.js Containers/BadContainer/common.scripts.js
# surge Containers/PopContainer

cp Common/scripts.js Widgets/Signup/common.scripts.js
surge Widgets/Signup

cp Common/scripts.js Widgets/Login/common.scripts.js
surge Widgets/Login

cp Common/scripts.js Widgets/Read/common.scripts.js
surge Widgets/Read

cp Common/scripts.js Widgets/Write/common.scripts.js
surge Widgets/Write