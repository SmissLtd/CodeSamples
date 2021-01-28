import { Authenticate } from './../middlewares/Authenticate';
import { Router, Response, Request } from 'express';
import { getCustomRepository } from 'typeorm';
import { NextErrorHandler } from '../types';
import { AuthService } from '../services/Auth.service';
import { OAuth2Client } from 'google-auth-library';
import { AsyncErrorsCatcher } from '../middlewares/ErrorHandler';
import { Hasher, ValidationError } from '../utils';
import { AccessTokenRepository, PassResetTokenRepository } from '../repositories';
import {
    SignInValidator,
    Validate,
    SignUpValidator,
    ForgotPasswordValidator,
    ChangePasswordValidator,
} from '../utils/validators';
import momenttz from 'moment-timezone';

export const AuthRouter = Router();

AuthRouter.get('/timezones', (_, res) => res.send({ timezones: momenttz.tz.names() }));
AuthRouter.post('/login', AsyncErrorsCatcher(login));
AuthRouter.post('/registration', AsyncErrorsCatcher(registration));
AuthRouter.post('/login/google', AsyncErrorsCatcher(googleLogin));
AuthRouter.post('/login/telegram', AsyncErrorsCatcher(telegramLogin));
AuthRouter.post('/forgot-password', AsyncErrorsCatcher(forgotPassword));
AuthRouter.post('/change-password/:passResetToken', AsyncErrorsCatcher(confirmPasswordReset));
AuthRouter.post('/logout', Authenticate, logout);

async function login(req: Request, res: Response, next: NextErrorHandler) {
    const { body } = req;
    await Validate(body, SignInValidator);
    const user = await AuthService.loginUser(body.email, body.password);
    if (user) {
        res.send(user);
    } else {
        next({ code: 401, error: { message: 'Authorization failed' } });
    }
}

async function registration(req: Request, res: Response, next: NextErrorHandler) {
    const { body } = req;
    try {
        await Validate(body, SignUpValidator);
        const { email, tenant_name, timezone } = body;
        const user = await AuthService.registerUser(email, tenant_name, timezone);
        res.send(user);
    } catch (error) {
        next({ code: 400, error: { message: 'Validation failed', error: error } });
    }
}

async function googleLogin(req: Request, res: Response, next: NextErrorHandler) {
    const { body } = req;
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken: body.token_id,
        audience: process.env.GOOGLE_ID || '',
    });
    const payload = ticket.getPayload();
    if (!payload?.email) return next({ code: 401, error: { message: 'Payload is required' } });
    const user = await AuthService.getUserByEmail(payload.email);
    if (user) {
        const authenticatedUser = await AuthService.authenticateUser(user);
        res.send(authenticatedUser);
    } else {
        next({ code: 401, error: { message: 'No users associated with this google account' } });
    }
}

async function telegramLogin(req: Request, res: Response, next: NextErrorHandler) {
    const { body } = req;

    // forming data-check-string as in telegram instructions
    const authData = { ...body };
    delete authData.hash;
    let dataCheck = [];
    for (let key in authData) {
        dataCheck.push(key + '=' + authData[key]);
    }
    dataCheck.sort();

    if (!Hasher.compareSHA256(body.hash, dataCheck.join('\n'), process.env.TELEGRAM_BOT_TOKEN!)) {
        return next({ code: 401, error: { message: 'Hash is not verified!' } });
    }

    const user = await AuthService.getUserByTelegramId(body.id);

    if (user) {
        const authenticatedUser = await AuthService.authenticateUser(user);
        res.send(authenticatedUser);
    } else {
        next({
            code: 401,
            error: { message: 'No users associated with this telegram account' },
        });
    }
}

async function forgotPassword(req: Request, res: Response, next: NextErrorHandler) {
    const passResetTokenRepo = getCustomRepository(PassResetTokenRepository);
    try {
        await Validate(req.body, ForgotPasswordValidator);
    } catch (error) {
        return ValidationError(next, error);
    }
    try {
        await passResetTokenRepo.createResetPassToken(req.body);
        res.status(201).send();
    } catch (error) {
        next(error);
    }
}

async function confirmPasswordReset(req: Request, res: Response, next: NextErrorHandler) {
    const passResetTokenRepo = getCustomRepository(PassResetTokenRepository);
    try {
        await Validate(req.body, ChangePasswordValidator);
    } catch (error) {
        return ValidationError(next, error);
    }
    try {
        const user = await passResetTokenRepo.changePassFromBody(req.body, req.params.passResetToken);
        res.send(user);
    } catch (error) {
        next(error);
    }
}

function logout(req: Request, res: Response, next: NextErrorHandler) {
    const tokenRepo = getCustomRepository(AccessTokenRepository);
    const token = req.headers.authorization!.split('Access-Token ')[1];
    tokenRepo
        .delete({ token })
        .then(_ => res.send(204))
        .catch(error => ValidationError(next, error));
}
