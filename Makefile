deploy:
	yarn build
	mv ./build ./html
	zip -vr html.zip ./html
	scp ./html.zip root@213.189.201.22:/var/www/
	rm -r ./html
	rm -r ./html.zip
	echo "ACCEPT"

deploy:
	yarn build
	zip -vr build.zip ./build
	rm -r ./build
	echo "ACCEPT"