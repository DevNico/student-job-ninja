import { AuthUser } from 'src/common/auth/auth-user.model';

//custom type declaration for AuthUser
export {};

declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
    }
  }
}
