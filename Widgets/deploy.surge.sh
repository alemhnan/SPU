#!/bin/bash

cp build/spu* Containers/MainContainer/
surge Containers/MainContainer

# cp build/spu* Containers/BadContainer/spu.js
# surge Containers/BadContainer

cp build/spu* Containers/PopContainer/
surge Containers/PopContainer

cp build/spu* Widgets/Signup/
surge Widgets/Signup

cp build/spu* Widgets/Login/
surge Widgets/Login

cp build/spu* Widgets/Read/
surge Widgets/Read

cp build/spu* Widgets/Write/
surge Widgets/Write