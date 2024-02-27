import {AnyObject} from '@loopback/repository';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Joi from 'joi';
import {IngestReportRecord} from '../interfaces';

// Schema for CDC
const CDCSchema = Joi.object({
  operation: Joi.string().valid('INSERT', 'UPDATE', 'DELETE').required(),

  currentValue: Joi.object().pattern(Joi.string(), Joi.any()).required(),
});

// Schema for PermissionModel
const PermissionModelSchema = Joi.object({
  userIds: Joi.array().items(Joi.string()).required(),
  userGroups: Joi.array().items(Joi.string()).optional(),
  roles: Joi.array().items(Joi.string()).optional(),
  recordId: Joi.string().required(),
  recordType: Joi.string().required(),
  accessType: Joi.string().valid('read').required(),
});

// Schema for IngestReportRecord
const IngestReportRecordSchema = Joi.object({
  recordType: Joi.string().required(),
  recordId: Joi.string().required(),
  timestamp: Joi.date().iso().required(),
  cdc: CDCSchema,
  permission: PermissionModelSchema.optional(),
});

export const validateIngestReportRecord = (
  data: AnyObject,
): IngestReportRecord => {
  const {error, value} = IngestReportRecordSchema.validate(data);
  if (error) {
    throw new Error(
      `The supplied payload does not match IngestReportRecord: ${error.message}`,
    );
  }
  return value;
};
