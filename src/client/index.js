import {getValues, setMinAndMaxDate,postData} from './js/app'
import './styles/header.scss'
import './styles/footer.scss'
import './styles/grid.scss'


document.addEventListener('DOMContentLoaded',setMinAndMaxDate);
document.querySelector('form').addEventListener('submit',getValues);

export{getValues,postData}
