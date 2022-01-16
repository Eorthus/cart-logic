const str = document.querySelector('.text');
str.innerHTML = str.innerHTML.replace(/\B\'|\'\B/g, "\"");

