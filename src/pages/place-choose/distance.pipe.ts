import {Pipe, PipeTransform} from '@angular/core';
import {Place} from "../../models/place.model";

@Pipe({
  name: 'distanceKmPipe'
})

export class DistanceKmPipe implements PipeTransform {
  transform(value: number, args: any[]): string {
    return  value.toFixed(0);
  }
}


@Pipe({
  name: 'placeSortByDistance'
})
export class DistancePlaceSort implements PipeTransform {
  transform(places: Place[], args: any[]): Place[] {

    return places.sort((a, b) => {
      if (a.distance == null || b.distance == null) {
        return -1;
      }

      if (a.distance > b.distance) {
        return 1;
      }
      if (a.distance < b.distance) {
        return -1;
      }

      return 0;

    });
  }
}
