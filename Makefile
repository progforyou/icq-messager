deploy:
	zip -vr build.zip ./ -x "node_modules/*" "*.DS_Store" ".idea/*" "build/*"
	scp ./build.zip root@151.248.122.13:/opt/frontend/
	rm -r ./build.zip