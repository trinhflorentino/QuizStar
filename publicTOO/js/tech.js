// console.log(firebase.auth().currentUser);
const auth = firebase.auth();
const userid = "ObJjzSUAiVR6q6IJGu6p7qqlVU63";

// console.log(auth.currentUser);
firebase.firestore().collection("hostUids").doc(userid).get().then(doc => {
    if (doc.exists) {
        console.log(doc.id, '=>', doc.data());
    } else {
        console.log("No such document!");
    }
}).catch(error => {
    console.error("Error getting documents: ", error);
});


// async function addHostUid(userId) {
//     try {
//         const expiredDate = Date.now() + (1000 * 60 * 60 * 24 * 365 * 100); 
//         await firebase.firestore()
//             .collection("hostUids")
//             .doc(userId)
//             .set({
//                 expiredDate: expiredDate,
//                 disabledDate: null
//             });
//         console.log(`Added host UID for user ${userId} with expiration date ${new Date(expiredDate)}`);
//         return true;
//     } catch (error) {
//         console.error("Error adding host UID: ", error);
//         throw error;
//     }
// }

// Usage example:
// addHostUid(userid)
//     .then(() => console.log("Host UID added successfully"))
//     .catch(error => console.error("Error:", error));