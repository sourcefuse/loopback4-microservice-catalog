import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {SNS} from 'aws-sdk';
import {
  SNSBindings,
  SNSMessage,
  SNSNotification,
  SNSSubscriberType,
} from 'loopback4-notifications/sns';
export class SnsProvider implements Provider<SNSNotification> {
  constructor(
    @inject(SNSBindings.Config, {
      optional: true,
    })
    private readonly snsConfig?: SNS.ClientConfiguration,
  ) {
    if (this.snsConfig) {
      this.snsService = new SNS(this.snsConfig);
    } else {
      throw new HttpErrors.PreconditionFailed('AWS_SNS_CONFIG_MISSING');
    }
  }
  snsService: SNS;
  value() {
    return {
      publish: async (message: SNSMessage) => {
        if (message.receiver.to.length === 0) {
          throw new HttpErrors.BadRequest('MESSAGE_RECIEVER_NOT_FOUND');
        }
        const publishes = message.receiver.to.map(receiver => {
          const msg: SNS.PublishInput = {
            Message: message.body,
            Subject: message.subject,
          };
          let randomPhoneNumber: string | undefined = '';
          const phoneNumbers = [
            process.env.ORIGINATION_NUMBER1,
            process.env.ORIGINATION_NUMBER2,
          ];
          randomPhoneNumber =
            phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)]; //NOSONAR
          if (message.options?.smsType && randomPhoneNumber) {
            msg.MessageAttributes = {
              'AWS.SNS.SMS.SMSType': {
                DataType: 'String',
                StringValue: message.options.smsType,
              },
              'AWS.MM.SMS.OriginationNumber': {
                // message attributes
                DataType: 'String',
                StringValue: randomPhoneNumber,
              },
            };
          }
          if (receiver.type === SNSSubscriberType.PhoneNumber) {
            msg.PhoneNumber = receiver.id;
          } else if (receiver.type === SNSSubscriberType.Topic) {
            msg.TopicArn = receiver.id;
          } else {
            // Do nothing
          }
          return this.snsService.publish(msg).promise();
        });
        await Promise.all(publishes);
      },
    };
  }
}
