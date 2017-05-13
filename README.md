# sense-hat supervisor state + Alexa via IFTTT

set up your IFTTT account with your Amazon Alexa [here](https://ifttt.com/amazon_alexa)

## Configure via [environment variables](https://docs.resin.io/management/env-vars/)

Variable Name          | Default      | Description
---------------------- | ------------ | -----------------------------------------
PORT | `80` | the port the webserver is exposed on
RED | `0` | the red saturation, accepts values between `0` and `255`
GREEN | `255` | the green saturation, accepts values between `0` and `255`
BLUE | `0` | the blue saturation, accepts values between `0` and `255`
