import {InputTypes} from '../../enum';
import {RecordOfAnyType} from '../../types';
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
  getValueName<S extends RecordOfAnyType>(state: State<S>) {
    switch (this.typeFunction(state)) {
      case InputTypes.List:
        return state.get(`${this.inputKey}Name`);
      case InputTypes.Number:
      case InputTypes.Text:
      case InputTypes.Boolean:
      case InputTypes.Percentage:
      default:
        return state.get(this.inputKey);
    }
  }
}
