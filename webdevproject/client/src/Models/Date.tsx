export class DateOnly 
{
    private _date: string;
  
    constructor(year: number, month: number, day: number) {
      // Ensure the date is in YYYY-MM-DD format
      this._date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  
    // Static method to create a DateOnly from a string (in YYYY-MM-DD format)
    static parse(dateString: string): DateOnly {
      const [year, month, day] = dateString.split("-").map(Number);
      return new DateOnly(year, month, day);
    }
  
    // Method to get the string representation of the date
    toString(): string {
      return this._date;
    }
  
    // Method to get the Date object with time set to midnight
    toDate(): Date {
      const [year, month, day] = this._date.split("-").map(Number);
      return new Date(year, month - 1, day); // Month is 0-based in JavaScript Date
    }
  
    // Method to compare two DateOnly objects
    isEqual(other: DateOnly): boolean {
      return this._date === other.toString();
    }
  }

  export class TimeSpan {
    constructor(
      public hours: number,
      public minutes: number,
      public seconds: number = 0
    ) {}
  
    // Converts the TimeSpan to a string in "HH:mm:ss" format
    toString(): string {
      return `${String(this.hours).padStart(2, "0")}:${String(this.minutes).padStart(2, "0")}:${String(this.seconds).padStart(2, "0")}`;
    }
  
    // Adds two TimeSpan objects together and returns a new TimeSpan object
    add(other: TimeSpan): TimeSpan {
      const totalSeconds = this.toTotalSeconds() + other.toTotalSeconds();
      return TimeSpan.fromTotalSeconds(totalSeconds);
    }
  
    // Converts the TimeSpan to the total number of seconds
    toTotalSeconds(): number {
      return this.hours * 3600 + this.minutes * 60 + this.seconds;
    }
  
    // Creates a TimeSpan from a total number of seconds
    static fromTotalSeconds(totalSeconds: number): TimeSpan {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return new TimeSpan(hours, minutes, seconds);
    }
  
    // Static method to create a TimeSpan from a string like "HH:mm:ss"
    static fromString(timeString: string): TimeSpan {
      const [hours, minutes, seconds] = timeString.split(":").map(Number);
      return new TimeSpan(hours, minutes, seconds || 0);
    }
  }