import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
                                     
  private userID =  'PSgnrH3AiNJ69TrOO';
  private serviceID = 'service_0yyg3dk';
  private templateID = 'template_9a5cqgy';

  constructor() { emailjs.init(this.userID); }

  async enviandoEmail(nombreCliente:string,emailCliente:string,mensajeCliente:string){

    const templateParams = {
      to_name: nombreCliente,
      from_name: 'Sabor Criollo',
      message: mensajeCliente,
      to_email: emailCliente,
      from_email: 'saborcriollo486@gmail.com',
      reply_to: 'saborcriollo486@gmail.com',
    };
    return await this.sendEmail(templateParams);
  }

  sendEmail(templateParams: any): Promise<EmailJSResponseStatus> {
    return emailjs.send(this.serviceID, this.templateID, templateParams);
  }
}