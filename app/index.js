{
  const express = require('express');
  const senseHat = require('node-sense-hat');
  const _ = require('lodash');
  const bodyParser = require('body-parser');
  const supervisor = require(__dirname + '/libs/supervisor/index.js');
  const app = express();
  const port = parseInt(process.env.PORT) || 80;

  // let's define pixel colors
  const red = parseInt(process.env.RED) || 0;
  const green = parseInt(process.env.GREEN) || 255;
  const blue = parseInt(process.env.BLUE) || 0;
  const b = [0, 0, 0];
  const c = [red, green, blue];
  let tmpIcon;

  const icons = {
    "splash": [
      b, b, c, c, c, c, b, b,
      b, c, b, b, b, b, c, b,
      c, b, c, b, b, c, b, c,
      c, b, b, b, b, b, b, c,
      c, b, c, b, b, c, b, c,
      c, b, b, c, c, b, b, c,
      b, c, b, b, b, b, c, b,
      b, b, c, c, c, c, b, b,
    ],

    "offline": [
      b, b, c, c, c, c, b, b,
      b, c, b, b, b, b, c, b,
      c, b, c, b, b, b, b, c,
      c, b, b, c, b, b, b, c,
      c, b, b, b, c, b, b, c,
      c, b, b, b, b, c, b, c,
      b, c, b, b, b, b, c, b,
      b, b, c, c, c, c, b, b,
    ],

    "stop": [
      b, b, c, c, c, c, b, b,
      b, c, b, b, b, b, c, b,
      c, b, b, b, b, b, b, c,
      c, b, c, c, c, c, b, c,
      c, b, c, c, c, c, b, c,
      c, b, b, b, b, b, b, c,
      b, c, b, b, b, b, c, b,
      b, b, c, c, c, c, b, b,
    ],

    "download": [
      b, b, b, c, c, b, b, b,
      b, b, b, c, c, b, b, b,
      b, b, b, c, c, b, b, b,
      b, b, b, c, c, b, b, b,
      c, c, b, c, c, b, c, c,
      b, c, c, c, c, c, c, b,
      b, b, c, c, c, c, b, b,
      b, b, b, c, c, b, b, b,
    ],

    "fwd": [
      b, b, b, b, c, b, b, b,
      b, b, b, b, c, c, b, b,
      b, b, b, b, b, c, c, b,
      c, c, c, c, c, c, c, c,
      c, c, c, c, c, c, c, c,
      b, b, b, b, b, c, c, b,
      b, b, b, b, c, c, b, b,
      b, b, b, b, c, b, b, b,
    ],

    "busy": [
      b, b, b, b, b, b, b, b,
      b, b, b, b, b, b, b, b,
      b, b, b, b, b, b, b, b,
      c, c, b, c, c, b, c, c,
      c, c, b, c, c, b, c, c,
      b, b, b, b, b, b, b, b,
      b, b, b, b, b, b, b, b,
      b, b, b, b, b, b, b, b,
    ],

    "sad": [
      b, b, c, c, c, c, b, b,
      b, c, b, b, b, b, c, b,
      c, b, c, b, b, c, b, c,
      c, b, b, b, b, b, b, c,
      c, b, b, c, c, b, b, c,
      c, b, c, b, b, c, b, c,
      b, c, b, b, b, b, c, b,
      b, b, c, c, c, c, b, b,
    ],

    "smile": [
      b, b, c, c, c, c, b, b,
      b, c, b, b, b, b, c, b,
      c, b, c, b, b, c, b, c,
      c, b, b, b, b, b, b, c,
      c, b, c, b, b, c, b, c,
      c, b, b, c, c, b, b, c,
      b, c, b, b, b, b, c, b,
      b, b, c, c, c, c, b, b,
    ],

    "note": [
      b, b, b, b, c, b, b, b,
      b, b, b, b, c, c, b, b,
      b, b, b, b, c, b, c, b,
      b, b, b, b, c, c, c, c,
      b, b, c, c, c, b, b, b,
      b, c, b, b, c, b, b, b,
      b, c, b, b, c, b, b, b,
      b, b, c, c, b, b, b, b,
    ],

    "wifi": [
      c, c, c, c, c, c, c, c,
      b, b, b, b, b, b, b, b,
      b, c, c, c, c, c, c, b,
      b, b, b, b, b, b, b, b,
      b, b, c, c, c, c, b, b,
      b, b, b, b, b, b, b, b,
      b, b, b, c, c, b, b, b,
      b, b, b, c, c, b, b, b,
    ],

    "blank": [
      b, b, b, b, b, b, b, b,
      b, b, b, b, b, b, b, b,
      b, b, b, b, b, b, b, b,
      b, b, b, b, b, b, b, b,
      b, b, b, b, b, b, b, b,
      b, b, b, b, b, b, b, b,
      b, b, b, b, b, b, b, b,
      b, b, b, b, b, b, b, b,
    ]
  };

  // Configure the express middleware
  errorHandler = (err, req, res, next) => {
    'use strict';
    res.status(500);
    res.render('error', {
      error: err
    });
  };
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(function(req, res, next) {
    'use strict';
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.use(errorHandler);

  // Let's define some methods
  app.get('/draw/:icon', (req, res) => {
    'use strict';
    // we want the icon parameter to be always sent, so if it's not passed we send an error response
    // we also want to limit the value to the possible ones
    if (!req.params.icon || _.includes(icons, req.params.icon)) {
      return res.status(400).send('Bad Request');
    }
    console.log(chalk.cyan('Icon received! drawing...'));
    tmpIcon = req.params.icon;
    senseHat.sense.setPixels(icons.tmpIcon);
    res.status(200).send('OK');
  });

  // start the server on given port
  app.listen(port);

  // hook to supervisor states and display an icon for each state
  supervisor.start(500, () => {
    'use strict';
    supervisor.on('status', (status) => {
      console.log(chalk.white('Supervisor status update: ' + status));
      switch (status) {
        case "Idle":
          senseHat.sense.setPixels(icons.smile);
          break;
        case "Installing":
          senseHat.sense.setPixels(icons.busy);
          break;
        case "Downloading":
          senseHat.sense.setPixels(icons.download);
          break;
        case "Starting":
          senseHat.sense.setPixels(icons.fwd);
          break;
        case "Stopping":
          senseHat.sense.setPixels(icons.stop);
          setTimeout(() => {
            process.exit(1);
          }, 1000);
          break;
      }
    });
  });

}
