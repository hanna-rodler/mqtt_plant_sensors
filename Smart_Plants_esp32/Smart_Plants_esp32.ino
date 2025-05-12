#include <WiFi.h> 
#include <WiFiClientSecure.h>       // Library for WiFi connectivity
#include <DHT.h>        // Library for the DHT sensor
#include <PubSubClient.h> // Library for MQTT communication

// --- WiFi Network Credentials (Replace with yours!) ---
const char* ssid = "TP-Link_ACFA";     // Enter your Hotspot Name here
const char* password = "26839141"; // Enter your Hotspot Password here
// const char* ssid = "SmartPlant-2GHz";    
// const char* password = "smartplant"; 

// --- MQTT Broker Configuration  ---
const char *mqttServer = "9e404e4cabd74dd6b618e22764c52e5c.s1.eu.hivemq.cloud"; 
const int mqttPort = 8883; // Standard MQTT Port (verschlüsselt)
const char *mqttUser = "planter";
const char *mqttPassword = "planterCoNnect5789103tomeFun";
const char *mqttClientId = "SmartPlantClient"; // unique client ID

// --- MQTT Topics ---
const char *topicTemperature = "sensors/plant1/temperature";
const char *topicHumidity = "sensors/plant1/humidity";
const char *topicLight = "sensors/plant1/light";
const char *topicMoisture = "sensors/plant1/moisture";
const char *topicLightcontrol = "smartplant/lightcontrol";

// --- MQTT Client Setup ---
WiFiClientSecure espClient; // Network client for MQTT
PubSubClient mqttClient(espClient); // MQTT client instance

// --- Sensor Pin Definitions ---
#define DHTPIN 21       // Digital pin for DHT11 (GPIO 21)
#define LIGHT_PIN 34    // Analog pin (ADC1-6) for light sensor
#define MOISTURE_PIN 36 // Analog pin (ADC1-0) for soil moisture sensor

// --- DHT Sensor Setup ---
#define DHTTYPE DHT11   // Specify DHT type DHT11 
DHT dht(DHTPIN, DHTTYPE);

// --- Calibration Constants ---
const int MOISTURE_DRY_VALUE = 2962; 
const int MOISTURE_WET_VALUE = 977;

const int LIGHT_DARK_VALUE = 858;   
const int LIGHT_BRIGHT_VALUE = 4095; 

// --- Timing Configuration ---
#define PUBLISH_INTERVAL_MINUTES 5 // Send every X minutes
const long publishIntervalMillis = PUBLISH_INTERVAL_MINUTES * 60 * 1000; // Conversion to milliseconds
unsigned long lastPublishTime = 0; // Timestamp of last transmission

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
        if (mqttClient.connect(mqttClientId, mqttUser, mqttPassword)) {
            Serial.println("connected");
        } else {
            Serial.print("failed, rc=");
            Serial.print(mqttClient.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }
}

void publishTopic (PubSubClient& client, const char* topic, const char* payload){
    if(client.publish(topic, payload)){
        Serial.print("  Published ");
        Serial.println(topic);
    }else{
        Serial.print("  Failed to publish ");
        Serial.println(topic);
    }
}


void setup() {
    Serial.begin(115200); 
    delay(100); 

    connectToWifi();
    espClient.setInsecure();
    
    mqttClient.setServer(mqttServer, mqttPort);

    Serial.println("Initializing sensors...");
    dht.begin();
    Serial.println("Setup complete. Starting readings...");
    Serial.println("===========================================");
}


void loop() {
    // 1. Check WiFi connection status; try to reconnect if lost
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi Disconnected. Reconnecting...");
        connectToWifi(); 
        return; 
    }

    // 2. Check MQTT connection status; try to reconnect if lost
    if (!mqttClient.connected()) {
        connectMQTT();
    }
    // IMPORTANT: MQTT Client Loop must be called regularly!
    mqttClient.loop(); // Allows the client to process messages and maintain a connection

    // 3. Check if it's time to publish data
    unsigned long currentTime = millis();
    if (currentTime - lastPublishTime >= publishIntervalMillis) {
        lastPublishTime = currentTime; 

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

        // --- Print sensor values ---
        Serial.print("  Temperature: "); Serial.print(temperature); Serial.println(" *C");
        Serial.print("  Humidity: "); Serial.print(humidity); Serial.println(" %");
        Serial.print("  Light: "); Serial.print(lightPercent); Serial.println(" %");
        Serial.print("  Moisture: "); Serial.print(moisturePercent); Serial.println(" %");

        // --- Prepare Data for Sending ---
        char tempString[8]; // Buffer for the conversion from float to string
        char humString[8];
        char lightString[8];
        char moistString[8];

        dtostrf(temperature, 4, 1, tempString); // Format: min. 4 characters, 1 decimal place
        dtostrf(humidity, 4, 1, humString);
        snprintf(lightString, 8, "%ld", lightPercent); 
        snprintf(moistString, 8, "%ld", moisturePercent);

        // --- Publish Data via MQTT ---
        publishTopic(mqttClient, topicTemperature, tempString);
        publishTopic(mqttClient, topicHumidity, humString);
        publishTopic(mqttClient, topicLight, lightString);
        publishTopic(mqttClient, topicMoisture, moistString);                      

        // light control
        if(lightPercent<=60){
            if(mqttClient.publish(topicLightcontrol, "{\"state\": \"ON\"}")){
                Serial.print("  Published Light control to: ");
                Serial.println(topicLightcontrol);
                Serial.println("Light ON"); 
            }else {
                Serial.println("  Failed to publish Light control");
            }
        }else{
            if(mqttClient.publish(topicLightcontrol,  "{\"state\": \"OFF\"}")){
                Serial.print("  Published Light control to: "); 
                Serial.println(topicLightcontrol);
                Serial.println("Light OFF"); 
            }else {
                Serial.println("  Failed to publish Light control");
            }
        }

        Serial.println("-------------------------------------------");

    }
}