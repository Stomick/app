import {SocialSharing} from '@ionic-native/social-sharing';
import {socialText} from './socialText';
import {Booking} from "../../models/Booking";
import {PDFGenerator} from "../PDFGenerator/PDFGenerator";
import {ElementRef} from "@angular/core";
import {messageType} from "tns-core-modules/trace";

export class SocialShare extends SocialSharing {

  constructor() {
    super();
  }

  public sendSuppotMail(user = null) {
    return this.shareViaEmail('Опишите свою проблему', user.name + ' ' + user.phone, [socialText.suppotEmail]);
  }

  public sendMailBooking(id: string, booking: Booking, node: ElementRef) {

    let pdf = new PDFGenerator();

    let title = `Подтверждение бронирования №${id}”Текст письма: детали бронирования`;
    let bookingInfo = `В спортивном центе ${booking.sportCenter}, по адресу ${booking.address},${booking.date.getDate()} ${booking.date.getMonth()} ${booking.date.getFullYear()}года. Стоимостью ${booking.playFieldPrice}`;


    return pdf.generateBase64PDF(booking, node).then((res) => {
      let options = {
        message: bookingInfo,
        subject: 'Бронирование',
        url: socialText.shareToFriend.hrefAppStore,
        chooserTitle: title,
        files: [res]
      };
      this.shareWithOptions(options);
    });
  }

  /**
   * Send sms with
   * @return {Promise<any>}
   */
  public pressButton(socialButton){
    switch (socialButton){
      case 'facebook':
        this.shareViaFacebookWithPasteMessageHint('Я арендовал спортивную площадку через Weev за два клика!',
          'https://ibb.co/fsFrUG', 'https://weev.ru' /* url */, '');
        window.console.log('facebook');
        break;
      case 'instagram':
        this.shareViaInstagram('Я арендовал спортивную площадку через Weev за два клика! #weev#спорт#бронирование', 'https://ibb.co/fsFrUG')
          .then(()=>{window.console.log('instagram')})
          .catch((error)=>{
            window.console.log(error);
          });
        break;
      case 'whatsapp':
        this.shareViaWhatsApp('Я арендовал спортивную площадку через Weev за два клика!', 'https://ibb.co/fsFrUG' /* img */, 'https://weev.ru' /* url */);
        window.console.log('whatsapp');
        break;
      case 'telegram':
        window.console.log('telegram');
        break;
      case 'vk':
        window.console.log('vk');
        break;
    }
  }
  public shareToFriend(date: Date) {

    let text =
      `${socialText.shareToFriend.message} ${date.getDate()}.${date.getMonth()}.${date.getFullYear()}.
       Присоединяйся. ${socialText.shareToFriend.hrefMarket}  ${socialText.shareToFriend.hrefAppStore}`;

    return this.shareViaSMS(text, null);
  }

  public inviteFriend() {
    let text = 'Я использую приложение Weev, бронируй вместе со мной';

    return this.shareViaSMS(text, null);
  }
}
