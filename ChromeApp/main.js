
var connectionId;
var connect_status = false;
//--------------------------------

var onGetDevices = function(ports) {
  for (var i=0; i<ports.length; i++) {
    document.getElementById("ports").innerHTML += `<option value="${ports[i].path}">${ports[i].path}</option>`;
  }
}
chrome.serial.getDevices(onGetDevices);

document.addEventListener('DOMContentLoaded', function() {
    var connect = document.getElementById('connect');
    connect.addEventListener('click', function() {
        var path = document.getElementById("ports").value
        if(connect_status == false){
        chrome.serial.connect(path, {bitrate: 115200}, onConnect);
        console.log("Connect to " + path);
        connect_status = true;
        document.getElementById("connect").innerHTML = "Disconnect";
      }else{
        chrome.serial.disconnect(connectionId, onDisconnect);
        connect_status = false;
        document.getElementById("connect").innerHTML = "Connect";
      }
    });
});

var onConnect = function(connectionInfo) {
  connectionId = connectionInfo.connectionId;
  Send_toArduino();
}

var onDisconnect = function(result) {
  if (result) {
    console.log("Disconnected from the serial port");
  } else {
    console.log("Disconnect failed");
  }
}

var writeSerial=function(str) {
  chrome.serial.send(connectionId, convertStringToArrayBuffer(str), onSend);
}

var convertStringToArrayBuffer=function(str) {
  var buf=new ArrayBuffer(str.length);
  var bufView=new Uint8Array(buf);
  for (var i=0; i<str.length; i++) {
    bufView[i]=str.charCodeAt(i);
  }
  return buf;
}

var onSend = function(data){
  //console.log(data);
}

function Send_toArduino(){
  if(connect_status){
  var M1 = document.getElementById("motor1").value;
      M1 = M1.toString();
  document.getElementById("output_motor1").innerHTML = ` ${M1}&deg;`;

  var M2 = document.getElementById("motor2").value;
      M2 = M2.toString();
  document.getElementById("output_motor2").innerHTML = ` ${M2}&deg;`;

  writeSerial(`${M1}&${M2}!`);
  setTimeout(function(){Send_toArduino();}, 0.5);
  }
}



