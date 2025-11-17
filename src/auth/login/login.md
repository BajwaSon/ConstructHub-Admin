# Login Screen Documentation

## Overview

The login screen serves as the entry point for users to access the school admin panel. It provides a secure authentication interface with email and password fields.

## Screen Components

### Brand Logo

- **Location**: Top center of the screen
- **Asset**: `images/neuronso-brand.svg`
- **Dimensions**: 178x100 pixels
- **Priority**: High (marked with priority attribute)

### Form Fields

1. **Email Field**

   - Label: "User Name"
   - Type: email
   - Placeholder: "saj@gmail.com"
   - Form Control: `form.controls.email`
   - ID: `auth.login.email`

2. **Password Field**
   - Label: "Password"
   - Type: password
   - Placeholder: "•••••••••••••"
   - Form Control: `form.controls.password`
   - ID: `auth.login.password`
   - Component: Custom password input (`app-input-password`)

### Additional Features

- **Forgot Password Link**

  - Text: "Forgot Password? Reset Here"
  - Action: Triggers `gotoForgetPassword()` method
  - Styling: Underlined text decoration

- **Sign In Button**
  - Type: submit
  - Width: 100%
  - Loading State: Shows spinner when `loginLoader.isLoading()` is true
  - Action: Triggers `login()` method

## Styling

- **Container**: Uses Bootstrap classes for responsive layout
- **Form**: Wrapped in `auth-bg-modal` class
- **Spacing**: Uses Bootstrap padding classes (py-3, py-4, pb-5)

## Technical Details

- **Framework**: Angular
- **Form Handling**: Reactive Forms
- **Components Used**:
  - `app-input`
  - `app-input-password`
- **State Management**: Uses loader service for button state

## Related Files

- Component: `src/auth/login/login.component.html`
- Associated TypeScript file: `src/auth/login/login.component.ts`
- Associated SCSS file: `src/auth/login/login.component.scss`

## Dependencies

- Angular Forms Module
- Bootstrap CSS
- Custom Components:
  - Input Component
  - Password Input Component

## Security Considerations

- Password field uses custom password input component
- Form validation should be implemented in the TypeScript component
- HTTPS should be enforced for the login endpoint

## Future Enhancements

- Add "Remember Me" checkbox
- Implement social login options
- Add password strength indicator
- Implement CAPTCHA for security
