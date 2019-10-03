import * as moment from "moment";
import { Moment } from "moment";

import Base = moment.unitOfTime.Base;

class Time {
  private rawTime: string;

  private possibleUnits: string[] = [
    "seconds",
    "minutes",
    "hours",
    "days",
    "weeks",
    "months",
    "years"
  ];

  private parsedTime: Moment;

  constructor(rawTime: string) {
    this.rawTime = rawTime;
    this.parseTime();
  }

  public getMomentTime(): Moment {
    return this.parsedTime;
  }

  public getStringTime(): string {
    return this.parsedTime.format("DD.MM.YY HH:mm");
  }

  private parseTime() {
    /* rawTime variants
        1) 0...n seconds ago
        4) a minute ago
        5) 2...n minutes ago
        2) an hour ago
        3) 2...n hours ago
        6) Yesterday
        7) 2...n days ago
        8) one week ago
        9) 2..n weeks ago
        10) 1 month ago
        )11 2...n months ago */
    const regExp: RegExp = /(a|an|[\d]*) ([\w]*) ago/;
    const match = this.rawTime.match(regExp);
    let duration: number = 1;
    let units: string = "days";
    if (match !== null && match[1] && match[2]) {
      if (match[1] === "a" || match[1] === "an") {
        duration = 1;
      } else {
        duration = parseInt(match[1], 10);
      }
      units = match[2];
      if (units[units.length - 1] !== "s") {
        units += "s";
      }
    } else if (this.rawTime !== "Yesterday") {
      this.logError();
    }
    if (!this.isUnitTypeCorrect(units)) {
      this.logError();
    } else {
      this.parsedTime = moment().subtract(duration, units);
    }
  }

  private isUnitTypeCorrect(unit: string): unit is Base {
    return this.possibleUnits.includes(unit);
  }

  private logError() {
    throw new Error(`problems with parsing time from ${this.rawTime}`);
  }
}

export { Time };
