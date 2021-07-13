import { ICreateSpecificationDTO } from '../../dtos/ISpecificationDTO';
import { Specification } from '../../infra/database/entities/Specification';
import { ISpecificationsRepository } from '../ISpecificationsRepository';

export class SpecificationsRepositoryInMemory
implements ISpecificationsRepository {
  private repository: Specification[] = [];

  async create({ name, description }: ICreateSpecificationDTO): Promise<void> {
    const specification = new Specification();

    Object.assign(specification, { name, description });

    this.repository.push(specification);
  }

  async findByName(name: string): Promise<Specification> {
    return this.repository.find((specification) => specification.name === name);
  }

  async findByIds(ids: string[]): Promise<Specification[]> {
    return this.repository.filter((specification) => ids.includes(specification.id));
  }
}
