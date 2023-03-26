import Notiflix from 'notiflix';
import { fetchPictures } from './js/fetchPictures';
import { lightbox } from './js/gallery';

const searchBox = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const { searchQuery } = searchBox.elements;

loadMoreBtn.style.display = 'none';

const searchInput = e => {
  e.preventDefault();
  const searchValue = searchQuery.value;
  console.log(
    fetchPictures(searchValue).then(pictures => console.log(pictures))
  );
  fetchPictures(searchValue).then(pictures => checkFetch(pictures));
};

searchBox.addEventListener('submit', searchInput);

const checkFetch = pictures => {
  if (!pictures.total) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  return renderGallery(pictures.hits);
};

const renderGallery = pictures => {
  const gallery = document.querySelector('.gallery');
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

  gallery.innerHTML = markup;
  loadMoreBtn.style.display = 'block';
  lightbox.refresh();
};

// let currentPage = 1;
// const showCurrentPage = () => {
//   currentPage++;
//   fetchPictures(currentPage);
// };
// loadMoreBtn.addEventListener('click', showCurrentPage);
