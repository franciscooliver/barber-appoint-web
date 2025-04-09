export interface WorkingHour {
  start: string;
  end: string;
  intervalTime: number|null;
  intervals: string[];
  isActive: boolean;
}

export interface BarbershopSettings {
  workingDays: number[];
  workingHours: {
    [key: string]: WorkingHour;
  };
  intervalTime: number;
  isActive: boolean;
}
