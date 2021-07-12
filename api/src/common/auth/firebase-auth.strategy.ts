import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Db } from 'mongodb';
import { Collections } from '../enums/colletions.enum';
import { AuthUser } from './auth-user.model';
@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  constructor(
    @Inject('FIREBASE_ADMIN')
    private admin: any,
    @Inject('MONGO_CONNECTION')
    private mongodb: Db,
  ) {
    super();
  }
  private readonly logger = new Logger(FirebaseStrategy.name);

  //call verify every time an endpoint is marked with @useGuard(AuthGuard)
  async validate(req: Request): Promise<AuthUser> {
    let token: string =
      req.headers['authorization'] ?? req.headers['Authorization'];
    if (!token) throw new UnauthorizedException();
    token = token.replace('Bearer ', '');

    const decodedToken: admin.auth.DecodedIdToken = await this.admin
      .auth()
      .verifyIdToken(token)
      .catch(() => {
        //throw error if user not validated / not found / not signed up
        throw new UnauthorizedException();
      });

    const roles = await this.getRolesFromAuthStore(decodedToken.user_id);
    Object.assign(decodedToken, { roles: roles });
    return decodedToken as AuthUser;
  }

  async getRolesFromAuthStore(userId: string): Promise<string[]> {
    return await this.mongodb
      .collection(Collections.Registry)
      .findOne({ _id: userId })
      .then((result) => {
        if (result && result.roles) return result.roles;
        return [];
      })
      .catch((err) => {
        if (err.code === 404) return [];
        this.logger.error(err);
        throw new InternalServerErrorException();
      });
  }
}
