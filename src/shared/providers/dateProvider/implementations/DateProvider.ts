import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IDateProvider } from '../IDateProvider';

dayjs.extend(utc);

interface IDate {
  startDate?: Date;
  endDate: Date;
}

export class DateProvider implements IDateProvider {
  addHours(hours: number): Date {
    return dayjs().add(hours, 'hours').toDate();
  }

  addDays(days: number): Date {
    return dayjs().add(days, 'days').toDate();
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  compareInHours({ startDate, endDate }: IDate): number {
    const startDateUTC = startDate
      ? this.convertToUTC(startDate)
      : this.convertToUTC(this.dateNow());

    const endDateUTC = this.convertToUTC(endDate);

    return dayjs(endDateUTC).diff(startDateUTC, 'hours');
  }

  compareInDays(startDate: Date, endDate: Date): number {
    const startDateUTC = startDate
      ? this.convertToUTC(startDate)
      : this.convertToUTC(this.dateNow());

    const endDateUTC = this.convertToUTC(endDate);

    return dayjs(endDateUTC).diff(startDateUTC, 'days');
  }

  dateNow(): Date {
    return dayjs().toDate();
  }
}
