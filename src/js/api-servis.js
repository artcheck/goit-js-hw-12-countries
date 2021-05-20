// lodash
import debounce from 'lodash.debounce';

// pnotify
import { error } from '@pnotify/core';
import * as PNotifyAnimate from '@pnotify/animate';
import { defaults } from '@pnotify/animate';
defaults.inClass = 'fadeInDown';
defaults.outClass = 'fadeOutUp';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';

// api-service
import API from './fetchCountries';

// refs
import getRefs from './get-refs';

// templates
import countrу from '../templates/countrу.hbs';
import countrisList from '../templates/countrisList.hbs';

const refs = getRefs();

refs.inputEl.addEventListener('input', debounce(onInput, 500));

function onInput(e) {
  const name = e.target.value.trim();

  if (name === '') {
    return;
  }

  API.fetchCountries(name)
    .then(data => {
      clearContainerEl();
      if (data.length > 10) {
        onFetchError(
          'Too many matches found. Please enter a more specific query!',
        );
      } else if (data.status === 404) {
        onFetchError(
          'No country has been found. Please enter a more specific query!',
        );
      } else if (data.length === 1) {
        renderCountryCard(data);
      } else {
        renderCountrisList(data);
      }
    })
    .catch(error => {
      onFetchError('You must enter query parameters!');
      console.log(error);
    });
}

function onFetchError(textError) {
  error({
    text: `${textError}`,
  });
}

function renderCountryCard(country) {
  const markup = countrу(country[0]);
  refs.containerEl.insertAdjacentHTML('beforeend', markup);
}
function renderCountrisList(countris) {
  const markup = countrisList(countris);
  refs.containerEl.insertAdjacentHTML('beforeend', markup);
}

function clearContainerEl() {
  refs.containerEl.innerHTML = '';
}
