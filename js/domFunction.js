const books = []
const date = new Date()
const year = date.getFullYear()
const RENDER_EVENT = 'render-bookshelf'
const SAVE_EVENT = 'save-bookshelf'
const STORAGE_KEY = 'BOOKSHELF_APP'
const LOADED = 'DOMContentLoaded'
const addNewBookTitle = 'Add New Book'
const editBookTitle = 'Edit Book'
const defaultSubmitButtonFill = 'Add to Shelf <span id = "status">Belum selesai dibaca</span>'
const defaultEditButtonFill = 'Edit Book From Shelf <span id = "status">Selesai dibaca</span>'

function idGenerator() {
    return +new Date()
}

function bookDataObject(id, title, author, year, isComplete) {
    return {
        id, title, author, year, isComplete
    }
}

function findBook(id) {
    return books.find(data => data.id == id)
}

function findBookByTitle(title) {
    return books.filter(book=> book.title.toLowerCase().includes(title));
}

function validateInput(title, author, year) {
    return books.filter(book =>
        book.title == title
        && book.author == author
        && book.year == year
    )
}

function findBookIdx(id) {
    return books.findIndex(data => data.id == id)
}

function storageSupport() {
    if (!typeof (Storage)) {
        alert('Web Storage Not Supported')
        return false
    }

    return true
}

function saveData() {
    if (storageSupport()) {
        const parsed = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY, parsed)
        document.dispatchEvent(new Event(SAVE_EVENT))
    }
}

function loadDataFromStorage () {
    const serializeData = localStorage.getItem(STORAGE_KEY)
    let data = JSON.parse(serializeData)

    if (data !== null) {
        for (const book of data) {
            books.push(book)
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT))
}

function addBook() {
    var title = document.getElementById('inputBookTitle')
    var author = document.getElementById('inputBookAuthor')
    var bookYear = document.getElementById('inputBookYear')
    const isComplete = document.querySelector('#inputBookIsComplete')

    const id = idGenerator()
    const titlecontent = validateInput(title.value, author.value, bookYear.value)

    var state = true
    if (!titlecontent.length) {
        const bookData = bookDataObject(id, title.value, author.value, bookYear.value, isComplete.checked)

        books.push(bookData)

        title.value = ''
        author.value = ''
        bookYear.value = ''
        isComplete.checked = false

        saveData()
    } else {
        state = false
    }

    createToast(state, 'Add Book Success', `Add Book Failed Book <strong>${title.value}</strong> already exits`)
    document.dispatchEvent(new Event(RENDER_EVENT))
}

