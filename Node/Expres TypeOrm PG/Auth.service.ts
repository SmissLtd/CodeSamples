import { AccessToken, UserType, User, TenantWorkingTime } from '../entities';
import { UserRepository, TenantRepository } from '../repositories';
import { getCustomRepository, getConnection } from 'typeorm';

export class AuthService {
  static async authenticateUser(user: User) {
    const userRepo = getCustomRepository(UserRepository);
    if (!user.token) {
      const token = new AccessToken();
      token.user = user;
      user.token = token;
    }
    user.token.updatedAt = new Date();
    await user.token.save();
    return await userRepo.findWithTokenById(user?.id);
  }

  static async loginUser(email: string, password: string) {
    const userRepo = getCustomRepository(UserRepository);
    const user = await userRepo.findByEmailAndPassword(email, password);
    if (user) {
      return this.authenticateUser(user);
    } else return null;
  }

  static async getUserByEmail(email: string) {
    const userRepo = getCustomRepository(UserRepository);
    const user = await userRepo.findUserByEmail(email);
    if (user) {
      return user;
    } else return null;
  }

  static async getUserByTelegramId(telegramId: number) {
    const userRepo = getCustomRepository(UserRepository);
    const user = await userRepo.findUserByTelegramId(telegramId);
    if (user) {
      return user;
    } else return null;
  }

  static registerUser(email: string, tenant_name: string, timezone: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
      const connection = getConnection();
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        // get repos
        const userRepo = queryRunner.manager.getCustomRepository(UserRepository);
        const tenantRepo = queryRunner.manager.getCustomRepository(TenantRepository);
        // save tenant and working time schedule
        const tenant = tenantRepo.create({ name: tenant_name, timezone });
        await queryRunner.manager.save(tenant)
        const wt = new TenantWorkingTime();
        wt.tenant = tenant;
        await queryRunner.manager.save(wt)
        // save user
        const user = userRepo.create({
          email,
          password: 'admin',
          userType: UserType.ADMIN,
          tenant,
        });
        await queryRunner.manager.save(user)
        const authenticatedUser = await this.authenticateUser(user);
        await queryRunner.commitTransaction();
        resolve(authenticatedUser);
      } catch (error) {
        await queryRunner.rollbackTransaction();
        reject(error);
      } finally {
        await queryRunner.release();
      }
    });
  }
}
