import {Filter} from '@loopback/repository';
import {Message, Group, Thread, Meta, Attachment} from '../models';

type FilterTypes = Message | Group | Thread | Meta | Attachment;

export const repositoryHelper = {
  addFalseDeletedConditionInWhere(_filter: Filter<FilterTypes> | undefined) {
    if (!_filter) {
      _filter = {
        where: {
          deleted: false,
        },
      };
    } else if (!_filter.where) {
      _filter.where = {
        deleted: false,
      };
    } else {
      _filter.where = {
        ..._filter.where,
        deleted: false,
      };
    }
  },
  removeDeletedAttributeFromFilter(_filter: Filter<FilterTypes> | undefined) {
    if (!_filter) {
      _filter = {
        fields: {
          deleted: false,
        },
      };
    }
    if (!_filter.fields) {
      _filter.fields = {
        deleted: false,
      };
    } else {
      _filter.fields.deleted = false;
    }
  },
  addFalseDeletedConditionInInclude(_filter: Filter<FilterTypes> | undefined) {
    if (_filter?.include?.length) {
      _filter.include = _filter.include?.map(relation => {
        if (!relation.scope) {
          relation.scope = {
            where: {
              deleted: false,
            },
          };
        } else if (!relation.scope.where) {
          relation.scope.where = {
            deleted: false,
          };
        } else {
          relation.scope.where = {
            ...relation.scope.where,
            deleted: false,
          };
        }
        return relation;
      });
    }
  },
};
