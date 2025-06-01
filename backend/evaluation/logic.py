from pymongo import MongoClient
from datetime import datetime

MONGO_URI = "mongodb+srv://mqtt_smart_plant:xhsxGW2vHscBqgmB@sensorreadings.pllsr8a.mongodb.net/?retryWrites=true&w=majority&appName=sensorReadings"
DB_NAME = "test"

THRESHOLDS = {
    "temperature": (18, 26),
    "moisture": (0, 100),
    "light": (250, 1100),
    "humidity": (40, 80),
}

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collections
temperature_col = db["temperatures"]
moisture_col = db["moistures"]
light_col = db["lights"]
humidity_col = db["humidities"]
status_col = db["plant_results"]
feedback_col = db["plant_status_user"]

def get_all_plant_ids():
    device_ids = set()
    for collection in [temperature_col, moisture_col, light_col, humidity_col]:
        for doc in collection.find({}, {"device": 1}):
            if "device" in doc and doc["device"]:
                device_ids.add(doc["device"])
    return list(device_ids)

def get_latest_value(collection, device_id):
    doc = collection.find({"device": device_id}).sort("timestamp", -1).limit(1)
    return next(doc, None)

def fetch_latest_values(plant_id):
    temp_doc = get_latest_value(temperature_col, plant_id)
    moisture_doc = get_latest_value(moisture_col, plant_id)
    light_doc = get_latest_value(light_col, plant_id)
    humidity_doc = get_latest_value(humidity_col, plant_id)

    return {
        "temperature": temp_doc["temperature"] if temp_doc and "temperature" in temp_doc else None,
        "moisture": moisture_doc["moisture"] if moisture_doc and "moisture" in moisture_doc else None,
        "light": light_doc["light"] if light_doc and "light" in light_doc else None,
        "humidity": humidity_doc["humidity"] if humidity_doc and "humidity" in humidity_doc else None,
    }

def get_latest_user_feedback(plant_id):
    doc = feedback_col.find({"device": plant_id}).sort("timestamp", -1).limit(1)
    latest = next(doc, None)
    return latest["status"].lower() if latest and "status" in latest else None

def evaluate_plant(plant_id, latest_values, user_feedback=None):
    result = {
        "plant": plant_id,
        "evaluated_at": datetime.utcnow(),
        "status": "healthy",
        "score": 100,
        "issues": [],
        "user_feedback": user_feedback,
    }

    bad_sensors = 0

    for sensor, (min_val, max_val) in THRESHOLDS.items():
        value = latest_values.get(sensor)
        if value is None:
            result["issues"].append(f"No {sensor} data")
            bad_sensors += 1
            continue
        if value < min_val:
            result["issues"].append(f"{sensor.capitalize()} might be too low ({value})")
            bad_sensors += 1
        elif value > max_val:
            result["issues"].append(f"{sensor.capitalize()} might be too high ({value})")
            bad_sensors += 1
        else:
            result["issues"].append(f"{sensor.capitalize()} OK ({value})")

    if bad_sensors == 0:
        result["status"] = "healthy"
    elif bad_sensors <= 2:
        result["status"] = "moderate"
        result["score"] = 80
    else:
        result["status"] = "critical"
        result["score"] = 50

    if user_feedback:
        result["user_feedback"] = user_feedback
        if user_feedback == "critical":
            result["status"] = "critical"
            result["score"] = 50
            result["issues"].append("User reported: critical")
        elif user_feedback == "moderate":
            result["status"] = "moderate"
            result["score"] = min(result["score"], 80)
            result["issues"].append("User reported: moderate")
        elif user_feedback == "healthy":
            result["status"] = "healthy"
            result["score"] = max(result["score"], 100)
            result["issues"].append("User reported: healthy")

    return result

def compare_plants(result1, result2):
    if result1["score"] > result2["score"]:
        return f"{result1['plant']} is doing better than {result2['plant']} (Score: {result1['score']} vs {result2['score']})."
    elif result2["score"] > result1["score"]:
        return f"{result2['plant']} is doing better than {result1['plant']} (Score: {result2['score']} vs {result1['score']})."
    else:
        return f"{result1['plant']} and {result2['plant']} are performing similarly (Score: {result1['score']})."


def analyze_change_between_user_feedbacks(plant_id):
    feedbacks = list(
        feedback_col.find({"device": plant_id})
        .sort("timestamp", -1)
        .limit(2)
    )

    if len(feedbacks) < 2:
        return None  # Not enough data

    latest, previous = feedbacks[0], feedbacks[1]

    if latest["status"] == previous["status"]:
        return None  # No change in user feedback

    start_time = previous["timestamp"]
    end_time = latest["timestamp"]

    sensor_map = {
        "temperature": (temperature_col, THRESHOLDS["temperature"]),
        "moisture": (moisture_col, THRESHOLDS["moisture"]),
        "light": (light_col, THRESHOLDS["light"]),
        "humidity": (humidity_col, THRESHOLDS["humidity"]),
    }


    report = [f"\n🕓 User feedback changed from '{previous['status']}' → '{latest['status']}' for {plant_id}"]
    report.append(f"Analyzing data between {start_time.isoformat()} and {end_time.isoformat()}:")

    for sensor, (col, _) in sensor_map.items():
        values = [
            doc[sensor]
            for doc in col.find({
                "device": plant_id,
                "timestamp": {"$gte": start_time, "$lte": end_time}
            }) if sensor in doc
        ]
        if values:
            min_val = round(min(values), 2)
            max_val = round(max(values), 2)
            avg_val = round(sum(values) / len(values), 2)
            report.append(f"  {sensor.capitalize()}: min={min_val}, max={max_val}, avg={avg_val}")
        else:
            report.append(f"  {sensor.capitalize()}: no data in range")

    return report

def run_evaluation():
    plant_ids = get_all_plant_ids()
    plant_results = []

    if not plant_ids:
        print("No plants/devices found in database.")
        return

    print(f"Found devices/plants: {plant_ids}")

    for plant in plant_ids:
        values = fetch_latest_values(plant)
        print(f"\nFetched values for {plant}: {values}")
        user_feedback = get_latest_user_feedback(plant)
        result = evaluate_plant(plant, values, user_feedback)

        change_report = analyze_change_between_user_feedbacks(plant)
        if change_report:
            result["change_analysis"] = change_report

        status_col.insert_one(result)
        plant_results.append(result)

        print(f"\n📝 Evaluation for {plant}:")
        print(f"Status: {result['status']}")
        print(f"Score: {result['score']}")
        print(f"Issues: {result['issues']}")
        print(f"User Feedback: {result['user_feedback']}")

        if change_report:
            print("\n📊 Change analysis:")
            for line in change_report:
                print(line)

    if len(plant_results) >= 2:
        print("\n↔️ Comparison Results Between All Plants:")
        sorted_results = sorted(plant_results, key=lambda r: r['score'], reverse=True)
        for i in range(len(sorted_results)):
            for j in range(i + 1, len(sorted_results)):
                comparison = compare_plants(sorted_results[i], sorted_results[j])
                print(comparison)

if __name__ == "__main__":
    run_evaluation()
