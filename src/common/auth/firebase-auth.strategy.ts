import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../../firebase-admin-credentials.json';
@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  constructor(
    @Inject('FIREBASE_ADMIN')
    private admin: any,
  ) {
    super();
    /*
    //initialise app with custom credentials from service json file
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    */
  }

  //call verify every time an endpoint is marked with @useGuard(AuthGuard)
  async validate(req: Request): Promise<admin.auth.DecodedIdToken> {
    let token: string =
      req.headers['authorization'] ?? req.headers['Authorization'];
    if (!token) throw new UnauthorizedException();
    token = token.replace('Bearer ', '');
    //get the decoded token from firebase api
    const decodedToken = await this.admin
      .auth()
      .verifyIdToken(token)
      .catch(() => {
        //thow error if user not validated / not found / not signed up
        throw new UnauthorizedException();
      });
    return decodedToken;
  }
}
