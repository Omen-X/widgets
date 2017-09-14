import './common/app.sass';

import Select from './elements/select';

// ========>> SELECT <<========

const select = new Select('#select', {});
// const select2 = new Select('#select2', {});

const btn = document.getElementById('getValue');
btn.addEventListener('click', () => {
  console.log(select.value);
});
