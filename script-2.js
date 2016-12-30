const app = {};

app.init = function() {
	$('form').on('submit', function(e) {
		e.preventDefault();
		let artists = $('input[type=search]').val();
		//let validInput=false;
		//while (validInput=false) {
			
			//app.validation(artists);
			//app.init;
		//}

		artists = artists.split(',');
		$('.loader').addClass('show');
		let search = artists.map(artistName => app.getArtists(artistName));
		console.log(search);
		app.getArtistsInfo(search);

	});

};

app.getArtistsInfo = function(search){
			$.when(...search)
			.then((...results) => {
				results = results.map(getFirstElem)
				.map((res) => res.artists.items[0].id)
				.map(id => app.getArtistsTopTracks(id));
				console.log(results);

				app.getArtistsTracks(results);
			});
};

//app.getTracks = function(ArtistsAlbums){
		//$.when(...ArtistsAlbums)
			//.then((...tracksRes) =>{
				//songIds = tracksRes
				//.map(res => res.items.id)
				//.reduce((prev,curr) => [...prev,...curr],[]);
				//console.log(songIds);
			//app.buildPlayList(albumsIds);
			//}); 
//};

app.getArtistsTracks = function(results){
		$.when(...results)
			.then((...tracksRes) =>{
				tracksRes= tracksRes.map(getFirstElem)
				.map(res => res.tracks)
				//tracksRes = tracksRes.map(id => app.getArtistsTopTracks(id))
				//.map(sog => sog.tracks.id)
				//.map(tracks => tracks.id)
				.reduce((prev,curr) => [...prev,...curr],[])
				.map(track => track.id)
				console.log(tracksRes);
			app.buildPlayList(tracksRes);
			}); 
};

app.buildPlayList = function(tracks) {
	$.when(...tracks)
		.then((...tracksResults) => {
			//tracksResults = tracksResults.map(getFirstElem)
				//.map(item => item.items)
				//.reduce((prev,curr) => [...prev,...curr],[])
				//.map(item => item.id);
			let j = tracksResults.length
			console.log(j);
			app.shuffle(tracksResults);
			//let tracksArr =[];
			//for( let i =0; i< j; i++) {
				//tracksArr.push(tracksResults);
			//}
			const baseUrl = `https://embed.spotify.com/?theme=white&uri=spotify:trackset:My Playlist:${tracksResults.join()}`;
			console.log(baseUrl);

			$('.playlist').html(`<iframe src="${baseUrl}" height="400"></iframe>`);
		});
};

app.getAlbumTracks = (id) => $.ajax({
	url: `https://api.spotify.com/v1/albums/${id}/tracks`,
	method: 'GET',
	dataType: 'json'
});

app.getArtists = (artist) => $.ajax({
	url: `https://api.spotify.com/v1/search`,
	method: 'GET',
	dataType: 'json',
	data: {
		type: 'artist',
		q: artist
	}
});

app.getArtistsAlbums = (id) => $.ajax({
	url: `https://api.spotify.com/v1/artists/${id}/albums`,
	method: 'GET',
	dataType: 'json',
	data: {
		album_type: 'album',
	}
});

app.getArtistsTopTracks = (id) => $.ajax({
	url: `https://api.spotify.com/v1/artists/${id}/top-tracks`,
	method: 'GET',
	dataType: 'json',
	data: {
		country: 'US',
	}
});

const getFirstElem = (item) => item[0];

const getRandomTrack= (trackArray) => {
    const randomNumber =Math.floor(Math.random() * trackArray.length);
    return trackArray[randomNumber]

};

app.validation = function (userInput) {
	let message='';
    message = document.getElementById("message");
    message.innerHTML = "";
        if(userInput == "") {
        	err=  "empty";
        	 message.innerHTML = "Input is " + err
        	 return false
    }
       else if(userInput.length > 3) {
       	err ="Maximum of 4 artists";
       	message.innerHTML = "Input is " + err;
       	return false
   }
        else if(userInput.length < 2){
        err = "Minimum of 2 artists";
        message.innerHTML = "Input is " + err;
        return false

    } 
   	else{
   		return true
   	}

};

app.shuffle =function (a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

$(app.init);