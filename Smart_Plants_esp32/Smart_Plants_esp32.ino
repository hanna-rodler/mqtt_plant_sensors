#include <WiFi.h> 
#include <WiFiClientSecure.h>       // Library for WiFi connectivity
#include <DHT.h>        // Library for the DHT sensor
#include <PubSubClient.h> // Library for MQTT communication

// --- WiFi Network Credentials (Replace with yours!) ---
// const char* ssid = "Lukas_Wifi";     // Enter your Hotspot Name here
// const char* password = "HotSpot123"; // Enter your Hotspot Password here
const char* ssid = "SmartPlant-2GHz";     // Enter your Hotspot Name here
const char* password = "smartplant"; // Enter your Hotspot Password here
// --- ------------------------------------------ ---

// --- MQTT Broker Configuration  ---
const char* mqtt_server = "9e404e4cabd74dd6b618e22764c52e5c.s1.eu.hivemq.cloud"; // Z.B. "192.168.1.100" oder "test.mosquitto.org"
// const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 8883; // Standard MQTT Port (verschlüsselt)
const char* mqtt_user = "planter";
const char* mqtt_password = "planterCoNnect5789103tomeFun";
const char* mqtt_client_id = "SmartPlantClient"; // Eindeutige Client-ID

// --- MQTT Topics ---
const char* topic_temperature = "sensors/plant1/temperature";
const char* topic_humidity = "sensors/plant1/humidity";
const char* topic_light = "sensors/plant1/light";
const char* topic_moisture = "sensors/plant1/moisture";

// --- MQTT Client Setup ---
WiFiClientSecure espClient; // Netzwerk-Client für MQTT
PubSubClient mqttClient(espClient); // MQTT-Client Instanz

// --- Sensor Pin Definitions ---
#define DHTPIN 21       // Digital pin for DHT11/22 (GPIO 21)
#define LIGHT_PIN 34    // Analog pin (ADC1-6) for light sensor
#define MOISTURE_PIN 36 // Analog pin (ADC1-0 / SVP) for soil moisture sensor

// --- DHT Sensor Setup ---
#define DHTTYPE DHT11   // Specify DHT type (DHT11 or DHT22)
DHT dht(DHTPIN, DHTTYPE);

// --- Calibration Constants ---
const int MOISTURE_DRY_VALUE = 2962; 
const int MOISTURE_WET_VALUE = 977;

const int LIGHT_DARK_VALUE = 858;   
const int LIGHT_BRIGHT_VALUE = 4095; 
// --- -------------------------------------------------------------------- ---

// --- Timing Configuration ---
#define PUBLISH_INTERVAL_MINUTES 1 // Sende alle X Minuten (1 oder 5)
const long publishIntervalMillis = PUBLISH_INTERVAL_MINUTES * 6000; // * 1000; // Umrechnung in Millisekunden
unsigned long lastPublishTime = 0; // Zeitstempel des letzten Sendens

// Helper function to connect to WiFi
void connectToWifi() {
    Serial.println("\nConnecting to WiFi...");
    WiFi.mode(WIFI_STA); // Set WiFi to Station mode
    WiFi.begin(ssid, password); // Start connection attempt

    Serial.print("Connecting to ");
    Serial.print(ssid);

    // Wait for connection
    int retries = 0;
    while (WiFi.status() != WL_CONNECTED && retries < 20) { // Maximal 20 Versuche (ca. 10 Sek)
        delay(500);
        Serial.print(".");
        retries++;
    }

    if(WiFi.status() == WL_CONNECTED) {
        // Connection successful
        Serial.println("\nWiFi connected!");
        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());
        Serial.println("-------------------------------------------");
    } else {
        Serial.println("\nWiFi connection failed. Rebooting in 5 seconds...");
        delay(5000);
        ESP.restart(); // Neustart bei fehlgeschlagener WLAN-Verbindung
    }
}

