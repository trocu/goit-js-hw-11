import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { fetchPictures } from './js/fetchPictures';

const searchBox = document.querySelector('.search-form');

console.log(
  fetchPictures('yellow flowers').then(pictures => console.log(pictures))
);
