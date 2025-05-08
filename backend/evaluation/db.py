import paho.mqtt.client as mqtt
from logic import run_evaluation

MQTT_BROKER = "9e404e4cabd74dd6b618e22764c52e5c.s1.eu.hivemq.cloud"
HIVE_USERNAME = "planter"
HIVE_PW = "planterCoNnect5789103tomeFun"
TOPIC = "eval/plants"

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe(TOPIC)

def on_message(client, userdata, msg):
    message = msg.payload.decode().strip()
    print(f"Received message on {msg.topic}: {message}")
    print("Triggering evaluation...")
    run_evaluation()


client = mqtt.Client()
client.username_pw_set(HIVE_USERNAME, HIVE_PW)
client.tls_set()
client.on_connect = on_connect
client.on_message = on_message
client.connect(MQTT_BROKER, 8883)
client.loop_forever()
