import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  
  // // private userID =  'xAdCp5uPvIusNC5Zx';   //'YOUR_USER_ID';      // Reemplaza con tu User ID de EmailJS
  // // private serviceID = 'service_rpk6cu9';   //YOUR_SERVICE_ID';    // Reemplaza con tu Service ID de EmailJS
  // // private templateID = 'template_20txefk'; //'template_4pwo7kf'; //'YOUR_TEMPLATE_ID';  // Reemplaza con tu Template ID de EmailJS
  // private userID =  'u6rxu8yTbuWbOWqXU';   //'YOUR_USER_ID';      // Reemplaza con tu User ID de EmailJS
  // private serviceID = 'service_o1w8owe';   //YOUR_SERVICE_ID';    // Reemplaza con tu Service ID de EmailJS
  // // private serviceID = 'service_gwd6hcc';   //YOUR_SERVICE_ID';    // Reemplaza con tu Service ID de EmailJS
  // private templateID = 'template_eay9963'; //'template_4pwo7kf'; //'YOUR_TEMPLATE_ID';  // Reemplaza con tu Template ID de EmailJS

                                     
  private userID =  'PSgnrH3AiNJ69TrOO';//ok
  private serviceID = 'service_0yyg3dk'; //OK
  private templateID = 'template_9a5cqgy';//OK

  constructor() { emailjs.init(this.userID); }

  async enviandoEmail(nombreCliente:string,emailCliente:string,mensajeCliente:string){
    alert(emailCliente);
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