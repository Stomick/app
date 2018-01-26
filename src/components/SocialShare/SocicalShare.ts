import {SocialSharing} from '@ionic-native/social-sharing';
import {socialText} from './socialText';
import {Booking} from "../../models/Booking";
import {PDFGenerator} from "../PDFGenerator/PDFGenerator";
import {ElementRef} from "@angular/core";

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
        this.shareViaFacebookWithPasteMessageHint('Message via Facebook',
          null /* img */, null /* url */, 'Paste it dude!');
        window.console.log('facebook');
        break;
      case 'instagram':
        this.shareViaInstagram('Message via Instagram', 'https://www.google.nl/images/srpr/logo4w.png');
        window.console.log('instagram');
        break;
      case 'whatsapp':
        this.shareViaWhatsApp('Message via WhatsApp', null /* img */, null /* url */);
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
