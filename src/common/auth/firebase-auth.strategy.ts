import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
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

  //call verify every time an endpoint is marked with @useGuard(AuthGuard)
  async validate(req: Request): Promise<AuthUser> {
    let token: string =
      req.headers['authorization'] ?? req.headers['Authorization'];
    if (!token) throw new UnauthorizedException();
    token = token.replace('Bearer ', '');
    //TODO REMOVE MOCK
    /*
    const tokenSplit = token.split(':');
    const decodedToken: admin.auth.DecodedIdToken = {
      iss: 'https://securetoken.google.com/backend-test-3ed77',
      aud: 'backend-test-3ed77',
      auth_time: 1621366643,
      user_id: tokenSplit[0],
      sub: tokenSplit[0],
      iat: 1621366643,
      exp: 1621370243,
      email: tokenSplit[1],
      email_verified: false,
      firebase: {
        identities: { email: [Array] },
        sign_in_provider: 'password',
      },
      uid: tokenSplit[0],
    };
    */
    //get the decoded token from firebase api

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
        console.log(err);
        throw new InternalServerErrorException();
      });
  }
}
