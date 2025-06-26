# Supabase Client-Side Invitation System

This guide explains how the user invitation system works using Supabase's client-side `signUp` method.

## How It Works

### 1. **Frontend Invitation Process**

When a user is invited:

1. **Supabase signUp with empty password**:

   ```javascript
   const { data, error } = await supabase.auth.signUp({
     email: fields.email,
     password: '', // Empty password - user will set it when they accept
     options: {
       data: {
         firstName: fields.firstName,
         lastName: fields.lastName,
         companyId: fields.companyId,
         roles: fields.roles,
         invited: true,
       },
       emailRedirectTo: `${window.location.origin}/auth/callback`,
     },
   });
   ```

2. **Save user to backend**: After successful Supabase invitation, save user data to your backend:
   ```javascript
   const response = await axiosInstance.post('/add/user', {
     ...fields,
     supabaseUserId: signUpData.user?.id,
     supabaseToken: session?.access_token,
   });
   ```

### 2. **User Acceptance Flow**

1. **User receives email** with invitation link from Supabase
2. **User clicks link** and is redirected to your app's auth callback
3. **User sets password** and completes registration
4. **Backend updates user status** from pending to active

### 3. **Backend Implementation**

Your backend endpoint `/add/user` should:

1. **Receive the invitation data**:

   ```json
   {
     "email": "user@example.com",
     "firstName": "John",
     "lastName": "Doe",
     "companyId": "company-uuid",
     "roles": [...],
     "supabaseUserId": "supabase-user-id",
     "supabaseToken": "access-token"
   }
   ```

2. **Save pending user** to your database:
   ```javascript
   const pendingUser = await db.users.create({
     email: email,
     firstName: firstName,
     lastName: lastName,
     companyId: companyId,
     roles: roles,
     supabaseUserId: supabaseUserId,
     status: 'pending',
     invitedBy: currentUserId,
     invitedAt: new Date(),
   });
   ```

### 4. **Auth Callback Handling**

When user accepts invitation, handle in your auth callback:

```javascript
// Check if this is an invitation
const userMetadata = session.user?.user_metadata;
const isInvited = userMetadata?.invited;

if (isInvited) {
  // Complete user registration
  const response = await completeUserRegistration({
    userId: session.user.id,
    firstName: userMetadata.firstName,
    lastName: userMetadata.lastName,
    companyId: userMetadata.companyId,
    roles: userMetadata.roles,
  });
}
```

## Key Benefits

- ✅ **Uses Supabase's built-in email system**
- ✅ **Secure invitation links**
- ✅ **User sets their own password**
- ✅ **Metadata preserved through invitation**
- ✅ **Works with your existing backend**

## Security Notes

- The empty password approach is safe because Supabase requires email confirmation
- Users must click the email link to activate their account
- All user data is stored in your backend database
- Supabase handles the email delivery and security

## Error Handling

Common scenarios to handle:

- Email already exists
- Invalid email format
- Network errors
- Backend save failures

The system gracefully handles these with proper error messages to users.
