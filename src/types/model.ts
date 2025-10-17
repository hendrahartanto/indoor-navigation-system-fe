export type RawRSSI = {
  timestamp: Date;
  rssi1: number[];
  rssi2: number[];
  rssi3: number[];
  variance1: number;
  variance2: number;
  variance3: number;
  median1: number;
  median2: number;
  median3: number;
  mean1: number;
  mean2: number;
  mean3: number;
};

export type Log = {
  timestamp: Date;
  logType: LogType;
  text: string;
};

export type LogType = "MCU" | "ACTIVITY";
