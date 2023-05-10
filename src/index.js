import Notiflix from 'notiflix';
import axios from 'axios';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './index.css';

const inputEl = document.querySelector('[name="searchQuery"]');
const buttonSearch = document.querySelector('button[type="submit"]');
const buttonLoadMore = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');

let currentPage = 1;

const data = {
  key: '36096052-a8b4933efcb0d6eb229fce3f0',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: 40,
};

const { key, image_type, orientation, safesearch, lang, per_page } = data;

async function fetchImages(name, currentPage) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${key}&q=${name}&image_type=${image_type}&orientation=${orientation}&safe_search=${safesearch}&lang=${lang}&per_page=${per_page}&page=${currentPage}`
    );
    console.log(response);
    const images = response.data.hits;
    console.log(images);
    galleryEl.innerHTML = '';
    buttonLoadMore.classList.add('hidden');
    function showImages() {
      galleryEl.insertAdjacentHTML(
        'beforeend',
        images
          .map(
            el => `<div class="photo-card">
         <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy"/> 
         <div class="info">
         <p class="info-item">
         <b>Likes: ${el.likes}</b></p>
         <p class="info-item">
         <b>Views: ${el.views}</b></p>
         <p class="info-item">
         <b>Comments: ${el.comments}</b></p>
        <p class="info-item">
         <b>Downloads: ${el.downloads}</b></p></div></div>`
          )
          .join('')
      );

      Notiflix.Notify.info(
        `Hooray! We found ${response.data.totalHits} images.`
      );
    }

    if (images.length === 0 || inputEl.value === '') {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    showImages();
    buttonLoadMore.classList.remove('hidden');
    buttonLoadMore.classList.add('button-on');
    let quantity = Math.ceil(response.data.totalHits / per_page);
    if (currentPage === quantity) {
      buttonLoadMore.classList.add('hidden');
      buttonLoadMore.classList.remove('button-on');
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.error(error);
  }
}

buttonSearch.addEventListener('click', e => {
  e.preventDefault();
  currentPage = 1;
  fetchImages(inputEl.value.trim(), currentPage);
});

buttonLoadMore.addEventListener('click', e => {
  currentPage += 1;
  fetchImages(inputEl.value.trim(), currentPage);
});
