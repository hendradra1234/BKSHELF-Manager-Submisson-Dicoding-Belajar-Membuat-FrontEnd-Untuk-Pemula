document.addEventListener(LOADED, function () {
    const submitForm = document.getElementById('inputBook')

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault()
        if (submitForm.className === 'edit') {
            editBooksObject()
            return
        }
        addBook()
    })

    if (storageSupport()) {
        loadDataFromStorage()
    }
})

inputBookIsComplete.addEventListener("input", function (event) {
    event.preventDefault();
    checkButton();
});

searchBookByTitle.addEventListener('input', function (event) {
    event.preventDefault()
    search()
})


document.addEventListener(RENDER_EVENT, function () {
    loadBook()
    defaultYear()
    footer()
})
