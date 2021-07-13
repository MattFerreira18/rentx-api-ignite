import { Specification } from '../infra/database/entities/Specification';

export interface ICreateCarDTO {
  name: string;
  description: string;
  dailyRate: number;
  licensePlate: string;
  fineAmount: number;
  brand: string;
  specifications?: Specification[];
  categoryId: string;
  available?: boolean;
  id?: string;
}
