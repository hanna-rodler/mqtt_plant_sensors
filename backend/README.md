# Plant Sensor Readings using MQTT

course: Pervasive Computing

## Project setup

install dependencies: `npm i`
run: `npm run dev` from backend folder

install mosquitto for localhost testing.

## Publish & Subscribe

### Using hive mq:

`mosquitto_pub -h {brokerUrl} -t "sensors/device1/temperature" -m "{ \"temperature\": 400}" -u "{username}" -P "{password}" --insecure`
`mosquitto_pub -h {brokerUrl} -t "sensors/device1/temperature" -m "{ \"temperature\": 400}" -u "{username}" -P "{password}"`

### Example prompts from cmd:

Light: `mosquitto_pub -h localhost -t sensors/device1/light -m "{ \"light\": 200}`

Temperature: `mosquitto_pub -h localhost -t sensors/device1/temperature -m "{ \"temperature\": 100}`

Moisture: `mosquitto_pub -h localhost -t sensors/device1/moisture -m "{ \"moisture\": 300}`
