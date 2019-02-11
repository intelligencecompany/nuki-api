## Synopsis

This package can be used with the NUKI Smartlock Web Api - https://api.nuki.io

```
npm install nuki-api
```


## Code Example
``` js
let nuki = require('nuki-api'),
    instance = new nuki();

instance.apiKey = 'xxxxxxxxxxxxxxxxxxxxx'

instance.getSmartLocks(true).then(function (smartlocks) {
    console.log(smartlocks);
});
```


## Motivation

This package was initially build to integrate the NUKI Smartlock with AirBnB, Booking.com, HomeAway and other internet calendars. Other relevant and compatible packages are:
1. [ical-booking](https://www.npmjs.com/package/ical-booking) 
2. [nuki-ical](https://www.npmjs.com/package/nuki-ical) (under construction) 


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
MIT License

Copyright (c) 2017 intelligencecompany

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
