deploy:
	rm -r ./html
	mv ./build ./html
	zip -vr html.zip ./html

qwe:
	scp ./html.zip root@213.189.201.22:/var/www/
	rm -r ./html.zip