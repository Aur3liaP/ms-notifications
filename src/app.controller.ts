import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('GET_NOTIFICATION')
  getNotifs(){
	  return [
		  {id: 1, name:"", date : new Date()},
		  {id: 2, name:"", date : new Date()},
	  ]
  }

}
