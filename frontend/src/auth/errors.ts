import type { AuthError } from '@supabase/supabase-js'

/** Turns Supabase auth errors into short, safe messages for the user. */
export function friendlyAuthError(error: AuthError): string {
  switch (error.code) {
    case 'invalid_credentials':
      return 'Incorrect email or password.'
    case 'email_not_confirmed':
      return 'Please confirm your email first. Check your inbox for the link.'
    case 'weak_password':
      return 'That password is too weak. Use at least 8 characters.'
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return 'Too many attempts right now. Please wait a few minutes and try again.'
    case 'email_address_not_authorized':
      return 'This email address cannot receive messages from the app yet.'
    default:
      return 'Something went wrong. Please try again.'
  }
}