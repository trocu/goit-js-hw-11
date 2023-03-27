import Notiflix from 'notiflix';
import { fetchPictures } from './js/fetchPictures';
import { lightbox } from './js/gallery';

const searchBox = document.querySelector('.search-form');
const { searchQuery } = searchBox.elements;
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.style.display = 'none';

const apiQuery = e => {
  e.preventDefault();
  if (searchQuery.value === '') {
    return Notiflix.Notify.warning('Please tell us what we are looking for :)');
  }
  gallery.innerHTML = ''; //clear gallery after new fetch
  loadMoreBtn.style.display = 'none'; //hide button after new fetch
  fetchPictures(searchQuery.value, currentPage).then(pictures =>
    checkFetch(pictures)
  );
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

let currentPage = 1;
const changeCurrentPage = () => {
  currentPage++;
  fetchPictures(searchQuery.value, currentPage).then(pictures =>
    checkFetch(pictures)
  );
};
loadMoreBtn.addEventListener('click', changeCurrentPage);
