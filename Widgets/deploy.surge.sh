#!/bin/bash

cp build/spu* Containers/MainContainer/
surge Containers/MainContainer -d https://containerspu.surge.sh

surge Containers/MainContainer -d https://badcontainerspu.surge.sh

cp build/spu* Widgets/Signup/
surge Widgets/Signup -d https://signupspu.surge.sh

cp build/spu* Widgets/Login/
surge Widgets/Login -d https://loginspu.surge.sh

cp build/spu* Widgets/Read/
surge Widgets/Read -d https://readspu.surge.sh

cp build/spu* Widgets/Write/
surge Widgets/Write -d https://writespu.surge.sh
