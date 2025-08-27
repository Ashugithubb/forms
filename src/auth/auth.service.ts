// import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService, ConfigType } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import { Response } from 'express';
// import { Request } from 'express';
// import { HasingService } from 'src/hasing/hasing.service';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { AuthJwtPayload } from './type/auth.payload';
// import { UserService } from 'src/user/user.service';


// @Injectable()
// export class AuthService {
//     constructor(private userService: UserService,
//         private hasingService: HasingService,
//         private jwtService: JwtService,
//         private configService: ConfigService,) { }
        
//     async validateUser({ email, password }: { email: string, password: string }) {
//         const user = await this.userService.findOneByEmail(email);
       
//         if (!user) throw new UnauthorizedException("User email not found");
//         const matched = await this.hasingService.compare(password, user.password);
//         if (!matched) throw new UnauthorizedException("Invalid password");
//         return { email: user.email, id: user.id };
//     }


//     async login(payload: AuthJwtPayload, res: Response) {

//         const token = await this.jwtService.sign(payload)
//         res.cookie('access_token', token, {
//             httpOnly: true,
//             secure: true,
//             sameSite: 'strict',
//             maxAge: 2 * 60 * 10000,
//         });
//         return {
//             "msg": "Loged In Successfully"
//         }
//     }

// }
import { HttpException, HttpStatus, Injectable, Req, UnauthorizedException } from '@nestjs/common';


import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
     if (!user) throw new UnauthorizedException("User email not found");
    
    const passwordMatch: boolean = await this.passworMatch(
      password,
      user.password,
    );
    if (!passwordMatch)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    return {
      id: user.id,
      email: user.email,
      name: user.firstName,
      
    };
  }

  async passworMatch(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async login(): Promise<any> {
    return {
      message: 'Login successful',
      statusCode: HttpStatus.OK,
    };
  }

  async logout(@Req() request): Promise<any> {
    request.session.destroy(() => {
      return {
        message: 'Logout successful',
        statusCode: HttpStatus.OK,
      };
    });
  }
}



