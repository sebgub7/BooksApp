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
  }

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
      this.options = {};
      this.options.favoriteBooks = [];
      this.options.filters = [];
      this.DOM = {};
      this.DOM.bookContainer = document.querySelector(select.book.list);
      this.DOM.filtersForm = document.querySelector(select.filters);
    }

    renderBooks(data) {
      for (let book in data) {
        this.data[book].ratingBackground = this.determineRatingBackground(this.data[book].rating);
        this.data[book].ratingWidth = this.data[book].rating * 10;

        /* generate HTML code */
        const generatedHTML = this.bookTemplate(this.data[book]);

        /* create DOM element from HTML code */
        this.data[book].element = utils.createDOMFromHTML(generatedHTML);

        /* find books container */
        const menuContainer = document.querySelector(select.book.list);

        /* insert DOM element into container */
        menuContainer.appendChild(this.data[book].element);
      }
    }

    initActions() {
      const thisBooksList = this;

      this.DOM.bookContainer.addEventListener('dblclick', function(event) {
        event.preventDefault;
        const element = event.target.offsetParent;

        if (element.classList.contains(select.book.image)) { //dlaczego selektor '.book__image' daje false?
          element.classList.toggle('favorite');

          const bookId = element.getAttribute('data-id');
          if (!thisBooksList.options.favoriteBooks.includes(bookId)) {
            thisBooksList.options.favoriteBooks.push(bookId);
          } else {
            thisBooksList.options.favoriteBooks.splice(thisBooksList.options.favoriteBooks.indexOf(bookId), 1);
          }
        }
      })


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
      })
    }

    filterBooks() {
      for (const bookId in this.data) {
        const book = this.data[bookId];

        const filteredElement = this.DOM.bookContainer.querySelector('.book__image[data-id=\"' + book.id + '\"]');

        filteredElement.classList.remove('hidden');

        for (const detailName in book.details) {
          const detailValue = book.details[detailName];

          if (!detailValue && this.options.filters.includes(detailName)) {
            filteredElement.classList.add('hidden');
            break;
          };
        }
      }
    }

    determineRatingBackground(rating) {
      if (rating > 9) {
        this.options.ratingColorOne = 'ff0084';
        this.options.ratingColorTwo = 'ff0084';
      }

      if (rating <= 9) {
        this.options.ratingColorOne = '299a0b';
        this.options.ratingColorTwo = '299a0b';
      }

      if (rating <= 8) {
        this.options.ratingColorOne = 'b4df5b';
        this.options.ratingColorTwo = 'b4df5b';
      }

      if (rating < 6) {
        this.options.ratingColorOne = 'fefcea';
        this.options.ratingColorTwo = 'fefcea';
      }

      const ratingBackground = 'linear-gradient(to bottom, #' + this.options.ratingColorOne + ' 0%, #' + this.options.ratingColorTwo + ' 100%);';
      return ratingBackground;
    }

  }

  new BooksList();

}
