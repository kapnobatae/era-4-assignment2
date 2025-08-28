if (!document.body.classList.contains('dark-mode-toggled')) {
  document.body.classList.add('dark-mode-toggled');
  document.body.style.background = '#181818';
  document.body.style.color = '#e0e0e0';
} else {
  document.body.classList.remove('dark-mode-toggled');
  document.body.style.background = '';
  document.body.style.color = '';
}
