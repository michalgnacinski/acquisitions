import { formatValidationError } from "#utils/format.js";
import { signInSchema, signupSchema } from "#validations/auth.validations.js";
import logger from "#config/logger.js";
import { authenticateUser, createUser } from "#servies/auth.service.js";
import { jwttoken } from "#utils/jwt.js";
import { cookies } from "#utils/cookies.js";

export const signup = async (req, res, next) => {
    try{
        const validationResult = signupSchema.safeParse(req.body);

        if(!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationError(validationResult.error)
            })
        }

        const { name, email, password, role } = validationResult.data;

        const user = await createUser( {name, email, password, role})

        const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role});

        cookies.set(res, 'token', token);

        logger.info('User  registred succesfuly: ${email}');
        res.status(201).json({
            message: 'User registred',
            user: {
                id: user.id, name: user.name, email: user.email, role: user.role
            }
        })
    } catch (e) {
        logger.error('signup error', e);

        if(e.message == 'USer with this email already exists') {
            return res.status(409).json({ error: 'Email already exists' });
        }

        next(e);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const validationResult = signInSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationError(validationResult.error),
            });
        }

        const { email, password } = validationResult.data;
        const user = await authenticateUser({ email, password });
        const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });

        cookies.set(res, 'token', token);
        logger.info('User signed in successfully: ${email}');

        res.status(200).json({
            message: 'User signed in',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (e) {
        logger.error('sign-in error', e);

        if (e.message === 'User not found' || e.message === 'Invalid password') {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        next(e);
    }
};

export const signOut = async (req, res, next) => {
    try {
        cookies.clear(res, 'token');
        logger.info('User signed out successfully');

        res.status(200).json({ message: 'User signed out' });
    } catch (e) {
        logger.error('sign-out error', e);
        next(e);
    }
};
