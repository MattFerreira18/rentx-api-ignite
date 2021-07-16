interface IDate {
  startDate?: Date;
  endDate: Date;
}

export interface IDateProvider {
  convertToUTC(date: Date): string;
  compareInHours(data: IDate): number;
  compareIfBefore(startDate: Date, endDate: Date): boolean;
  compareInDays(startDate: Date, endDate: Date): number;
  addDays(days: number): Date;
  addHours(hours: number): Date;
  dateNow(): Date;
}
