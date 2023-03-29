import Notiflix from 'notiflix';
import { fetchPictures } from './js/fetchPictures';
import { lightbox } from './js/gallery';

const searchBox = document.querySelector('.search-form');
const { searchQuery } = searchBox.elements;
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage; //Current page counter
let perPage = 40; //Page image limit
let maxHits; //Maximum images to fetch counter

loadMoreBtn.style.display = 'none';

//Main body of the application, fetching new images
const apiQuery = e => {
  e.preventDefault();
  query = searchQuery.value.trim();
  if (query === '') {
    return Notiflix.Notify.warning(`Please tell us what you are looking for!`);
  }
  currentPage = 1; //Start page counter
  maxHits = 0; //Reset counter after new query
  gallery.innerHTML = ''; //Clear gallery after query
  loadMoreBtn.style.display = 'none'; //Hide button after query

  fetchPictures(query, perPage, currentPage).then(pictures => {
    maxHits += pictures.hits.length; //Increments the counter with a new query
    if (!pictures.total) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (!pictures.totalHits) {
      return renderGallery(pictures.hits);
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

const changeCurrentPage = () => {
  currentPage++;
  fetchPictures(query, perPage, currentPage).then(pictures => {
    maxHits += pictures.hits.length;
    console.log(maxHits);
    console.log(currentPage);
    if (maxHits >= pictures.totalHits) {
      return Notiflix.Notify.warning(
        `We're sorry, but you've reached the end of search results.`
      );
    }
    renderGallery(pictures.hits);
  });
};
loadMoreBtn.addEventListener('click', changeCurrentPage);
