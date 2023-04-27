deploy:
	yarn build
	mv ./build ./html
	zip -vr html.zip ./html
	scp ./html.zip root@213.189.201.22:/var/www/
	rm -r ./html
	rm -r ./html.zip
	echo "ACCEPT"