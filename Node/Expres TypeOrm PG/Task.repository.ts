import { EntityRepository, Repository, DeepPartial, getCustomRepository } from 'typeorm';
import { UserRepository } from './User.repository';
import { Task, User, UserType } from '../entities';
import { rejectNotFoundError, createValidationError } from '../utils';
import moment from 'moment';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    // prettier-ignore
    private taskSelectFields = [ 
                                'Task.id', 'Task.name', 'Task.description', 'Task.isArchived',
                                'Task.createdAt', 'Task.lastTimeActive', 'Project.id', 'Project.name',
                                'Task.archivedAt',
                               ];

    private getTasksWithProjects(isArchived = false) {
        const today = moment().format('YYYY-MM-DD');

        const timeRangeJoinCondition = isArchived
            ? undefined
            : `"TimeRange"."startTime"::date = :today OR "TimeRange"."endTime" IS NULL`;

        return this.createQueryBuilder()
            .select(this.taskSelectFields)
            .leftJoin('Task.project', 'Project')
            .leftJoinAndSelect('Task.timeRanges', 'TimeRange', timeRangeJoinCondition, { today })
            .where('Task.isArchived = :isArchived', { isArchived })
            .orderBy({ 'Task.lastTimeActive': 'DESC', 'Task.id': 'DESC' });
    }

    private getUserTasksQuery(user: User, isArchived: boolean) {
        return this.getTasksWithProjects(isArchived)
            .leftJoin('Task.user', 'User')
            .andWhere('User.id = :userId', { userId: user.id });
    }

    getTaskByIdRoleAware(id: number | string, user: User) {
        let query = this.getTasksWithProjects();
        const isManager = user.userType !== UserType.REGULAR;
        if (!isManager) {
            query.andWhere('Task.user.id = :userID', { userID: user.id });
        }
        query.andWhere('Task.id = :id', { id });

        return query.getOne();
    }

    findAllUserTasks(user: User, isArchived: boolean) {
        return this.getUserTasksQuery(user, isArchived).getMany();
    }

    findLatestUserTask(user: User) {
        return this.getUserTasksQuery(user, false).getOne();
    }

    findUserTasksById(id: number | string, isArchived: boolean) {
        return this.getTasksWithProjects(isArchived).andWhere('Task.user.id = :id', { id }).getMany();
    }

    findTaskByIdIfUserOwnsTask(taskId: number, userId: number) {
        return this.createQueryBuilder()
            .where('Task.id = :taskId')
            .andWhere('Task.user.id = :userId')
            .setParameters({ taskId, userId })
            .getOne();
    }
    
    async createFromBody(body: DeepPartial<Task>, userId: number, requestUser: User) {
        const userRepo = getCustomRepository(UserRepository);
        const isManager = UserType.REGULAR !== requestUser.userType;
        const task = this.create(body);

        if(isManager) {
            const user = await userRepo.findDetailedUserById(userId);
            if (user) {
                task.user = user;
            } else return rejectNotFoundError();
        } else {
            task.user = requestUser;    
        }
        return task.save();
    }

    async updateFromBody(body: DeepPartial<Task>, id: number | string, user: User) {
        body.id = Number(id);
        const task = await this.preload(body);
        if (!task) return rejectNotFoundError();
        const isManager = UserType.REGULAR !== user.userType;
        const isOwner = task.userId == user.id;
        if (!(isManager || isOwner)) return rejectNotFoundError();
        try {
            await task.save();
            return task;
        } catch (error) {
            return Promise.reject(createValidationError(error));
        }
    }

    async deleteInstance(id: string | number, user: User) {
        const task = await this.getTaskByIdRoleAware(id, user);
        if (task) return this.remove(task);
        return Promise.reject();
    }
}
