import { Router } from 'express';
import { Authenticate, HasRole } from '../middlewares';
import { getCustomRepository } from 'typeorm';
import { ClientRepository } from '../repositories';
import { UserType } from '../entities';
import { ValidationError } from '../utils/ValidationError';
import { NextErrorHandler } from '../types';

export const ClientRouter = Router();

ClientRouter.use(Authenticate);
ClientRouter.use(HasRole(UserType.MANAGER));
const clientRepo = getCustomRepository(ClientRepository);

ClientRouter.get('/', async (req, res) => {
    const clients = await clientRepo.findAllClients(req.user.tenant);
    res.send(clients);
});

ClientRouter.get('/:id', async (req, res, next: NextErrorHandler) => {
    const client = await clientRepo.findClientById(req.params.id);
    if (client) {
        res.send(client);
    } else {
        next({ code: 404, error: { message: 'Not found' } });
    }
});

ClientRouter.post('/', (req, res, next) => {
    clientRepo
        .createFromBody(req.body, req.user)
        .then(instance => res.status(201).send(instance))
        .catch(error => ValidationError(next, error));
});

ClientRouter.put('/:id', (req, res, next) => {
    clientRepo
        .updateFromBody(req.body, req.params.id)
        .then(instance => res.send(instance))
        .catch(next);
});

ClientRouter.delete('/:id', (req, res, next: NextErrorHandler) => {
    clientRepo
        .deleteInstance(req.params.id)
        .then(_ => res.status(204).send())
        .catch(_ => next({ code: 404, error: { message: 'Not found' } }));
});
