import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../../firebase-admin-credentials.json';
@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  constructor() {
    super();
    //initialise app with custom credentials from service json file
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  //call verify every time an endpoint is marked mit @useGuard(AuthGuard)
  async validate(req: Request): Promise<admin.auth.DecodedIdToken> {
    let token: string = req.headers['authorization'];
    if (!token) throw new UnauthorizedException();
    token = token.replace('Bearer ', '');
    //get the decoded token from firebase api
    const decodedToken = await admin
      .auth()
      .verifyIdToken(token)
      .catch(() => {
        //thow error if user not validated / not found / not signed up
        throw new UnauthorizedException();
      });
    return decodedToken;
  }
}
