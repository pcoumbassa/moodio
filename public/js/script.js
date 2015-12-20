

$(document).ready(function () {

	var socket = io.connect();
	var audio = new Audio();

	$('#play').on('click', function() {
		socket.emit('play');
	});

	$('#stop').on('click', function() {
		socket.emit('stop');
	});

	socket.on('title_song', function(data){
		$('#song').text = data._name;
	})

	socket.on('listening', function(data){

	})

	/*socket.on('like-icon', function(data){
		console.log(data.balise.getElementsByTagName('i')[0]);
	})*/

	$(".tracklist").on('click', function(){
		var audio_title = this.getElementsByTagName('div')[3].innerText;
		var audio_username = this.getElementsByTagName('div')[4].innerText;
		var username = document.getElementById('username').innerText;
		//this.getElementsByTagName('div')[7].innerText = );
		socket.emit('title', {title: audio_title, audio_username: audio_username, username: username});
	})

	$(".like").on('click', function(){
		var audio_title = $(this).parent().get(0).getElementsByTagName('div')[0].innerText;
		var audio_username = $(this).parent().get(0).getElementsByTagName('div')[1].innerText;
		var username = document.getElementById('username').innerText;
		var tmp = this.getElementsByTagName('i')[0];
		socket.emit('like', {title: audio_title, audio_username: audio_username, username: username});
		
		if (tmp.innerText == 'favorite') {
			tmp.innerText = 'favorite_border';
		} else{
			tmp.innerText = 'favorite';
		}
	})

	$(".pin").on('click', function(){
		var audio_title = $(this).parent().get(0).getElementsByTagName('div')[0].innerText;
		var audio_username = $(this).parent().get(0).getElementsByTagName('div')[1].innerText;
		var username = document.getElementById('username').innerText;
		var tmp = this.getElementsByTagName('i')[0];
		socket.emit('pin', {title: audio_title, audio_username: audio_username, username: username});
		
		if (tmp.innerText == 'remove') {
			tmp.innerText = 'add';
		} else{
			tmp.innerText = 'remove';
		}
	})

	$("li").hover(function(){
		$(this).toggleClass('activ');
		$(this.getElementsByClassName("info")).toggle();
	})

    // Load the first 3 list items from another HTML file
    //$('#myList').load('externalList.html li:lt(3)');
    $('#tracklist li:lt(10)').show();
    var items =  25;
    var shown =  3;
    $('#loadMore').click(function () {
        shown = $('#tracklist li:visible').size()+5;
        if(shown< items) {$('#tracklist li:lt('+shown+')').show();}
        else {$('#tracklist li:lt('+items+')').show();
             $('#loadMore').hide();
             }
    });

    $(".info").hide();



});