const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};

const getFromStorage = (key) => {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {};
};

const saveToStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const hidePreloader = () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.classList.add('hide');
        preloader.addEventListener('transitionend', () => preloader.remove());
    }, 1000);
};

export {fetchData, getFromStorage, saveToStorage, hidePreloader};