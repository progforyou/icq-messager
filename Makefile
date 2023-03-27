deploy:
	zip -vr build.zip ./ -x "node_modules/*" "*.DS_Store" ".idea/*" ".git/*" "build/*"
	scp ./build.zip root@213.189.201.22:/opt/chat/

dep:
	ssh root@213.189.201.22 && cd /frontend/build/ && unzip ./build.zip && rm -r ./build.zip