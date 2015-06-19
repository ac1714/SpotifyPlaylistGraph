function createJSON(playlist) {
    //console.log(playlist.tracks.items[0].track.name); // Prints mother
    //console.log(playlist.tracks.items);
    var data = { 'nodes': [], 'links': [] };
    genre_set = [];
    track_obj_set = [];
    artist_full_obj_set = [];
    index = 1;

    data.nodes.push({'name': 'unclassified', 'index': 0, 'group': 5});

    _.each(playlist.tracks.items, function(track) {
        var track_obj = track.track;
        var song_node = {'name': track_obj.name, 'id': track_obj.id, 'index': index, 'group': 4};
        data.nodes.push(song_node);
        var song_index = index;
        index = index + 1;

        artist_simple_obj = track_obj.artists[0];
        //console.log(artist_simple_obj.href);
        artist_full_obj = getFullArtist(artist_simple_obj.href);

        if (artist_full_obj.genres.length > 0) {
            _.each(artist_full_obj.genres, function(genre) {
                if (_.contains(genre_set, genre) == false) {
                    genre_set.push(genre);
                    genre_node = {'name': genre, 'index': index, 'group': 5};
                    data.nodes.push(genre_node);
                    var trg = song_index;
                    var link = {'source': index, 'target': trg};
                    data.links.push(link);
                    index = index + 1;
                }
                else {
                    var ind = -1;
                    _.each(data.nodes, function(data, idx){
                        if (_.isEqual(data.name, genre)) {
                            ind = idx;
                            return;
                        }
                    });
                    var trg = song_index;
                    var link = {'source': ind, 'target': trg};
                    data.links.push(link);
                }
            });
        }
        else {
            genre_set.push('unclassified');
            link = {'source': 0, 'target': song_index};
            data.links.push(link);
        }
    });
    return data;
}

function getFullArtist(href) {
    jQuery.ajaxSetup({async:false});
    var artist = null;
    $.get(href, function(r){
        artist = r;
    });
    jQuery.ajaxSetup({async:true});
    return artist;
}

function getTrack(id) {
    jQuery.ajaxSetup({async:false});
    var track = null;
    $.get('https://api.spotify.com/v1/tracks/' + id, function(r){
        track = r;
    });
    jQuery.ajaxSetup({async:true});
    return track;
}

function getPlaylist(id, token, uid) {
    var playlist = null;
    //console.log(token);
    $.ajax({
        async: false,
        dataType: 'json',
        url: 'https://api.spotify.com/v1/users/' + uid + '/playlists/' + id,
        headers: {'Authorization': 'Bearer ' + token},
        success: function(r) {
            //alert('Playlist name: ' + r.name);
            playlist = r;
        },
        error: function(r) {
            alert(r.status);
        }
    });
    return playlist;
}

function authorizeUser() {
    var client_id = '051d0745d3b349e2a3566df3e9cbbb36';
    var redirect_uri = 'http://ec2-52-64-37-241.ap-southeast-2.compute.amazonaws.com/SpotifyPlaylistGraph/index.html';
    var scopes = 'playlist-read-private';
    
    var url = 'https://accounts.spotify.com/authorize?client_id=051d0745d3b349e2a3566df3e9cbbb36&response_type=token&scope=playlist-read-private';
    window.location = url += '&redirect_uri=http://ec2-52-64-37-241.ap-southeast-2.compute.amazonaws.com/SpotifyPlaylistGraph/index.html';
}

function getCurrentUser(token) {
    var user = null;
    $.ajax({
        async: false,
        url: 'https://api.spotify.com/v1/me',
        headers: {'Authorization': 'Bearer ' + token},
        success: function(r) {
            user = r;
        },
        error: function(r) {
            alert(r.status);
        }
    });
    return user;
}