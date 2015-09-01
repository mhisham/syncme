var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
    return query_string;
}();

var roomNum = QueryString.r?QueryString.r:null;
function isMobile() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}
// $(document).ready(function()
	// {
function orientHandler(eventData) 
{
    // gamma is the left-to-right tilt in degrees, where right is positive
    var tiltLR = eventData.gamma;

    // beta is the front-to-back tilt in degrees, where front is positive
    var tiltFB = eventData.beta;

    // alpha is the compass direction the device is facing in degrees
    var dir = eventData.alpha

    // call our orientation event handler
    // console.log(tiltLR, tiltFB, dir);
	// console.log(eventData);
	
	// work(tiltLR, tiltFB, dir);
  var data = {'tiltLR':tiltLR, 'tiltFB':tiltFB, 'dir':dir};
  
    sendData(data);
  }
  
  function work(tiltLR,tiltFB,dir)
  {
    document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
document.getElementById("doDirection").innerHTML = Math.round(dir);

// Apply the transform to the image
var logo = document.getElementById("imgLogo");
logo.style.webkitTransform =
  "rotate("+ tiltLR +"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
logo.style.MozTransform = "rotate("+ tiltLR +"deg)";
logo.style.transform =
  "rotate("+ tiltLR +"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
    work2(tiltLR,tiltFB,dir);
  }

  function work2(leftRight,frontBack,dir)
  {
    var baseW  = $( window ).width()/2 - (101/2);
    var baseH  = $( window ).height()/2 - (101/2);
      var x = baseW + ((frontBack * 180)/5);
      var y = baseH + ((leftRight * 180)/5);
      if(x + 101 >= $( window ).width()){
        x = $( window ).width() - 101;
      }

      if(y + 101 >= $( window ).height())
      {
        y = $( window ).height() - 101;
      }

      if(x < 0)
      {
        x = 0;
      }

      if(y < 0)
      {
        y = 0;
      }
      $('#circle').css({left:x,top:y});
  }
  
  if(isMobile()){
		if (window.DeviceOrientationEvent) 
		{
			console.log("DeviceOrientation is supported");
			window.addEventListener('deviceorientation', orientHandler, false);
		}
  }else
  {
    document.getElementById('device').style.display = 'none';
  }
    //Socket
    var deviceType = 'desktop';
    
    if(isMobile())
    {
      deviceType = 'mobile';
    }
    
    // var socket = io('http://'+window.location.hostname+':88');
    var socket = io('http://think.mhisham.net:88');
    if(roomNum == null)
    {
      socket.emit('join',{'type':deviceType});
    
      socket.on('joined',function(data)
      {
         roomNum = data.room; 
         console.log('room',roomNum);
         startSend();
         newroom(roomNum);
      });  
    }else{
      socket.emit('join',{'type':deviceType,'room':roomNum});
      socket.on('joined',function(data)
      {
         roomNum = data.room; 
         console.log('room',roomNum);
         startSend();
         newroom('');
      });
    }
    
    function startSend()
    {
        socket.emit('changes',{msg:'hi'});
    }
    
    function sendData(data)
    {
      socket.emit('changes',data);
    }
    var appear = true;
    socket.on('changes',function(data)
      {
        if(appear){
          hideQr();
          appear = false;
        }
        // console.log('got changes',data);
        // console.log('got changes',data);
        work(data.tiltLR, data.tiltFB, data.dir);
      });
    
	// });
  function hideQr(){
    document.getElementById('qr_code').style.display = 'none';
    document.getElementById('device').style.display = 'block';
    $('#circle').show();
  }
  function newroom(room)
  {
    if(room){
      room = '?r='+room;
    }
    var qr_div = document.getElementById('qr_code_img');
      var qrcode = new QRCode(qr_div, {
    text: url+room,
    width: 128,
    height: 128,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});
  }
  