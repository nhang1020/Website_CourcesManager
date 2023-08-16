function firstImage(moTa) {
	var regExp = /<img[^>]+src="?([^"\s]+)"?[^>]*\/>/g;
	var results = regExp.exec(moTa);
	var image = 'http://localhost:3000/images/1.gif';
	if(results) image = results[1];
	return image;
}

module.exports = firstImage;