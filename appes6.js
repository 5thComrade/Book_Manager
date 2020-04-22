class Book {
    constructor(title, author, pages) {
        this.title = title;
        this.author = author;
        this.pages = pages;
    }
}

class UI {
    addBookToList(book) {
        const result = document.querySelector('#result');
        let final = document.createElement('div');
        final.className = 'row';
        final.innerHTML = `
            <div class="col-4" id="result-book">
                <p class="pb-2">${book.title}</p>
            </div>
            <div class="col-4" id="result-author">
                <p class="pb-2">${book.author}</p>
            </div>
            <div class="col-4" id="result-pages">
                <p class="pb-2">${book.pages} <i class="fas fa-cut close"></i></p>
            </div>`;
        result.appendChild(final);
    }

    deleteBook(target) {
        if(target.classList.contains('close')) {
            target.parentElement.parentElement.parentElement.remove();
            this.showAlert('Book Removed Successfully', 'alert alert-success');
            Store.removeBook(target.parentElement.parentElement.previousElementSibling.previousElementSibling.textContent);
        }
    }

    clearFields() {
        document.querySelector('#book-title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#pages').value = '';
    }

    showAlert(message, alert_class) {
        const alert = document.querySelector('#alert');
        if(alert.childElementCount < 1 ) {
            const div = document.createElement('div');
            div.className = alert_class;
            div.appendChild(document.createTextNode(message));
            alert.appendChild(div);
            setTimeout(function(){
                alert.children[0].remove();
            }, 2000);
        }
    }
}

//Local Storage Class

class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books =JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks() {
        const books = Store.getBooks();
        books.forEach(function(book) {
            const ui = new UI;

            //Add book to UI
            ui.addBookToList(book);
        });
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(book_name) {
        const books = Store.getBooks();
        books.forEach(function(book, index) {
            if(book.title === book_name.trim()){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

//DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks());

//Event Listener for adding book

document.querySelector('#main-form').addEventListener('submit', function(e) {
    //Get Form Enteries
    const title = document.querySelector('#book-title').value;
    const author = document.querySelector('#author').value;
    const pages = document.querySelector('#pages').value;

    //Instantiate a book object
    const book = new Book(title, author, pages);
    
    //Instantiate UI
    const ui = new UI();

    //Validate
    if(title === '' || author === '' || pages === '') {
        //Error Alert
        ui.showAlert('Please fill in all the fields.', 'alert alert-danger');

    } else {
        //Add Book to list
        ui.addBookToList(book);

        //Add to local storage
        Store.addBook(book);

        //Show successful alert
        ui.showAlert('Book added successfully.', 'alert alert-success');

        //Clear Input Fields
        ui.clearFields();
    }

    e.preventDefault();
});

//Event Listener for Deleting books

document.querySelector('#result').addEventListener('click', function(e) {

    //Instantiate UI
    const ui = new UI();

    ui.deleteBook(e.target);
    
    e.preventDefault();
})