function editBooksObject() {
    var idBook = document.getElementById('inputBookId')
    var title = document.getElementById('inputBookTitle')
    var author = document.getElementById('inputBookAuthor')
    var bookYear = document.getElementById('inputBookYear')
    const isComplete = document.querySelector('#inputBookIsComplete')
    const submitForm = document.getElementById('inputBook')
    const submitButton = document.getElementById('bookSubmit')
    const Title = document.getElementById('input_form_title')
    const bookTarget = findBook(idBook.value)

    const state = true
    if (!bookTarget) {
        state = false
    } else {
        bookTarget.title = title.value
        bookTarget.author = author.value
        bookTarget.year = bookYear.value
        bookTarget.isComplete = isComplete.checked

        Title.innerText = addNewBookTitle
        submitButton.innerHTML = defaultSubmitButtonFill
    }
    submitForm.classList.replace('edit', 'submited')

    title.value = ''
    author.value = ''
    bookYear.value = ''
    isComplete.checked = false

    createToast(state, 'Update Book Complete', 'Update Book Failed')
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function editBook(id) {
    const submitForm = document.getElementById('inputBook')
    const submitButton = document.getElementById('bookSubmit')
    submitButton.innerHTML = defaultEditButtonFill
    submitForm.classList.replace('submited', 'edit')

    const Title = document.getElementById('input_form_title')
    Title.innerText = editBookTitle

    var idBook = document.getElementById('inputBookId')
    var title = document.getElementById('inputBookTitle')
    var author = document.getElementById('inputBookAuthor')
    var bookYear = document.getElementById('inputBookYear')
    const isComplete = document.querySelector('#inputBookIsComplete')

    const bookData = findBook(id)
    console.log(bookData)
    idBook.value = bookData.id
    title.value = bookData.title
    author.value = bookData.author
    bookYear.value = Number(bookData.year)
    isComplete.checked = bookData.isComplete



    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function makeBook(bookData) {
    const textTitle = document.createElement('h3')
    textTitle.innerText = bookData.title

    const author = document.createElement('a')
    author.className = 'author'
    author.innerText = ', Author By ' + bookData.author

    const year = document.createElement('a')
    year.className = 'year'
    year.innerText = 'Published ' + bookData.year


    const textContainer = document.createElement('article')
    year.append(author)
    const yearAuthorContainer = document.createElement('p')
    yearAuthorContainer.className = 'authoryear'
    yearAuthorContainer.append(year)
    textContainer.classList.add('book_item')
    textContainer.append(textTitle, yearAuthorContainer)

    const container = document.createElement('div')
    container.classList.add('book_item')
    container.append(textContainer)
    container.setAttribute('id', `book-${bookData.id}`)

    const actionContainer = document.createElement('div')
    actionContainer.classList.add('action')

    const trashButton = document.createElement('button')
    trashButton.classList.add('trash-button')

    trashButton.addEventListener('click', function () {
        removeTaskFromCompleted(bookData.id)
    })

    const updateButton = document.createElement('button')
    updateButton.classList.add('update-button')

    updateButton.addEventListener('click', function () {
        editBook(bookData.id)
    })

    if (bookData.isComplete) {
        const undoButton = document.createElement('button')
        undoButton.classList.add('undo-button')

        undoButton.addEventListener('click', function() {
            undoTaskFromCompleted(bookData.id)
        })

        actionContainer.append(trashButton, undoButton)
        container.append(actionContainer)
    } else {

        const checkButton = document.createElement('button')
        checkButton.classList.add('check-button')

        checkButton.addEventListener('click', function() {
            addTaskToCompleted(bookData.id)
        })

        actionContainer.append(trashButton, updateButton, checkButton)
        container.append(actionContainer)
    }

    return container
}

function addTaskToCompleted(id) {
    const bookTarget = findBook(id)

    const state = true
    if (!bookTarget) {
        state = false
    } else {
        bookTarget.isComplete = true
    }

    createToast(state, 'Read Book Completed', 'Failed add to Self')

    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function removeTaskFromCompleted(id) {
    const isDelete = window.confirm("Delete this Book");
    const bookTarget = findBookIdx(id)
    const state = true
    if (!isDelete) {
        return isDelete
    }
    if (bookTarget === -1) {
        state = false
    } else {
        books.splice(bookTarget, 1)
    }
    document.dispatchEvent(new Event(RENDER_EVENT))
    createToast(state, 'Delete Success', 'Delete Failed')
    saveData()
}

function undoTaskFromCompleted(id) {
    const bookTarget = findBook(id)

    const state = true
    if (!bookTarget) {
        state = false
    } else {
        bookTarget.isComplete = false
    }

    createToast(state, 'Undo Success', 'Undo Failed')
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function search() {
    const queryKey = document.getElementById('searchBookByTitle')
    const title = queryKey.value

    if (!title) {
        if (storageSupport()) {
            books.splice(0, books.length)
            loadDataFromStorage()
        }
        return
    }

    const bookList = findBookByTitle(title)

    var state = true
    if (!bookList.length) {
        state = false
        books.splice(0, books.length)
    } else {
        books.splice(0, books.length)
        books.push(...bookList)
    }
    document.dispatchEvent(new Event(RENDER_EVENT))
    createToast(state, 'Book Found', 'Book Not Found')
}

function createToast(isValid, message, failMessage) {
    var toast = document.getElementById('snackbar')
    var toastMessage = message || 'Save Success'

    if (!isValid) {
        var toastMessage = failMessage || 'Save Failed'
    }
    const Message = document.getElementById('message_toast')
    Message.innerHTML = ''
    Message.innerHTML = toastMessage
    toast.append(Message)
    toast.classList.replace('hidden', 'show')
    document.dispatchEvent(new Event(RENDER_EVENT))
    setTimeout(() => {
        toast.classList.replace('show', 'hidden')
        document.dispatchEvent(new Event(RENDER_EVENT))
    }, 3000);
}


function checkButton() {
    const span = document.querySelector("span");
    if (inputBookIsComplete.checked) {
        span.innerText = "Selesai dibaca";
    } else {
        span.innerText = "Belum selesai dibaca";
    }
}

function loadBook() {
    const noDataDialog = '<label>No Data</label>'
    const incompletedBookList = document.getElementById('incompleteBookshelfList')
    incompletedBookList.innerHTML = noDataDialog

    const completedBookList = document.getElementById('completeBookshelfList')
    completedBookList.innerHTML = noDataDialog

    if (books.length) {
        incompletedBookList.innerHTML = ''
        completedBookList.innerHTML = ''
    }
    for (const book of books) {
        const bookElement = makeBook(book)
        if (!book.isComplete) {
            incompletedBookList.append(bookElement)
        } else {
            completedBookList.append(bookElement)
        }
    }
}

function footer() {
    const footerYear = document.getElementById('footer-year')
    footerYear.innerText = year
}

function defaultYear() {
    const yearNow = document.getElementById('inputBookYear')

    if(!yearNow.value) {
        yearNow.value = year
    }
}