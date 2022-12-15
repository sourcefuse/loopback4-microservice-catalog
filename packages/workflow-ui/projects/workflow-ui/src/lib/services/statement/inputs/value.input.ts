import {State, WorkflowListPrompt} from '../../../classes';
import {
  ConditionTypes,
  InputTypes,
  NotificationRecipientTypesEnum,
} from '../../../enum';
import {RecordOfAnyType} from '../../../types';

export class ValueInput extends WorkflowListPrompt {
  prefix: string | {state: string} = '';
  suffix = '';
  inputKey = 'value';
  listNameField = 'text';
  listValueField = 'value';
  placeholder = 'Value';

  isHidden = <S extends RecordOfAnyType>(state: State<S>) => {
    return (
      [
        NotificationRecipientTypesEnum.NotifyMe,
        NotificationRecipientTypesEnum.NotifyEveryoneOnProject,
        NotificationRecipientTypesEnum.NotifyProjectOwners,
      ].includes(state.get('emailTo')) ||
      state.get('condition') === ConditionTypes.Changes ||
      state.get('condition') === ConditionTypes.PastToday
    );
  };

  prevchange = <S extends RecordOfAnyType>(state: State<S>) => {
    state.remove('value');
    state.remove('valueName');
  };
  options = <S extends RecordOfAnyType>(state: State<S>) =>
    state.get('values') as [];
  typeFunction = <S extends RecordOfAnyType>(state: State<S>) =>
    state.get('valueInputType') as InputTypes;
}
