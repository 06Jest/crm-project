🧪 CRM Manual Testing Checklist

Dev test Use:

⬜ Not tested

✅ Passed

❌ Failed

⚠️ Needs review
  

Tester Use (add additional left beside marked):

+ ⬜ Not tested

+ ✅ Passed

+ ❌ Failed

+ ⚠️ Needs review


1. 🔐 Authentication

Sign up

✅ Create account with valid email/password

✅ Invalid email rejected

✅ Weak/invalid password rejected

✅ Empty fields rejected

✅ Duplicate email rejected

✅ Verification email is sent

✅ Unverified user cannot properly enter the application

✅ Verify email

✅ Verified user can sign in

Sign in

✅ Correct credentials → login succeeds

✅ Wrong password → rejected

✅ Nonexistent email → rejected

✅ Session cookies created

✅ /auth/me returns authenticated user

✅ Refresh page → user remains logged in

✅ Access token expiration → refresh works

✅ Invalid/expired refresh token → user is logged out/rejected

✅ Sign out → cookies/session removed

✅ After sign out, protected endpoints reject request

2. 👤 Onboarding

Profile

✅ First name

✅ Last name

✅ Job title/career

⚠️ Avatar

✅ Invalid input validation

✅ Profile saved

✅ Profile persists after refresh

Workspace

✅ Create personal workspace

✅ Create business workspace

✅ Workspace name validation

✅ Organization created

✅ Owner membership created

✅ Owner role correct

✅ Organization ID appears in refreshed JWT

✅ Member ID appears in refreshed JWT

Subscription

✅ Free plan creation

✅ Subscription associated with correct organization

✅ Correct billing cycle

✅ Duplicate subscription handled 

✅ Invalid subscription data rejected

✅ Onboarding completion becomes true

✅ Final session is refreshed

✅ User reaches dashboard

3. 🏠 Dashboard

✅ Dashboard loads

✅ Correct organization data

✅ Correct user/member information

✅ Statistics display correctly

✅ Charts load

✅ Week filter

✅ Month filter

✅ Quarter filter

✅ Year filter

✅ Empty-data state

✅ Loading state

✅ Error state

✅ Refresh does not duplicate requests

4. 👥 Leads

CRUD

✅ Create lead

✅ View lead

✅ Edit lead

✅ Delete lead

✅ Search lead

✅ Filter leads

✅ Sort leads

✅ Duplicate creation prevention

⬜ Pagination (not supported)

Lead fields

✅ Name

✅ Email

✅ Phone

✅ Company

✅ Status

✅ Source

✅ Notes

Pipeline

✅ Move lead between stages

✅ Invalid stage transition rejected

✅ Qualified lead requires required contact information

✅ Drag-and-drop persists after refresh

5. 📇 Contacts

✅ Create contact

✅ View contact

✅ Edit contact

✅ Delete contact

⬜ Search(not supported)

✅ Filter

✅ Sort 

✅ Pagination

✅ Status changes

✅ Contact details persist

✅ Duplicate creation prevention

✅ Lead → Contact conversion works

6. 💰 Deals

✅ Create deal

✅ View deal

✅ Edit deal

✅ Delete deal

✅ Amount

✅ Contact association

✅ Pipeline

✅ Stage

✅ Drag deal between stages

✅ Stage persists after refresh

✅ Invalid data rejected

✅ Deal statistics update

✅ Duplicate creation prevention

7. 🧑‍💼 Customers

✅ Create customer

✅ View customer

✅ Edit customer

✅ Delete customer

⬜ Search (not supported)

✅ Filter

✅ Status

✅ Contact/customer relationship correct

8. 📋 Activities

✅ Create activity

✅ View activity

⬜ Edit activity (not supported)

⬜ Delete activity (not supported)

✅ Activity associated with correct entity 

✅ Activity date/time correct

✅ Activity owner correct

✅ Completed activity

⬜ Pending activity (not supported)

✅ Activity survives refresh

9. 💬 Internal Chat

Conversations

✅ Create direct conversation

✅ Open conversation

✅ Send message

✅ Receive message

✅ Message ordering correct

✅ Empty message rejected

✅ Long message

✅ Delete conversation

✅ Conversation persists after refresh

Realtime

✅ Open two browser sessions

✅ Send message from browser A

✅ Browser B receives it

✅ Read status updates (needs refinement)

⬜ Unread count updates (not supported)

✅ Reconnect after connection interruption


10. 📧 Email

✅ Open email composer

✅ Enter recipient

✅ Subject

✅ Body

✅ Rich text formatting

✅ Send email

✅ Successful response (sent status)

⬜ Invalid recipient rejected (no domain yet)

✅ Empty subject/body handling

✅ Email status displayed correctly

✅ Failed email handled correctly

11. 📱 SMS

✅ Create SMS

✅ Correct recipient

✅ Message content

⬜ Queued (not supported, simulation)

⬜ Sending (not supported, simulation)

✅ Sent

⬜ Delivered (not supported, simulation)

⬜ Failed (not supported, simulation)

✅ Status updates correctly

✅ Message content cannot be improperly edited

12. 📞 Calls

✅ Start call

✅ Calling state

✅ Connected state

✅ End call

⬜ Missed call state (not supported, simulation)

