import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import {InvalidEntityError} from '../../errors';
import {InputTypes, NUMBER} from '../../enum';
import {
  AllowedValues,
  AllowedValuesMap,
  DateTime,
  Dropdown,
  RecordOfAnyType,
  Select,
} from '../../types/base.types';
import {State} from '../state';

const openDefaultKey = 'openDefault';
export abstract class WorkflowPrompt {
  abstract suffix?: string | {state: string};
  abstract prefix?: string | {state: string};
  abstract typeFunction: <S>(state: State<S>) => InputTypes;
  abstract inputKey: string;
  abstract placeholder: string;

  /* A function that is called before the value is changed. */
  prevchange?: <S extends RecordOfAnyType>(state: State<S>) => void;

  /**
   * "Get the value of the input key from the state."
   *
   * The first line of the function is the function signature. It says that the function takes a single
   * argument, state, which is of type State<S>. The <S> part is a generic type parameter. It means
   * that the function can take a State of any type
   * @param state - The state object that is passed to the reducer.
   * @returns The value of the inputKey in the state.
   */
  getValue<S extends RecordOfAnyType>(state: State<S>) {
    return state.get(this.inputKey);
  }

  /**
   * It takes in a state and a value and returns the value in the format that the state expects
   * @param state - State<S> - The state of the form.
   * @param {AllowedValues | AllowedValuesMap} value - The value that is being set.
   * @returns The value of the input field.
   */
  setValue<S extends RecordOfAnyType>(
    state: State<S>,
    value: AllowedValues | AllowedValuesMap,
  ) {
    switch (this.typeFunction(state)) {
      case InputTypes.List:
        return value;
      case InputTypes.People: {
        const ids: string[] = [];
        const _value: Array<Select> = [];
        let displayValue = '';
        if (Array.isArray(value)) {
          displayValue = value
            .map((item: Dropdown) => {
              if (item.id) {
                ids.push(item.id);
                _value.push({text: item.fullName, value: item.id});
              }
              return item.fullName;
            })
            .join(', ');
        } else {
          displayValue = (value as Dropdown).fullName;
          _value.push({
            text: (value as Dropdown).fullName,
            value: (value as Dropdown).id,
          });
          ids.push((value as Dropdown).id);
        }
        return {
          displayValue,
          ids,
          value: _value,
        };
      }
      case InputTypes.Date:
        const _date = `${this.onDateSelect(value as NgbDateStruct)}`;
        return moment(_date.toString(), 'DD-MM-YYYY').format('MMM DD, YYYY');
      case InputTypes.DateTime:
        const {date, time} = value as DateTime;
        const hours = this.convertToTwoDigits(time.hour);
        const min = this.convertToTwoDigits(time.minute);
        const dateTime = `${this.onDateSelect(date)} ${hours}:${min}`;
        return moment(dateTime.toString(), 'DD-MM-YYYY hh:mm').format(
          'MMM DD, YYYY hh:mm A',
        );
      case InputTypes.Email:
        (value as AllowedValuesMap).displayValue = 'email';
        return value;
      case InputTypes.Number:
      case InputTypes.Text:
      case InputTypes.Boolean:
      case InputTypes.Percentage:
      default:
        if (value) {
          return (value as HTMLInputElement).value;
        } else {
          throw new InvalidEntityError('Event');
        }
    }
  }

  /**
   * If the value is less than or equal to 9, add a 0 to the front of it, otherwise return the value
   * @param {number | null} value - number | null - The value to be converted to two digits.
   * @returns A string or a number.
   */
  private convertToTwoDigits(value: number | null): string | number {
    if (value) return value <= NUMBER.NINE ? '0' + value : value;
    return 0;
  }

  /**
   * It takes a date object, extracts the year, month and day, converts the month and day to two
   * digits, and returns a string in the format of day-month-year
   * @param {NgbDateStruct} date - NgbDateStruct - The date object that is passed to the function.
   * @returns A string in the format of dd-mm-yyyy
   */
  private onDateSelect(date: NgbDateStruct) {
    const year = date.year;
    const month = this.convertToTwoDigits(date.month);
    const day = this.convertToTwoDigits(date.day);
    return `${day}-${month}-${year}`;
  }

  /**
   * It returns the value of the input key, but if the input type is a list, people, or email, it
   * returns the display value instead
   * @param state - State<S> - The state of the form.
   * @returns The value of the inputKey in the state.
   */
  getValueName<S extends RecordOfAnyType>(state: State<S>) {
    switch (this.typeFunction(state)) {
      case InputTypes.List:
        if (typeof state.get(`${this.inputKey}Name`) === 'object') {
          return state.get(`${this.inputKey}Name`)?.displayValue;
        }
        return state.get(`${this.inputKey}Name`);
      case InputTypes.People:
        return state.get(`${this.inputKey}`)?.displayValue;
      case InputTypes.Email:
        return state.get(this.inputKey)?.displayValue;
      case InputTypes.Number:
      case InputTypes.Text:
      case InputTypes.Boolean:
      case InputTypes.Percentage:
      default:
        return state.get(this.inputKey);
    }
  }

  /**
   * It returns the value of the inputKey in the state, but if the inputKey is a list, it returns the
   * value of the list
   * @param state - State<S>
   * @returns The value of the inputKey in the state.
   */
  setValueName<S extends RecordOfAnyType>(state: State<S>) {
    switch (this.typeFunction(state)) {
      case InputTypes.List:
        if (
          typeof state.get(this.inputKey) === 'object' &&
          state.get(this.inputKey)?.value
        )
          return state.get(this.inputKey)?.value;
        return state.get(this.inputKey);
      case InputTypes.People: {
        return state.get(this.inputKey);
      }
      case InputTypes.Date: {
        return state.get(this.inputKey);
      }
      case InputTypes.DateTime: {
        return state.get(this.inputKey);
      }
      case InputTypes.Email:
        return state.get(this.inputKey);
      case InputTypes.Number:
      case InputTypes.Text:
      case InputTypes.Boolean:
      case InputTypes.Percentage:
      default:
        return state.get(this.inputKey);
    }
  }

  /**
   * It takes a state object and returns a value based on the type of input
   * @param state - State<S>
   * @returns The value of the inputKey in the state.
   */
  getModelValue<S extends RecordOfAnyType>(state: State<S>) {
    const DATE_TIME_FORMAT = `YYYY-MM-DD hh:mm`;
    switch (this.typeFunction(state)) {
      case InputTypes.People: {
        const value = state.get(this.inputKey)?.value;
        return value.map((val: AllowedValuesMap) => {
          val.fullName = val.text;
          val.id = val.value;
          return val;
        });
      }
      case InputTypes.Date: {
        const dateString = state.get(this.inputKey);
        return {
          month: moment(dateString).month() + 1,
          day: moment(dateString).date(),
          year: moment(dateString).year(),
        };
      }
      case InputTypes.DateTime: {
        const dateString = moment(state.get(this.inputKey))?.format(
          DATE_TIME_FORMAT,
        );
        return {
          date: {
            month: moment(dateString).month() + 1,
            day: moment(dateString).date(),
            year: moment(dateString).year(),
          },
          time: {
            hour: moment(dateString).hours(),
            minute: moment(dateString).minutes(),
          },
        };
      }
      case InputTypes.Email:
        return state.get(this.inputKey);
      default:
        return '';
    }
  }
}
