import Notiflix from 'notiflix';
import { fetchPictures } from './js/fetchPictures';
import { lightbox } from './js/gallery';

const searchBox = document.querySelector('.search-form');
const { searchQuery } = searchBox.elements;
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let maxHits = 0;
loadMoreBtn.style.display = 'none';

const apiQuery = e => {
  e.preventDefault();
  query = searchQuery.value.trim();
  if (query === '') {
    return Notiflix.Notify.warning(`Please tell us what you are looking for!`);
  }
  currentPage = 1;
  gallery.innerHTML = ''; //Clear gallery after new fetch
  loadMoreBtn.style.display = 'none'; //Hide button after new fetch
  fetchPictures(query, currentPage).then(pictures => {
    maxHits += pictures.hits.length;
    checkFetch(pictures);
  });
};
searchBox.addEventListener('submit', apiQuery);

const checkFetch = pictures => {
  if (!pictures.total) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  renderGallery(pictures.hits);
};

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
                <b>Likes</b>${likes}
                </p>
                <p class="info__item">
                <b>Views</b>${views}
                </p>
                <p class="info__item">
                <b>Comments</b>${comments}
                </p>
                <p class="info__item">
                <b>Downloads</b>${downloads}
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
  fetchPictures(query, currentPage).then(pictures => {
    maxHits += pictures.hits.length;
    console.log(maxHits);
    console.log(currentPage);
    if (maxHits >= pictures.totalHits) {
      return Notiflix.Notify.warning(
        `We're sorry, but you've reached the end of search results.`
      );
    }
    checkFetch(pictures);
  });
};
loadMoreBtn.addEventListener('click', changeCurrentPage);

//TODO Czy da sie ustawic dynamiczny per_page?
