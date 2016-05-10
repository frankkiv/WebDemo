var socket = io.connect();

// face detection properties
var rectColor = [0, 255, 0];
var rectThickness = 2;


socket.on('date', function(data) {
	$('#date').text(data.date);
});

window.addEventListener("DOMContentLoaded", function() {
	// Grab elements, create settings, etc.
	var	video = document.getElementById("video"),
		videoObj = { "video": true },
		errBack = function(error) {
			console.log("Video capture error: ", error.code); 
		};

	// Put video listeners into place
	if(navigator.getUserMedia) { // Standard
		navigator.getUserMedia(videoObj, function(stream) {
			video.src = stream;
			video.play();
		}, errBack);
	} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
		navigator.webkitGetUserMedia(videoObj, function(stream){
			video.src = window.URL.createObjectURL(stream);
			video.play();
		}, errBack);
	}
	else if(navigator.mozGetUserMedia) { // Firefox-prefixed
		navigator.mozGetUserMedia(videoObj, function(stream){
			video.src = window.URL.createObjectURL(stream);
			video.play();
		}, errBack);
	}
	$("body").on("change", "#file", function (){
  	    	preview(this);
		}); 
}, false);

function format_float(num, pos){
	var size = Math.pow(10, pos);
	return Math.round(num * size) / size;
};

function preview(input) {
	if (input.files && input.files[0]){
		var reader = new FileReader();
		reader.onload = function (e) {
			var $element = $('#canvas');
			if(!$element.length)
			    $element = $('<canvas id="canvas"></canvas>').appendTo('#canvas_div');
			var canvas = document.getElementById('canvas');
			var ctx = canvas.getContext("2d");
			var image = new Image();
			image.src = e.target.result;
			
			var MAX_WIDTH = 640;
			var MAX_HEIGHT = 480;
			var width = image.width;
			var height = image.height;


			if (width > height) {
  				if (width > MAX_WIDTH) {
      				height *= MAX_WIDTH / width;
	      			width = MAX_WIDTH;
		    	}
			} else {
			  	if (height > MAX_HEIGHT) {
			     	 width *= MAX_HEIGHT / height;
				     height = MAX_HEIGHT;
				}
			}

			canvas.width = width;
			canvas.height = height;
			ctx.drawImage(image, 0, 0, width, height);
			var KB = format_float(e.total / 1024, 2);
			$('<li>', { text: "file size:" + KB + " KB"}).appendTo('#size_file');

			var dataurl = canvas.toDataURL("image/png");

			socket.emit('client_image', dataurl, function(faces){
					outputface(faces)
				});
		}																									 
		reader.readAsDataURL(input.files[0]);
	}
};

function snapClick(){
	var $element = $('#canvas');
	if(!$element.length)
		$element = $('<canvas id="canvas"></canvas>').appendTo('#canvas_div');
	var canvas = document.getElementById('canvas');
	var dataUrl;
	var ctx = canvas.getContext("2d");
	canvas.width = 640;
	canvas.height = 480;
	ctx.drawImage(video, 0, 0, 640, 480);
	dataUrl = canvas.toDataURL("base64Img");
	socket.emit('client_image', dataUrl, function(faces){
		outputface(faces)
	});
};

function outputface(faces){
    var ctx = canvas.getContext("2d");
	$('#result_face').find("li").remove();
	if(faces.length == 0){
		$('<li>', { text: "You got no faces.", id: 'face0'}).appendTo('#result_face');
	}
	for (var i = 0; i < faces.length; i++) {
		face = faces[i];
		ctx.strokeStyle = 'blue';
	    ctx.lineWidth = 5;
		ctx.strokeRect(face.x, face.y, face.width, face.height);
		ctx.font = '40pt Calibri';
		ctx.fillStyle = 'blue';
		ctx.fillText("Your age:"+randomIntFromInterval(20,30), face.x, face.y);        
		
		var faceinfo = "face:"+i+", face.x:"+face.x+", face.y:"+face.y+", face.width:"+face.width+", face.height:"+face.height;
		$('<li>', { text: faceinfo, id: 'face' + i }).appendTo('#result_face');
		}               
};

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
};

/*function toDataUrl(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0, 640, 480);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null; 
    };
    img.src = url;
}*/
