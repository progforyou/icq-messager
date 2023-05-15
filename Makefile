deploy:
	yarn build
	mv ./build ./html
	zip -vr html.zip ./html
	scp ./html.zip root@134.0.112.198:/var/www/
	rm -r ./html
	rm -r ./html.zip
	echo "ACCEPT"

deplo2y:
	yarn build
	zip -vr build.zip ./build
	rm -r ./build
	echo "ACCEPT"