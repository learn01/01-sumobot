var five = require('johnny-five');
var Tessel = require('tessel-io');
var fs = require('fs');
var board = new five.Board({
  io: new Tessel()
});



var http = require('http');
var os = require('os');
// Config
// var hostname = grabInterfaces().pop()
var hostname = "192.168.1.101";
var port = 1337;
var url = `http://${hostname}:${port}/`;

// Helper Functions
// Grabs all the interfaces
// Imperative
// function grabInterfaces() {
//     var result = [];
//     var ifaces = os.networkInterfaces();
//     Object.keys(ifaces).map(function (key) { return ifaces[key]; })
//         .forEach(function (x) { return x.forEach(function (y) { return result.push(y); }); });
//     var tmp = result.filter(function (x) { return x.family === 'IPv4' && x.internal === false; })
//         .map(function (dev) { return dev.address; });
//     return tmp;
// }


// Page
var page = `<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Test App</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <!--[if lt IE 7]>
      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="#">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->
    
    <div id="app">
      <button id="up"    style="background-color:red; height:150px; width:150px;">UP</button>
      <button id="down"  style="background-color:blue; height:150px; width:150px;">DOWN</button>
      <button id="left"  style="background-color:green; height:150px; width:150px;">LEFT</button>
      <button id="right" style="background-color:yellow; height:150px; width:150px;">RIGHT</button>
    </div>
     
     <script type="text/javascript">
        var upButton = document.getElementById('up');
        var downButton = document.getElementById('down');
        var leftButton = document.getElementById('left');
        var rightButton = document.getElementById('right');
        
        var up = { "element": upButton, "func": goUp };
        var down = { "element": downButton, "func": goDown };
        var left = { "element": leftButton, "func": goLeft };
        var right = { "element": rightButton, "func": goRight };

        function goUp() {
            console.log('up request');
            var oReq = new XMLHttpRequest();
            oReq.open("POST", "${url}up");
            oReq.send();
        }

        function goDown() {
            var oReq = new XMLHttpRequest();
            oReq.open("POST", "${url}down");
            oReq.send();
        }

        function goLeft() {
            var oReq = new XMLHttpRequest();
            oReq.open("POST", "${url}left");
            oReq.send();
        }

        function goRight() {
            var oReq = new XMLHttpRequest();
            oReq.open("POST", "${url}right");
            oReq.send();
        }

       

        var commands = [up, down, left, right];

        commands.forEach(function(command) {
            if ('ontouchstart' in document.documentElement) {
                var interval;

                command['element'].addEventListener('touchstart', function() { 
                    interval = setInterval(command.func, 450);
                });

                command['element'].addEventListener('touchend', function() {
                    clearInterval(interval);
                });
            } else {
                var interval;

                command['element'].addEventListener('mousedown', function() { 
                    interval = setInterval(command.func, 450);
                });

                command['element'].addEventListener('mouseup', function() {
                    clearInterval(interval);
                });
            }
        });

        
        

        

        
    </script>
    
  </body>
</html>`;










/////////////////////////////////////////////////////////////////
board.on("ready", function() {
  var motorA = new five.Motor(["a5", "a4", "a3"]);
  var motorB = new five.Motor(["b5", "b4", "b3"]);

  var length = 400;
  var speed = 255;

  function up(mA, mB) {
    mA.forward(speed);
    mB.forward(speed);
    board.wait(length, function() {
      mA.stop();
      mB.stop();
    })
  };
  function down(mA, mB) {
    mA.reverse(speed);
    mB.reverse(speed);
    board.wait(length, function() {
      mA.stop();
      mB.stop();
    })
  };
  function left(mA, mB) {
    mA.reverse(speed);
    mB.forward(speed);
    board.wait(length, function() {
      mA.stop();
      mB.stop();
    })
  };
  function right(mA, mB) {
    mA.forward(speed);
    mB.reverse(speed);
    board.wait(length, function() {
      mA.stop();
      mB.stop();
    })
  };
  
//  function page(response) {
//     response.writeHead(200, {"Content-Type":"text/html"});
//     fs.readFile(__dirname + '/index.html', function(err, content) {
//       if (err) {
//         throw err;
//       }
//       response.end(content);
//     })
//   }
http.createServer(function (req, res) {
    if (req.method === "GET") {
        res.writeHead(200, {"Content-Type":"text/html"});
        res.end(page);
    }
    if (req.method === "POST") {
        if (req.url === "/up") {
            console.log('called up');
            var requestBody_1 = '';
            req.on('data', function (data) {
                return requestBody_1 += data;
            });
            req.on('end', function () {
                return up(motorA, motorB);
            });
            res.end();
        }
        else if (req.url === "/down") {
            var requestBody_2 = '';
            req.on('data', function (data) {
                return requestBody_2 += data;
            });
            req.on('end', function () {
                return down(motorA, motorB);
            });
            res.end();
        }
        else if (req.url === "/left") {
            var requestBody_3 = '';
            req.on('data', function (data) {
                return requestBody_3 += data;
            });
            req.on('end', function () {
                return left(motorA, motorB);
            });
            res.end();
        }
        else if (req.url === "/right") {
            var requestBody_4 = '';
            req.on('data', function (data) {
                return requestBody_4 += data;
            });
            req.on('end', function () {
                return right(motorA, motorB);
            });
            res.end();
        }
    }
}).listen(port, hostname, function () {
    console.log("Server is running at http://" + hostname + ":" + port + "/");
});
  // motorB.forward(50)
  // setTimeout(function() {
  //   console.log("waiting")
  // }, 2000)
  // motorA.forward(255)  
});