// Helper function to connect to MQTT Broker
void connectMQTT() {
    // Loop until we're reconnected
    while (!mqttClient.connected()) {
        Serial.print("Attempting MQTT connection...");
        // Wenn mit Benutzername/Passwort:
        if (mqttClient.connect(mqtt_client_id, mqtt_user, mqtt_password)) {
        // Wenn ohne Benutzername/Passwort:
        // if (mqttClient.connect(mqtt_client_id)) {
            Serial.println("connected");
            // Hier könnten Topics abonniert werden, falls nötig:
            // mqttClient.subscribe("ein/topic");
        } else {
            Serial.print("failed, rc=");
            Serial.print(mqttClient.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }
}


void setup() {
    Serial.begin(115200); 
    delay(100); // Kurze Pause

    connectToWifi();
    espClient.setInsecure();
    // Configure MQTT Client
    mqttClient.setServer(mqtt_server, mqtt_port);
    // Optional: Callback-Funktion setzen, wenn du auch Nachrichten empfangen willst
    // mqttClient.setCallback(callback); // callback Funktion muss dann definiert werden

    // Initialize sensors AFTER WiFi is connected
    Serial.println("Initializing sensors...");
    dht.begin();
    Serial.println("Setup complete. Starting readings...");
    Serial.println("===========================================");
}


void loop() {
    // 1. Check WiFi connection status; try to reconnect if lost
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi Disconnected. Reconnecting...");
        connectToWifi(); // Versucht erneut zu verbinden (inkl. potentiellem Reboot)
        return; // Nächste Loop-Iteration abwarten nach Verbindungsversuch
    }

    // 2. Check MQTT connection status; try to reconnect if lost
    if (!mqttClient.connected()) {
        connectMQTT();
    }
    // WICHTIG: MQTT Client Loop muss regelmäßig aufgerufen werden!
    mqttClient.loop(); // Erlaubt dem Client, Nachrichten zu verarbeiten und Verbindung zu halten

    // 3. Check if it's time to publish data
    unsigned long currentTime = millis();
    if (currentTime - lastPublishTime >= publishIntervalMillis) {
        lastPublishTime = currentTime; // Zeitstempel aktualisieren

        Serial.println("\nReading sensors and publishing data...");

        // --- Read Sensors ---
        float temperature = dht.readTemperature();
        float humidity = dht.readHumidity();
        int lightRaw = analogRead(LIGHT_PIN);
        int moistureRaw = analogRead(MOISTURE_PIN);

        // --- Calculate Percentages ---
        long lightPercent = map(lightRaw, LIGHT_DARK_VALUE, LIGHT_BRIGHT_VALUE, 0, 100);
        lightPercent = constrain(lightPercent, 0, 100);

        long moisturePercent = map(moistureRaw, MOISTURE_DRY_VALUE, MOISTURE_WET_VALUE, 0, 100);
        moisturePercent = constrain(moisturePercent, 0, 100);

        // --- Check for valid DHT readings ---
        if (isnan(humidity) || isnan(temperature)) {
            Serial.println("Failed to read from DHT sensor!");
            // Entscheide, ob du trotzdem die anderen Werte senden willst oder nicht
            // Hier senden wir sie trotzdem, aber du könntest hier auch 'return;' verwenden.
            humidity = -999.0; // Oder ein anderer Fehlerwert
            temperature = -999.0;
        }

        // --- Prepare Data for Sending ---
        // Option A: Sende jeden Wert an ein eigenes Topic
        char tempString[8]; // Puffer für die Umwandlung von Float zu String
        char humString[8];
        char lightString[8];
        char moistString[8];

        dtostrf(temperature, 4, 1, tempString); // Format: min. 4 Zeichen, 1 Nachkommastelle
        dtostrf(humidity, 4, 1, humString);
        snprintf(lightString, 8, "%ld", lightPercent); // Sicherer als itoa
        snprintf(moistString, 8, "%ld", moisturePercent);

        Serial.print("  Temperature: "); Serial.print(tempString); Serial.println(" *C");
        Serial.print("  Humidity: "); Serial.print(humString); Serial.println(" %");
        Serial.print("  Light: "); Serial.print(lightString); Serial.println(" %");
        Serial.print("  Moisture: "); Serial.print(moistString); Serial.println(" %");

        // --- Publish Data via MQTT ---
        if (mqttClient.publish(topic_temperature,  tempString)) {
            Serial.print("  Published Temperature to: "); Serial.println(topic_temperature);
        } else {
            Serial.println("  Failed to publish Temperature");
        }
        if (mqttClient.publish(topic_humidity, humString)) {
            Serial.print("  Published Humidity to: "); Serial.println(topic_humidity);
        } else {
            Serial.println("  Failed to publish Humidity");
        }
        if (mqttClient.publish(topic_light, lightString)) {
             Serial.print("  Published Light to: "); Serial.println(topic_light);
        } else {
            Serial.println("  Failed to publish Light");
        }
        if (mqttClient.publish(topic_moisture, moistString)) {
             Serial.print("  Published Moisture to: "); Serial.println(topic_moisture);
        } else {
            Serial.println("  Failed to publish Moisture");
        }

        Serial.println("-------------------------------------------");

    }
    
}

// Optional: Callback Funktion für eingehende MQTT Nachrichten (wenn du 'setCallback' verwendest)
/*
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);

  // Hier könntest du auf Nachrichten reagieren, z.B. Einstellungen ändern
}
*/