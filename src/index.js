import Notiflix from 'notiflix';
import { lightbox } from './js/gallery';
import fetchPictures from './js/fetchPictures';

const searchBox = document.querySelector('.search-form');
const { searchQuery } = searchBox.elements;
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage; //Current page counter
let perPage = 40; //Page image limit
let hitsLimit; //Maximum images to fetch counter
let query;

loadMoreBtn.style.display = 'none';

//Main body of the application, fetching new images
const apiQuery = e => {
  e.preventDefault();
  query = searchQuery.value.trim();
  if (query === '') {
    return Notiflix.Notify.warning(`Please tell us what you are looking for!`);
  }
  currentPage = 1; //Start page counter
  hitsLimit = 0; //Reset counter after new query
  gallery.innerHTML = ''; //Clear gallery after query
  loadMoreBtn.style.display = 'none'; //Hide button after query
  loadMoreBtn.classList.remove(`is-inactive`);
  loadMoreBtn.classList.add(`load-more`);

  fetchPictures.restApi(query, perPage, currentPage).then(pictures => {
    hitsLimit += pictures.hits.length; //Increases the counter with a new query
    if (!pictures.total) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    Notiflix.Notify.success(`Hooray! We found ${pictures.totalHits} images.`);
    renderGallery(pictures.hits);
  });
};
searchBox.addEventListener('submit', apiQuery);

const renderGallery = pictures => {
  const markup = pictures
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
            <a href="${largeImageURL}">
                <img class="photo-card__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
            </a>
            <div class="info">
                <p class="info__item">
                <b>Likes</b><span class="info__item-lighter">${likes}</span>
                </p>
                <p class="info__item">
                <b>Views</b><span class="info__item-lighter">${views}</span>
                </p>
                <p class="info__item">
                <b>Comments</b><span class="info__item-lighter">${comments}</span>
                </p>
                <p class="info__item">
                <b>Downloads</b><span class="info__item-lighter">${downloads}</span>
                </p>
            </div>
        </div>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  loadMoreBtn.style.display = 'block';
  lightbox.refresh();
};

//Fetches additional images after clicking the 'load more' button
const changeCurrentPage = () => {
  currentPage++; //Increses page counter
  /*
  The counter increments after each page change, 
  if hits reaches limit, disable the button, else render gallery
  */
  fetchPictures.restApi(query, perPage, currentPage).then(pictures => {
    hitsLimit += pictures.hits.length;
    if (hitsLimit >= pictures.totalHits) {
      loadMoreBtn.classList.remove(`load-more`);
      loadMoreBtn.classList.add(`is-inactive`);
      Notiflix.Notify.warning(
        `We're sorry, but you've reached the end of search results.`
      );
    }
    renderGallery(pictures.hits);

    //Adds smooth scrolling
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
};
loadMoreBtn.addEventListener('click', changeCurrentPage);
