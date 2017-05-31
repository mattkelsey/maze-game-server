var pitch;
var roll;
var sensitivity = 2;
var rollTune = 0;
var pitchTune = 0;

var sensitivityInput = document.getElementById("sensitivity");
sensitivityInput.addEventListener("change", function(){ sensitivity = sensitivityInput.value } );

var rollTuneInput = document.getElementById("rollTune");
rollTuneInput.addEventListener("change", function(){ rollTune = rollTuneInput.value } );

var pitchTuneInput = document.getElementById("pitchTune");
pitchTuneInput.addEventListener("change", function(){ pitchTune = pitchTuneInput.value } );

if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', deviceOrientationHandler, false);
  var socket = io.connect('http://192.168.1.5:1326');
} else {
  document.getElementById("rot").innerHTML = "Device rotation not supported... Are you using Chrome Browser?"
}
function deviceOrientationHandler(event) {
  pitch = (constrain((event.beta + 90)/180) / sensitivity) + pitchTune;
  roll = (constrain((event.gamma + 90)/180) / sensitivity) + rollTune;
  document.getElementById("rot").innerHTML = "rotation pitch: " + event.beta + "  roll: " + event.beta;
  socket.emit('rotation', { pitch: pitch, roll: roll })
}

function constrain(input) {
  var output = input;
  //var output = ((input > 1) ? 1 : input);
  //output = ((input < 0) ? 0 : input);
  return output;
}
