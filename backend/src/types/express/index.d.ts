import { IUser } from '../../models/User';

// Augment Express's Request type so `req.user` is available and typed
// after the `protect` auth middleware has run.
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
