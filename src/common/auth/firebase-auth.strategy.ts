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
  async validate(req: Request): Promise<admin.auth.DecodedIdToken> {
    let token: string =
      req.headers['authorization'] ?? req.headers['Authorization'];
    if (!token) throw new UnauthorizedException();
    token = token.replace('Bearer ', '');
    //get the decoded token from firebase api
    const decodedToken: admin.auth.DecodedIdToken = await this.admin
      .auth()
      .verifyIdToken(token)
      .catch(() => {
        //thow error if user not validated / not found / not signed up
        throw new UnauthorizedException();
      });
    const roles = await this.getRolesFromAuthStore(decodedToken.user_id);
    Object.assign(decodedToken, roles);
    return decodedToken;
  }

  async getRolesFromAuthStore(userId: string): Promise<string[]> {
    return await this.mongodb
      .collection(Collections.Registry)
      .findOne({ _id: userId })
      .then((result) => {
        return [result.role];
      })
      .catch((err) => {
        if (err.code === 404) return [];
        throw new InternalServerErrorException();
      });
  }
}
