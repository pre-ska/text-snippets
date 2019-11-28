const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// onCall znači da je pozivam na frontendu
//data argument - nakakv payload, custom data... user email kojeg želim učiniti admino itd
//context argument - info o authenificiranom korisniku koji je učinio call
exports.addAdminRole = functions.https.onCall((data, context) => {
  // dali je request od admina
  if (context.auth.token.admin !== true) {
    return { error: "Only admins can add other admins, sucker" };
  }

  // prvo dohvatim usera po emailu tako da imam njegov UID (IZ AUTHA)
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then(user => {
      //tada po tom UID-u , dodam mu custom claim admin
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: true
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been made an admin`
      };
    })
    .catch(err => {
      return err;
    });
});
