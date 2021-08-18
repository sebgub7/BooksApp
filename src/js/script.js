/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';
  const select = {
    templateOf: {
      book: '#template-book',
    },
    book: {
      image: 'book__image',
      list: '.books-list',
    },
    filters: '.filters',
  };

  class BooksList {
    constructor() {
      this.initData();
      this.getElements();
      this.renderBooks(this.data);
      this.initActions();
      console.log('this', this);
    }

    initData() {
      this.data = dataSource.books;
    }

    getElements() {
      this.bookTemplate = Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML);
      this.options = {
        favoriteBooks: [],
        filters: [],
      };
      this.DOM = {
        bookContainer: document.querySelector(select.book.list),
        filtersForm: document.querySelector(select.filters),
      };
    }

    renderBooks(data) {
      for (let book of data) {
        book.ratingBackground = this.determineRatingBackground(book.rating);
        book.ratingWidth = this.determineWidth(book.rating);
        console.log('book.ratingBackground', book.ratingBackground);
        /* generate HTML code */
        const generatedHTML = this.bookTemplate(book);

        /* create DOM element from HTML code */
        book.element = utils.createDOMFromHTML(generatedHTML);

        /* find books container */
        const menuContainer = document.querySelector(select.book.list);

        /* insert DOM element into container */
        menuContainer.appendChild(book.element);
      }
    }

    initActions() {
      const thisBooksList = this;

      this.DOM.bookContainer.addEventListener('dblclick', function(event) {
        event.preventDefault;
        const element = event.target.offsetParent;

        if (element.classList.contains(select.book.image)) {
          element.classList.toggle('favorite');

          const bookId = element.getAttribute('data-id');
          if (!thisBooksList.options.favoriteBooks.includes(bookId)) {
            thisBooksList.options.favoriteBooks.push(bookId);
          } else {
            thisBooksList.options.favoriteBooks.splice(thisBooksList.options.favoriteBooks.indexOf(bookId), 1);
          }
        }
      });


      this.DOM.filtersForm.addEventListener('click', function(event) {

        const element = event.target;

        if (element.tagName == 'INPUT' && element.name == 'filter' && element.type == 'checkbox') {

          if (element.checked) {
            thisBooksList.options.filters.push(element.value);
          } else {

            thisBooksList.options.filters.splice(thisBooksList.options.filters.indexOf(element.value), 1);
          }

          thisBooksList.filterBooks();
        }
      });
    }

    filterBooks() {
      for (const bookId in this.data) {
        const book = this.data[bookId];

        const filteredElement = this.DOM.bookContainer.querySelector('.book__image[data-id="' + book.id + '"]');

        filteredElement.classList.remove('hidden');

        for (const detailName in book.details) {
          const detailValue = book.details[detailName];

          if (!detailValue && this.options.filters.includes(detailName)) {
            filteredElement.classList.add('hidden');
            break;
          }
        }
      }
    }

    determineRatingBackground(rating) {
      if (rating < 6) {
        return 'linear-gradient(to right,  #fefcea 0%, #f1da36 100%)';
      }
      if (rating > 6 && rating <= 8) {
        return 'linear-gradient(to right, #fff 0%,#ff0000 100%)';
      }
      if (rating > 8 && rating <= 9) {
        return 'linear-gradient(to right, #299a0b 0%, #299a0b 100%)';
      }
      if (rating > 9) {
        return 'linear-gradient(to right, #ff0084 0%,#ff0084 100%)';
      }
    }
    determineWidth(rating) {
      return Math.floor(rating * 10);
    }
  }
  new BooksList();
}
