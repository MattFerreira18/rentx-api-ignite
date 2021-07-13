interface IDate {
  startDate?: Date;
  endDate: Date;
}

export interface IDateProvider {
  convertToUTC(date: Date): string;
  compareInHours(data: IDate): number;
  compareInDays(startDate: Date, endDate: Date): number;
  dateNow(): Date;
}
