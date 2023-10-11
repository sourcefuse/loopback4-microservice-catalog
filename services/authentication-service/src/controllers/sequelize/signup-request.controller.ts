import { inject } from '@loopback/context'
import { AnyObject } from '@loopback/repository'
import { LocalUserProfileDto, PreSignupFn, UserSignupFn } from '../..'
import { SignUpBindings } from '../../providers'
import { SignupRequestController as JugglerSignupRequestController } from '../signup-request.controller'
export class SignupRequestController extends JugglerSignupRequestController {
  constructor(
    @inject(SignUpBindings.PRE_LOCAL_SIGNUP_PROVIDER)
    protected readonly preSignupFn: PreSignupFn<LocalUserProfileDto, AnyObject>,
    @inject(SignUpBindings.LOCAL_SIGNUP_PROVIDER)
    protected readonly userSignupFn: UserSignupFn<LocalUserProfileDto, AnyObject>,
  ) {super (preSignupFn,userSignupFn)}
  }
