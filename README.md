# Plant Sensor Readings using MQTT

course: Pervasive Computing

## Project setup

install dependencies: `npm i`
run: `npm start`

install mosquitto for localhost testing.

## Example prompts from cmd:

Light: `mosquitto_pub -h localhost -t sensors/device1/light -m "{ \"light\": 200}`
Temperature: `mosquitto_pub -h localhost -t sensors/device1/temperature -m "{ \"temperature\": 100}`
Moisture: `mosquitto_pub -h localhost -t sensors/device1/moisture -m "{ \"moisture\": 300}`
