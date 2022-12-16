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

export abstract class WorkflowPrompt {
  abstract suffix?: string | {state: string};
  abstract prefix?: string | {state: string};
  abstract typeFunction: <S>(state: State<S>) => InputTypes;
  abstract inputKey: string;
  abstract placeholder: string;

  prevchange?: <S extends RecordOfAnyType>(state: State<S>) => void;
  getValue<S extends RecordOfAnyType>(state: State<S>) {
    return state.get(this.inputKey);
  }

  setValue<S extends RecordOfAnyType>(
    state: State<S>,
    value: AllowedValues | AllowedValuesMap,
  ) {
    switch (this.typeFunction(state)) {
      case InputTypes.List:
        // if (typeof value === 'object') {
        //   return (value as AllowedValuesMap).displayValue;
        // }
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
        return this.onDateSelect(value as NgbDateStruct);
      case InputTypes.DateTime:
        const {date, time} = value as DateTime;
        const hours = this.convertToTwoDigits(time.hour);
        const min = this.convertToTwoDigits(time.minute);
        const dateTime = `${this.onDateSelect(date)} ${hours}:${min}`;
        return moment(dateTime.toString(), 'DD-MM-YYYY hh:mm').format();
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

  private convertToTwoDigits(value: number | null): string | number {
    if (value) return value <= NUMBER.NINE ? '0' + value : value;
    return 0;
  }

  private onDateSelect(date: NgbDateStruct) {
    const year = date.year;
    const month = this.convertToTwoDigits(date.month);
    const day = this.convertToTwoDigits(date.day);
    return `${day}-${month}-${year}`;
  }

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
}
