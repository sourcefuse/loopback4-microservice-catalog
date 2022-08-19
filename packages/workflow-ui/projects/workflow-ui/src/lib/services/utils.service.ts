import {Injectable} from '@angular/core';

const LENGTH = 5;
const BASE = 10;
@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  uuid() {
    return String(Math.ceil(Math.random() * Math.pow(BASE, LENGTH)));
  }
}
