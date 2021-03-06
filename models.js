var models = module.exports = {
    Weekdays: {
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 4,
        THURSDAY: 8,
        FRIDAY: 16,
        SATURDAY: 32,
        SUNDAY: 64
    },
    AccountUser: function (i) {
        return {
            email: i.email,
            name: i.name
        };
    },
    SmartlockAuth: function (i) 
    {
        return {
            accountUserId: i.accountUserId,
            name: i.name,
            remoteAllowed: i.remoteAllowed,
            allowedFromDate: i.allowedFromDate,
            allowedUntilDate: i.allowedUntilDate,
            allowedWeekDays: i.allowedWeekDays,
            allowedFromTime: i.allowedFromTime,
            allowedUntilTime: i.allowedUntilTime
        };
    }
}