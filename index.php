<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.css" integrity="sha256-ujE/ZUB6CMZmyJSgQjXGCF4sRRneOimQplBVLu8OU5w=" crossorigin="anonymous" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,700|Nanum+Gothic:400,700,800&display=swap" rel="stylesheet" />

    <link rel="stylesheet" href="css/main.css" />
    <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
    <title>Project IOT</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js" type="text/javascript"></script>
    <script src="js/main.js"></script>
    <script src="js/MQTT.js"></script>
</head>

<body>
    <div id="content">
        <nav class="navbar is-primary is-fixed-top" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <div class="navbar-item">
                    <h1 class="subtitle is-3" style="color: white">Daan Wijns</h1>
                </div>

                <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" onclick="document.querySelector('.navbar-menu').classList.toggle('is-active');">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
            <div id="navbarBasicExample" class="navbar-menu is-primary">
                <div class="navbar-end">
                    <a href="#home-section" class="navbar-item">
                        Home
                    </a>
                </div>
            </div>
        </nav>
          <div>
            <section id="home-section" class="section header">
                <div class="container">
                    <h1 class="title is-1">
                        RPI Fan Controller
                    </h1>
                </div>
            </section>
            <section>
            <img id="image" />
            <h1 class="title is-3">Result: <span id="result"></span></h1>
                <button onclick="recognise()" class="button is-primary" style="margin-top:60px;">RECOGNISE</button>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.js"></script>
            <script>
             const socket = io.connect("http://pi4:3000");
             socket.on("image", image => {
              const imageElm = document.getElementById("image");
                imageElm.src = `data:image/jpeg;base64,${image}`;
            });

            function recognise() {
             axios.get("http://pi4:3000/result", {}).then(res => {
               document.getElementById('result').innerHTML = res.data;
                  console.log(res);
             });
           }
          </script>
            </section>
            <!--<section>
                <div class="columns">
                    <div class="column is-two-thirds">
                        <input type="text" id="tbxMessage" class="form-control input" placeholder="message to send..." />
                    </div>
                    <div class="column">
                        <button id="btnSendMessage" class="button is-primary">
                            Send message
                        </button>
                    </div>
            </section>
            <section>
                <div class="mt-4 container">
                    <h3>Subscription</h3>
                    <div id="divSubscription"></div>
                </div>
            </section>-->
            <!--datatable-->
            <section>
                <table class="table is-fullwidth is-striped" style="margin-top:50px;">
                    <thead>
                        <tr>
                            <th>Tijd</th>
                            <th>Word</th>
                        </tr>
                    </thead>
                    <tbody id="tbody">
                    </tbody>
                </table>
            </section>
        </div>

    </div>
    <footer style="text-align: center">
        This page was made by Daan Wijns
    </footer>
</body>

</html>

<?php
require('vendor/autoload.php');

$mysqli = DatabaseHandler::getInstance();
$helper = Helper::getInstance();

$data = $mysqli->getLast(10, false);

$helper->executeJsFunction("drawTable", $data);
?>
