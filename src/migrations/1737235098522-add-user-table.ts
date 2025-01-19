import { query } from 'express';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTable1737235098522 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS role (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL,
                PRIMARY KEY (id)
            );
        `);

    await queryRunner.query(`
            INSERT INTO role (name) VALUES ('admin'), ('user');    
        `);

    await queryRunner.query(
      `CREATE TRIGGER IF NOT EXISTS del_trg_role
                  BEFORE DELETE
                  ON role FOR EACH ROW
                  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Hard delete is not allowed!';
              ;`,
    );

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS user (
                id INT NOT NULL AUTO_INCREMENT,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                refresh_token VARCHAR(255) NULL,
                role_id INT NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL,
                CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(id),
                PRIMARY KEY (id)
            );    
        `);

    await queryRunner.query(
      `CREATE TRIGGER IF NOT EXISTS del_trg_user
                      BEFORE DELETE
                      ON user FOR EACH ROW
                      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Hard delete is not allowed!';
                  ;`,
    );

    await queryRunner.query(`
        INSERT INTO user (username, password, role_id) VALUES ('user1', '$2a$10$uhWQm..FIro22XYciST7yuWgcbZnpKwYoeQv3gksQ8YXfAbfwALQW', (SELECT MAX(id) FROM role WHERE name LIKE 'user'));    
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TRIGGER del_trg_user;    
        `);

    await queryRunner.query(`
            DROP TRIGGER del_trg_role;    
        `);

    await queryRunner.query(`
            ALTER TABLE user DROP FOREIGN KEY fk_user_role;
        `);

    await queryRunner.query(`
            DROP TABLE user;    
        `);

    await queryRunner.query(`
            DROP TABLE role;    
        `);
  }
}
