## Synopsis

This package can be used with the NUKI Smartlock Web Api - https://api.nuki.io

## Code Example
``` js
var nuki = require('nuki-api')

nuki.apiKey = 'xxxxxxxxxxxxxxxxxxxxx'

nuki.getSmartLocks(true).then(function (smartlocks) {
    console.log(smartlogs);
});
```

## Motivation

This package was build to integrate the NUKI Smartlock with AirBnB, Booking.com, HomeAway and other internet calendars.

## API Reference

Get your API-key from https://web.nuki.io/nl/#/admin/web-api

Request                     | Parameters 
--------------------------- | -----------------------------------------------------------------------
setApiKey                   | (string) apiKey
getAccountUsers             | (bool) reload (optional)
getSmartLocks               | (bool) reload (optional)
getSmartLockUsers           | (int) smartlockId, (bool) reload (optional)
findAccountUserById         | (int) accountUserId
findAccountUserByName       | (string) name
findSmartlockById           | (int) smartlockId
findSmartlockByName         | (string) name
findAccountUserByAuthId     | (int) smartlockId, (int) authId
findAccountUserAuthByName   | (int) smartlockId, (string) name
createNukiUser              | (models.AccountUser) accountUser
updateNukiUser              | (int) accountUserId, (models.AccountUser) accountUser
removeNukiUser              | (int) accountUserId
grantAccess                 | (int) smartlockId, (models.SmartlockAuth) smartlockAuth
updateAccess                | (int) smartlockId, (int) authId, (models.SmartlockAuth) smartlockAuth
revokeAccess                | (int) smartlockId, (int) authId
getLog                      | (int) smartlockId (optional)

## Contributors

If you want to contribute or donate to the project, please contact me on gijs@intelligencecompany.net.

## License

A short snippet describing the license (MIT, Apache, etc.)
