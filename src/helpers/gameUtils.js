export const shuffle = (array) => {
    const _array = array.slice(0);
    for (let i = 0; i < array.length - 1; i++) {
        let randomIndex = Math.floor(Math.random() * (i + 1));

        // Swapping values
        let temp = _array[i];
        _array[i] = _array[randomIndex];
        _array[randomIndex] = temp;
    }

    return _array;
};


export const getRandomNumber = (min, max) => (
    Math.floor(
        Math.random() * (
            Math.floor(max) - Math.ceil(min) + 1
        ),
    ) + min
);
