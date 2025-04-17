const setCookie = (name, value, days) => {
    const expires = days ? `expires=${new Date(Date.now() +
    days * 24 * 60 * 60 * 1000).toUTCString()};` : '';
    document.cookie = `${name}=${value}; ${expires}`;
    }

const getCookie = (cookieName) => {
    // Tách chuỗi thành một mảng các cặp name/value
    let cookieArray = document.cookie.split("; ");
    // Chuyển name/value từ dạng string thành object
    cookieArray = cookieArray.map(item => {
        item = item.split("=");
        return {
        name: item[0],
        value: item[1]
        };
    });
    // Lấy ra cookie đang cần tìm
    const cookie = cookieArray.find(item => {
        return item.name === cookieName;
    });
    return cookie ? cookie.value : null;
}

const deleteCookie = (cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
}