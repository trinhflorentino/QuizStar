const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
    return admin.auth().getUserByEmail(data.email).then(user => {
        return admin.auth().setCustomUserClaims(user.uid, {
            admin:true
        });
    }).then(() => {
        return {
            message: `Success! ${data.email} has been a admin`
        }
    }).catch(err => {
        return err;
    });
});


exports.removeaddAdminRole = functions.https.onCall((data, context) => {
    return admin.auth().getUserByEmail(data.email).then(user => {
        return admin.auth().setCustomUserClaims(user.uid, {
            admin:false
        });
    }).then(() => {
        return {
            message: `Success! ${data.email} has been removed`
        }
    }).catch(err => {
        return err;
    });
});

