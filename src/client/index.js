import {getValues, setMinAndMaxDate} from './js/app'
document.addEventListener('DOMContentLoaded',setMinAndMaxDate);
document.querySelector('form').addEventListener('submit',getValues);

export{getValues}
