const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (localStorage.getItem("iduser") != "FjDLtAkzXTeJ3KnVfTSAKbddk7n1"){}else{
    const adminEmail = document.querySelector('#admin-email').value;
    const addAdminRole = functions.httpsCallable('addAdminRole');
    addAdminRole({ email: adminEmail }).then(result => {
        console.log(result);
    });
}
});


const removeadminForm = document.querySelector('.remove-admin-actions');
removeadminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (localStorage.getItem("iduser") != "FjDLtAkzXTeJ3KnVfTSAKbddk7n1"){}else{
    const removeadminEmail = document.querySelector('#remove-admin-email').value;
    const removeAdminRole = functions.httpsCallable('removeaddAdminRole');
    removeAdminRole({ email: removeadminEmail }).then(result => {
        console.log(result);
    });
}
});




if (localStorage.getItem("iduser") != "FjDLtAkzXTeJ3KnVfTSAKbddk7n1"){
    alert("Wow, chúc mừng bạn đã vào được đây.");
    alert("IP, UID của bạn đã được log lại!")
}

function getIP(json) {
    console.log("My public IP address is: ", json.ip);


    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    firebase.firestore().collection("AdminPanelAccessLog").doc(localStorage.getItem("iduser")).set({
    
        time: dateTime,
        uid: localStorage.getItem("iduser"),
        id: json.ip,
    }).then(() => {
        {

        }
    });
}