✅ Call history

✅ Correct contact

✅ Call duration

✅ Activity recorded

✅ Notes while calling

✅ Outcome


15. ⚙️ Menu

Profile

✅ Change name

✅ Change job title

⬜ Change avatar

✅ Changes persist

Preferences

✅ Theme toggle

✅ Theme persists after refresh

Organization

✅ Organization name

✅ Organization type

✅ Industry

✅ Member count

⬜ Timezone (coming soon)

⬜ Currency (coming soon)

✅ Subscription information

Security

✅ Change password

✅ Correct current password required

✅ Wrong current password rejected

✅ New password validation

✅ Existing sessions handled correctly

✅ Login with new password

16. 👨‍👩‍👧 Team / Members

✅ Add member

✅ Generate invitation

✅ Invitation expires correctly

✅ Join organization

✅ Member appears

✅ Correct role

✅ Promote member

✅ Demote member

✅ Suspend member

✅ Suspended member cannot access organization ( but able to see)

⬜ Remove member ( coming soon)

✅ Owner cannot accidentally be removed

✅ Member cannot access another organization's data

17. 🔑 Roles & Permissions

Test each role:

Owner

Manager

Agent

For each role:

✅ Can view allowed resources

✅ Cannot view restricted resources

✅ Can create allowed resources

✅ Cannot create restricted resources

✅ Can edit allowed resources

✅ Cannot edit restricted resources

✅ Can delete allowed resources

✅ Cannot delete restricted resources

✅ Cannot modify another organization's data

✅ Cannot modify restricted member data

18. 🏢 Multi-Tenancy

Create:

Organization A → User A

Organization B → User B

Then test:

✅ A cannot see B's leads

✅ A cannot see B's contacts

✅ A cannot see B's deals

✅ A cannot see B's customers

✅ A cannot see B's activities

✅ A cannot see B's messages

✅ A cannot see B's members

✅ A cannot modify B's records

✅ A cannot delete B's records

✅ IDs cannot be exploited to access another organization

19. 🔄 Session / Token Testing

✅ Login

✅ Refresh browser

✅ Close browser

✅ Reopen browser

✅ Access token expires

✅ Refresh token works

✅ Refresh token rotates

✅ Old refresh token rejected

✅ Sign out

✅ Access protected endpoint after signout

✅ Multiple tabs

⬜ Multiple simultaneous requests

✅ Duplicate refresh requests

✅ Expired refresh token

✅ Invalid refresh token

20. 🛡️ Validation / Error Handling

✅ Missing required field

✅ Wrong data type

✅ Extremely long string

✅ Invalid UUID

✅ Invalid email

✅ Negative amount

✅ Duplicate record

✅ Nonexistent ID

✅ Deleted record

✅ Unauthorized request

✅ Forbidden request

✅ Server error

✅ Network failure

⬜ Double-click submit (application level)

⬜ Multiple rapid requests

21. 🐌 Request / Performance Checks

⬜ Clicking once → one request

⬜ Double clicking → doesn't create duplicates

⬜ Refresh → doesn't make unnecessary duplicate requests

⬜ Opening page → expected requests only

⬜ Switching tabs → expected requests

⬜ Pagination → one request

⬜ Search → doesn't spam backend

⬜ Failed request → doesn't create infinite retry loop

⬜ Token expiration → only one refresh operation when multiple requests fail

22. 🗑️ Deletion / Data Integrity

For each major entity:

Lead

Contact

Deal

Customer

Activity

Conversation

Member

Organization

Test:

✅ Delete

✅ Cancel deletion

✅ Deleted record disappears

✅ Related records behave correctly

✅ No orphan records

✅ Foreign keys behave correctly

✅ Soft deletion works where applicable

23. 📱 Responsive UI

Test at:

✅ Desktop

✅ Tablet

✅ Mobile width

Check:

✅ Sidebar

✅ Dashboard

✅ Tables

✅ Forms

✅ Dialogs

✅ Chat

✅ Navigation

✅ Buttons

✅ Text overflow

✅ Horizontal scrolling

24. 🎯 Final End-to-End Test

Pretend you're a completely new customer:

✅ Signup

✅ Verify email

✅ Login

✅ Profile

✅ Workspace

✅ Subscription

✅ Dashboard

✅ Create lead

✅ Convert/create contact

✅ Create deal

✅ Convert customer

✅ Add activity

✅ Send chat

✅ Send SMS

✅ Make call

✅ Send email

✅ Check dashboard

✅ Add team member

✅ Test permissions

✅ Logout

✅ Login again

✅ Verify everything still exists


⭐ Priority Tests If Short On Time

✅ Signup → verification → login

✅ Complete onboarding

✅ Token refresh / logout

✅ Create → edit → delete a Lead

✅ Lead → Contact → Deal → Customer flow

✅ Chat between two users

✅ Owner/Manager/Agent permissions

✅ Organization A cannot access Organization B

✅ Dashboard numbers match actual data

✅ Full fresh-user end-to-end flow


MANUALLY TESTED BY FOUNDER/FULL STACK DEV: JESTONY SILVANO✅
MANUALLY TESTED BY USER:
MANUALLY TESTED BY SENIOR DEV:
MANUALLY TESTED BY QA: