import {Injectable} from '@angular/core';

const LENGTH = 5;
const BASE = 10;
@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  /**
   * It returns a random string of length LENGTH, where each character is a random number between 0 and
   * BASE
   * @returns A random number between 0 and 1, multiplied by the base to the power of the length.
   */
  uuid() {
    return String(Math.ceil(Math.random() * Math.pow(BASE, LENGTH)));
  }
}
