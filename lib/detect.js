var cv = require('opencv');

module.exports = { 
    facedetect: function(base64, callback) {
	var buffer = new Buffer(base64.split(",")[1], 'base64');
	cv.readImage(buffer, function(err, im){
        if(err){
		console.log(err);
		callback(err);
        }else{
            im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
		if(err){
			console.log("ERR");
		}else{
			console.log(faces);
			callback(faces);
		}
            })
        }})
    },
    test: function(){return "Hello world"}
};
