import { Router } from 'express';
import { Authenticate, HasRole } from '../middlewares';
import { getCustomRepository, DeepPartial } from 'typeorm';
import { AchievementRepository } from '../repositories';
import { NextErrorHandler } from '../types';
import { UserType } from '../entities';
import { ValidationError } from '../utils';

export const AchievementRouter = Router();
const achievementRepo = getCustomRepository(AchievementRepository);

AchievementRouter.use(Authenticate);
AchievementRouter.use(HasRole(UserType.MANAGER));

AchievementRouter.get('/', async (req, res) => {
    const achievements = await achievementRepo.findAllAchievements(req.user.tenant);
    res.send(achievements);
});

AchievementRouter.post('/', (req, res, next) => {
    achievementRepo
        .createFromBody(req.body, req.user)
        .then(instance => res.status(201).send(instance))
        .catch(error => ValidationError(next, error));
});

AchievementRouter.post('/:id/upload-image', (req, res, next) => {
    const image = (req.files as globalThis.Express.Multer.File[]).find(file => file.fieldname == 'image');
    if (!image) return next({ code: 400, error: { message: 'image is required field' } });
    achievementRepo
        .uploadImage(image, req.params.id)
        .then(instance => res.send(instance))
        .catch(next);
});

AchievementRouter.put('/:id', (req, res, next: NextErrorHandler) => {
    achievementRepo
        .updateFromBody(req.body, req.params.id)
        .then(instance => res.send(instance))
        .catch(next);
});

AchievementRouter.delete('/:id', (req, res, next: NextErrorHandler) => {
    achievementRepo
        .deleteInstance(req.params.id)
        .then(_ => res.status(204).send())
        .catch(_ => next({ code: 404, error: { message: 'Not found' } }));
});
