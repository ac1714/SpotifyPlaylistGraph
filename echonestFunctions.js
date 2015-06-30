function getTopArtists(genre, callback) {
	$.get('http://developer.echonest.com/api/v4/genre/artists?api_key=GWIOA4YOWVCUJH2VZ&format=json&results=5&name=' + genre, function(r) {
		callback(r);
	});
}

function getDescription(genre, callback) {
	$.get('http://developer.echonest.com/api/v4/genre/profile?api_key=GWIOA4YOWVCUJH2VZ&name=' + genre + '&bucket=description', function(r) {
		callback(r);
	})
}