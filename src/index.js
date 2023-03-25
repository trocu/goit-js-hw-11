import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { fetchPictures } from './js/fetchPictures';

const searchBox = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const { searchQuery } = searchBox.elements;

const searchInput = e => {
  e.preventDefault();
  const searchValue = searchQuery.value;
  console.log(searchValue);
  //TODO Znalezc sposob, zeby przekazac wartosc pola input do fetcha
  console.log(fetchPictures(searchValue).then(data => console.log(data)));
};

searchBox.addEventListener('submit', searchInput);
