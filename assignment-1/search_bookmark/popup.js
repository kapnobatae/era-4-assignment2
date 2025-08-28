document.getElementById('searchInput').addEventListener('input', function() {
  const query = this.value.trim().toLowerCase();
  const resultsList = document.getElementById('results');
  resultsList.innerHTML = '';
  if (!query) return;
  chrome.bookmarks.search(query, function(results) {
    if (results.length === 0) {
      resultsList.innerHTML = '<li>No bookmarks found.</li>';
      return;
    }
    results.forEach(function(bm) {
      if (bm.url) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${bm.url}" target="_blank">${bm.title}</a>`;
        resultsList.appendChild(li);
      }
    });
  });
});
