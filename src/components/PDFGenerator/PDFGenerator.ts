import jsPDF from 'jspdf';
import {Booking} from "../../models/Booking";
import {ElementRef} from "@angular/core";

export class PDFGenerator {
  constructor() {
  }

  public generateBase64PDF(booking: Booking, node: ElementRef) {
    let doc = new jsPDF('p', 'px', 'a4');
    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    doc.setProperties({
      'title': 'Бронирование',
      'subject': 'Ваше бронирование',
      'author': 'me',
      'keywords': 'pdf'
    });

    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    this.canvasAddBookInfo(canvas, booking);
    let canvasData = canvas.toDataURL('image/png');

    doc.addImage(canvasData, 'PNG', width/4 , 25, width/2, height/2, 'image', 'fast');
    console.log(width, height, 0);
    return Promise.resolve(doc.output('dataurlstring'));

    // return domtoimage.toJpeg(node.nativeElement).then((imgData) => {
    //   doc.addImage(imgData, 'JPEG', 10, 25);
    //   // console.log(doc.output('dataurlstring'));
    //   return doc.output('dataurlstring');
    // }).catch((err) => {
    //   console.log("Error in DomToImage", err);
    // });
  }

  private canvasAddBookInfo(canvas, booking: Booking) {
    let position = {x: 15, y: 50};

    if (canvas.getContext) {
      let ctx = canvas.getContext('2d');
      ctx.font = '32px serif';
      ctx.fillText(booking.sportCenter, position.x, position.y);
      position.y += 20;
      ctx.font = '16px serif';
      ctx.fillText(booking.address, position.x, position.y);
      position.y += 20;
      ctx.fillText(booking.date.toDateString(), position.x, position.y);
      position.y += 20;
      ctx.fillText(`Общая стоимость: ${booking.playFieldPrice}`, position.x, position.y);
      position.y += 20;
      ctx.fillText(`Номер бронирования: ${booking.id}`, position.x, position.y);
    }
  }
}
