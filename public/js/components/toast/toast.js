function successToast(message, duration, gravity, position, close, newWindow, destination) {
    Toastify({
        text: message,
        duration: duration,
        gravity: gravity,
        position: position,
        close: close,
        newWindow: newWindow,
        destination: destination,
        stopOnFocus: true,
        style: {
            background: "radial-gradient(circle at 74.2% 50.9%, rgb(14, 72, 222) 5.2%, rgb(3, 22, 65) 75.3%)",
            fontWeight: "500"
        },
        onClick: function () { } // Callback after click
    }).showToast();
}

function failToast(message, duration, gravity, position, close, newWindow, destination) {
    Toastify({
        text: message,
        duration: duration,
        gravity: gravity,
        position: position,
        close: close,
        newWindow: newWindow,
        destination: destination,
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
            fontWeight: "500"
        },
        onClick: function () { } // Callback after click
    }).showToast();
}