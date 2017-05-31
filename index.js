const driverFactory = require('adafruit-i2c-pwm-driver');
const pwmDriver = driverFactory({address: 0x40, device: '/dev/i2c-1'})
var path = require("path");

// serve page
const express = require('express');
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname + '/pub'));

pwmDriver.setPWMFreq(50);

//servos range from 150 to 600

var rollTune = 0.2;
var pitchTune = -0.2;
var sensitivity = 1;

app.get('/maze', function(req, res) {
    res.sendFile(path.join(__dirname + '/pub/index.html'));
});

io.on('connection', function(client){
    console.log("client connected");
    client.on('rotation', function(data) {
	//update so that 0 radians is actuall pi/2 radians so that we don't get negative values
	//then, divide by pi to get 0 to pi radians be scaled to values of 0 to 1 for input to the servo

	console.log("incoming roll: " + data.roll + "   pitch: " + data.pitch);	

	var pitch = 1-data.pitch-.25;	
	var roll = data.roll+.25;

	var pitchinput = (450*pitch) + 150;
	var rollinput = (450*roll) + 150;
	if (!process.env.NO_SERVO) {	
	    pwmDriver.setPWM(0, 0, rollinput);
	    pwmDriver.setPWM(1, 0, pitchinput);
	}
    })
});
io.listen(1326);

http.listen(2613, () => console.log('listening on port ' + 2613));
