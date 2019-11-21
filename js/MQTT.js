$(document).ready(function () {
  //retrieve credentials
  $.ajax({
    type: "GET",
    url: "http://pi4:3000/creds",
    success: function (data) {
      Init(data);
    },
    error: function () {
      console.error("Couldn't retrieve data");
    }
  });
  //init client
  let client;
  function Init(data) {
    client = new Paho.MQTT.Client(
      data.MQTT_HOST,
      Number(data.MQTT_PORT),
      String(Math.floor(Math.random() * 1000))
    );

    // Event onMessageArrived, koppelen met functie onMessageArrived.
    client.onMessageArrived = onMessageArrived;

    // Verbinding maken met de broker.
    client.connect({
      onSuccess: onConnected,
      userName: data.MQTT_USER,
      password: data.MQTT_PASS,
      useSSL: true
    });

    // Klikken op de knop, koppelen met een actie...
    // document
    //   .getElementById("btnSendMessage")
    //   .addEventListener("click", function () {
    //     message = new Paho.MQTT.Message(
    //       document.getElementById("tbxMessage").value
    //     );
    //     message.destinationName = "daan"; // Moet gelijk zijn aan 'topic'.
    //     client.send(message);
    //   });
  }

  function onConnected() {
    console.log("MQTT client connected!");

    client.subscribe("temp", {
      onSuccess: onSubscribed,
      onFailure: onFailure
    });
    client.subscribe("daan", {
      onSuccess: onSubscribed,
      onFailure: onFailure
    });
  }

  function onFailure(err) {
    console.log(err);
  }


  function onMessageArrived(message) {
    switch (message.destinationName) {
      case "daan":
        let currentTime = new Date();

        document.getElementById("divSubscription").innerHTML +=
          message.payloadString + " (" + currentTime.toLocaleTimeString() + ")<br>";
        console.log("onMessageArrived: " + message.payloadString);
        break;
      case "temp":
        console.log(message.payloadString);
        $.getScript('/js/main.js')
          .done(() => {
            drawTable([{ id: 12, time: '2019-11-08 9:56:33', temp: '21', speed: '1000' }], true)
          });
        break;
      default:
        break;
    }
  }

  function onSubscribed(invocationContext) {
    console.log("MQTT client subscribed!");
  }


});

