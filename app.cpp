#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT11

#define LDR_PIN 34

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);

  dht.begin();

  pinMode(LDR_PIN, INPUT);
}

void loop() {

  // Đọc nhiệt độ và độ ẩm
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  // Đọc ánh sáng
  int lightValue = analogRead(LDR_PIN);

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Không đọc được DHT11!");
    delay(2000);
    return;
  }

  Serial.print("Nhiet do: ");
  Serial.print(temperature);
  Serial.println(" °C");

  Serial.print("Do am: ");
  Serial.print(humidity);
  Serial.println(" %");

  Serial.print("Anh sang: ");
  Serial.println(lightValue);

  Serial.println("----------------------");

  delay(2000);
}