void setup() {
  // put your setup code here, to run once:
  pinMode(A0, INPUT);
  pinMode(A1, INPUT);
  pinMode(A2, INPUT);
  pinMode(A3, INPUT);
  pinMode(A4, INPUT);
  pinMode(A5, INPUT);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  int val0 = analogRead(A0);
  int val1 = analogRead(A1);
  int val2 = analogRead(A2);
  int val3 = analogRead(A3);
  int val4 = analogRead(A4);
  int val5 = analogRead(A5);
  Serial.println(String(val0)+"/"+String(val1)+"/"+String(val2)+"/"+String(val3)+"/"+String(val4)+"/"+String(val5));
}
