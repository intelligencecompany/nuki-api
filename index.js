const request = require('request'),
      models = require('./models');

var e = module.exports = {
    apiKey: '',
    accountUsers: [],
    smartLocks: [],
    models: models,
    
    setApiKey: function(key) {
        e.apiKey = key;
    },

    getAccountUsers: function (reload = false) {
        return new Promise(function (resolve, reject) {
            if(reload || e.accountUsers.length == 0) {
                var options = {
                    url: "https://api.nuki.io/account/user",
                    method: "GET",
                    headers: {
                        'User-Agent': 'none',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + e.apiKey
                    }
                };
                function callback(error, response, body) {
                    if(response.statusCode == 200) {
                        e.accountUsers = JSON.parse(body);
                        return resolve(e.accountUsers);
                    } else {
                        return reject(new Error(response.statusMessage));
                    }
                };
                
                request(options, callback);
            } else {
                return resolve(e.accountUsers);
            }
        });
    },
    getSmartLocks: function (reload = false) {
        return new Promise(function (resolve, reject) {
            if(reload || e.smartLocks.length == 0) {
                var options = {
                    url: "https://api.nuki.io/smartlock",
                    method: "GET",
                    headers: {
                        'User-Agent': 'none',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + e.apiKey
                    }
                };
                function callback(error, response, body) {
                    if(response.statusCode == 200) {
                        e.smartLocks = JSON.parse(body);
                        return resolve(e.smartLocks);
                    } else {
                        return reject(new Error(response.statusMessage));
                    }
                };
                
                request(options, callback);
            } else {
                return resolve(e.smartLocks);
            }
        });
    },
    getSmartLockUsers: function (smartlockId, reload = false) {
        return new Promise(function (resolve, reject) {
            var lock = e.smartLocks.filter(function (lock) {
                return lock.smartlockId == smartlockId;
            })[0];

            if(reload || lock.users == null) {
                var options = {
                    url: "https://api.nuki.io/smartlock/" + smartlockId + '/auth',
                    method: "GET",
                    headers: {
                        'User-Agent': 'none',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + e.apiKey
                    }
                };
                function callback(error, response, body) {
                    if(response.statusCode == 200) {
                        e.findSmartlockById(smartlockId).then(function (smartLock) {    
                            smartLock.users = JSON.parse(body);
                            return resolve(smartLock.users);
                        });
                    } else {
                        return reject(new Error(response.statusMessage));
                    }
                };
                
                request(options, callback);
            } else {
                return resolve(lock.users);
            }
        });
    },

    findAccountUserById: function (accountUserId) {
        return new Promise(function (resolve, reject) {
            if(e.accountUsers.length == 0) {
                e.getAccountUsers().then(function (users) {
                    return resolve(filterUsersById(accountUserId));
                }).catch(function (error) {
                    return reject(error);
                })
            } else {
                return resolve(filterUsersById(accountUserId));
            };
        });

        function filterUsersById(accountUserId) {
            var filteredUsers = e.accountUsers.filter(function (user) {
                return user.accountUserId == accountUserId;
            });
            if(filteredUsers.length > 0)
                return filteredUsers[0];
            return null;
        }
    },
    findAccountUserByName: function (name) {
        return new Promise(function (resolve, reject) {
            if(e.accountUsers.length == 0) {
                e.getAccountUsers().then(function (users) {
                    return resolve(filterUsersByName(name));
                }).catch(function (error) {
                    return reject(error);
                })
            } else {
                return resolve(filterUsersByName(name));
            };
        });

        function filterUsersByName(name) {
            var filteredUsers = e.accountUsers.filter(function (user) {
                return user.name == name;
            });
            if(filteredUsers.length > 0)
                return filteredUsers[0];
            return null;
        }
    },
    findSmartlockById: function (smartlockId) {
        return new Promise(function (resolve, reject) {
            if(e.smartLocks.length == 0) {
                e.getSmartLocks().then(function (locks) {
                    return resolve(filterLocksById(smartlockId));
                }).catch(function (error) {
                    return reject(error);
                })
            } else {
                return resolve(filterLocksById(smartlockId));
            };
        });

        function filterLocksById(smartlockId) {
            var filteredLocks = e.smartLocks.filter(function (lock) {
                return lock.smartlockId == smartlockId;
            });
            if(filteredLocks.length > 0)
                return filteredLocks[0];
            return null;
        }
    },
    findSmartlockByName: function (name) {
        return new Promise(function (resolve, reject) {
            if(e.smartLocks.length == 0) {
                e.getSmartLocks().then(function (locks) {
                    return resolve(filterLocksByName(name));
                }).catch(function (error) {
                    return reject(error);
                })
            } else {
                return resolve(filterLocksByName(name));
            };
        });

        function filterLocksByName(name) {
            var filteredLocks = e.smartLocks.filter(function (lock) {
                return lock.name == name;
            });
            if(filteredLocks.length > 0)
                return filteredLocks[0];
            return null;
        }
    },
    findAccountUserByAuthId: function(smartlockId, authId) {
        return new Promise(function (resolve, reject) {
            e.getSmartLockUsers(smartlockId).then(function (users) {
                var users = users.filter(function (user) {
                    return user.id == authId;
                });
                return resolve(users);
            }).catch(function (error) {
                return reject(error);
            });
        });
    },
    findAccountUserAuthByName: function(smartlockId, name) {
        return new Promise(function (resolve, reject) {
            e.getSmartLockUsers(smartlockId).then(function (users) {
                var users = users.filter(function (user) {
                    return user.name == name;
                });
                return resolve(users);
            }).catch(function (error) {
                return reject(error);
            });
        });
    },

    createNukiUser: function (accountUser) {
        return new Promise(function (resolve, reject) {
            e.findAccountUserByName(accountUser.name).then(function(result) {
                if(result == null) {
                    var body = JSON.stringify(accountUser);
                    var contentLength = Buffer.byteLength(body);
                    var options = {
                        url: "https://api.nuki.io/account/user",
                        method: "PUT",
                        headers: {
                            'User-Agent': 'none',
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Content-Length': contentLength,
                            'Authorization': 'Bearer ' + e.apiKey
                        },
                        body: body
                    };
                    function callback(error, response, body) {
                        if(response.statusCode == 204) {
                            e.getAccountUsers(true).then(function () {
                                return resolve(e.findAccountUserByName(accountUser.name));
                            });
                        } else {
                            return reject(new Error(response.statusMessage));
                        }
                    };
                    request(options, callback);
                } else {
                    return resolve(e.findAccountUserByName(accountUser.name));
                }
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    updateNukiUser: function (accountUserId, accountUser) {
        return new Promise(function (resolve, reject) {
            e.findAccountUserByName(accountUser.name).then(function(result) {
                if(result != null) {
                    var body = JSON.stringify(accountUser);
                    var contentLength = Buffer.byteLength(body);
                    var options = {
                        url: "https://api.nuki.io/account/user/" + accountUserId,
                        method: "POST",
                        headers: {
                            'User-Agent': 'none',
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Content-Length': contentLength,
                            'Authorization': 'Bearer ' + e.apiKey
                        },
                        body: body
                    };
                    function callback(error, response, body) {
                        if(response.statusCode == 204) {
                            e.getAccountUsers(true).then(function () {
                                return resolve(e.findAccountUserByName(accountUser.name));
                            });
                        } else {
                            return reject(new Error(response.statusMessage));
                        }
                    };
                    request(options, callback);
                } else {
                    e.createNukiUser(accountUser).then(function (result) {
                        return resolve(result);
                    }).catch(function(error) {
                        return reject(error);
                    });
                };
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    removeNukiUser: function (accountUserId) {
        return new Promise(function (resolve, reject) {
            e.findAccountUserById(accountUserId).then(function(result) {
                if(result != null) {
                    var options = {
                        url: "https://api.nuki.io/account/user/" + accountUserId,
                        method: "DELETE",
                        headers: {
                            'User-Agent': 'none',
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + e.apiKey
                        }
                    };
                    function callback(error, response, body) {
                        if(response.statusCode == 204) {
                            return resolve(true);
                        } else {
                            return reject(new Error(response.statusMessage));
                        }
                    };
                    request(options, callback);
                } else {
                    return resolve(true);
                }
            }).catch(function (error) {
                return reject(error);
            });
        });
    },

    grantAccess: function (smartlockId, smartlockAuth) {
        return new Promise(function (resolve, reject) {
            e.findAccountUserAuthByName(smartlockAuth.name).then(function(result) {
                if(result == null) {
                    var body = JSON.stringify(smartlockAuth);
                    var contentLength = Buffer.byteLength(body);
                    var options = {
                        url: "https://api.nuki.io/smartlock/" + smartlockId + "/auth",
                        method: "PUT",
                        headers: {
                            'User-Agent': 'none',
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Content-Length': contentLength,
                            'Authorization': 'Bearer ' + e.apiKey
                        },
                        body: body
                    };
                    function callback(error, response, body) {
                        if(response.statusCode == 204) {
                            e.getSmartLockUsers(smartlockId);
                            return resolve(true);
                        } else {
                            return reject(new Error(response.statusMessage));
                        }
                    };
                    request(options, callback);
                } else {
                    e.updateAccess(smartlockId, result.id, smartlockAuth).then(function (result) {
                        return resolve(result);
                    }).catch(function (error) {
                        return reject(error);
                    });
                };
            }).catch(function (error) {
                return reject(error);
            });
        });
    },
    updateAccess: function (smartlockId, authId, smartlockAuth) {
        return new Promise(function (resolve, reject) {
            var body = JSON.stringify(smartlockAuth);
            var contentLength = Buffer.byteLength(body);
            var options = {
                url: "https://api.nuki.io/smartlock/" + smartlockId + "/auth/" + authId,
                method: "POST",
                headers: {
                    'User-Agent': 'none',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Content-Length': contentLength,
                    'Authorization': 'Bearer ' + e.apiKey
                },
                body: body
            };
            function callback(error, response, body) {
                if(response.statusCode == 204) {
                    e.getSmartLockUsers(smartlockId);
                    return resolve(true);
                } else {
                    return reject(new Error(response.statusMessage));
                };
            };
            request(options, callback);
        });
    },
    revokeAccess: function (smartlockId, authId) {
        return new Promise(function (resolve, reject) {
            var options = {
                url: "https://api.nuki.io/smartlock/" + smartlockId + "/auth/" + authId,
                method: "DELETE",
                headers: {
                    'User-Agent': 'none',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + e.apiKey
                }
            };
            function callback(error, response, body) {
                if(response.statusCode == 204) {
                    e.getSmartLockUsers(smartlockId);
                    return resolve(true);
                } else {
                    return reject(new Error(response.statusMessage));
                }
            };
            request(options, callback);
        });
    },
    getLog: function (smartlockId = null) {
        return new Promise(function (resolve, reject) {
            var url = smartlockId != null ? "https://api.nuki.io/smartlock/log" : "https://api.nuki.io/smartlock/" + smartlockId + "log";

            var options = {
                url: url,
                method: "GET",
                headers: {
                    'User-Agent': 'none',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + e.apiKey
                }
            };
            function callback(error, response, body) {
                if(response.statusCode == 200) {
                    return resolve(JSON.parse(body));
                } else {
                    return reject(new Error(response.statusMessage));
                }
            };
            
            request(options, callback);
        });
    },
        setLock: function (smartlockId, action) {
            return new Promise(function (resolve, reject) {
                var url = "https://api.nuki.io/smartlock/" + smartlockId + "/action";

                var options = {
                    url: url,
                    method: "POST",
                    headers: {
                        'User-Agent': 'none',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + self.apiKey
                    },
					body: '{"action": ' + action + '}'
                };
                function callback(error, response, body) {
                    if(response.statusCode == 204) {
                        return resolve(true);
                    } else {
                        return reject(new Error(response.statusMessage));
                    }
                };
                
                request(options, callback);
            });
        }
};

return e;
