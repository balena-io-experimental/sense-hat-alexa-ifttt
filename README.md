# sense-hat supervisor state + Alexa via IFTTT

set up your IFTTT account with your Amazon Alexa [here](https://ifttt.com/amazon_alexa)

1. enable [public URL](https://docs.resin.io/management/devices/#enable-public-device-url) on your device and note it down
2. create an IFTTT applet with Alexa `Say a specific phrase` as **this** and `Maker webhooks` pointing to GET *`YOUR_RESIN_PUBLIC_URL`*/draw/[chosen_icon](https://github.com/resin-io-playground/sense-hat-alexa-ifttt/blob/master/app/index.js#L18-L139) (pick any content type as you want and leave the body blank)

## Configure via [environment variables](https://docs.resin.io/management/env-vars/)

Variable Name          | Default      | Description
---------------------- | ------------ | -----------------------------------------
PORT | `80` | the port the webserver is exposed on
RED | `0` | the red saturation, accepts values between `0` and `255`
GREEN | `255` | the green saturation, accepts values between `0` and `255`
BLUE | `0` | the blue saturation, accepts values between `0` and `255`
