// import { Injectable } from '@nestjs/common'

// @Injectable()
// export class AppService {
//   getHello(): string {
//     return 'Hello World. This is!!' ;
//   }
// }

export class AppService {
  getHello(): string {
    const message = 'Hello World from test!';
    return message;
  }

  // Adding a new method with poor formatting
  testLinting(): void {
    const x: any = 'test';
    console.log(x);
  }
}
