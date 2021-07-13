import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class alterUserDeleteUsername1621786699483
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // remove username colum in Users table
    await queryRunner.dropColumn('users', 'username');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'username',
        type: 'varchar',
        isUnique: true,
      })
    );
  }
}
