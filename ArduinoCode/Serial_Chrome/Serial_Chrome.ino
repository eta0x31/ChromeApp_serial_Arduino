#include <Servo.h>

Servo motor1;
Servo motor2;
int incomingByte[10];

void setup() {
  motor1.attach(9);
  motor2.attach(10);
  Serial.begin(115200); 
}

int i,M1,M2,iii,dec;
bool first_last;

void loop(){
        if (Serial.available() > 0) {
            incomingByte[i] = Serial.read();
            if(incomingByte[i] == 0x26 || incomingByte[i] == 0x21){
              if(incomingByte[i] == 0x26)first_last = true, M1 = 0;
              if(incomingByte[i] == 0x21)first_last = false, M2 = 0;
               iii = i-1;
               dec = 1;
               for(int ii = 0;ii<i;ii++){
                  dec = 1;
                  for(int p = 0;p<iii;p++){
                    dec = dec * 10;
                  }
                  if(first_last == true)M1 = M1 + (incomingByte[ii]-48)* dec;
                  if(first_last == false)M2 = M2 + (incomingByte[ii]-48)* dec;
                  iii--;
               }
               motor1.write(M1);
               motor2.write(M2);
              i = 0;
            }else{
              i++;    
            }
        }
}

