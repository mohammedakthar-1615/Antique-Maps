const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");
const centuryFilter = document.getElementById("centuryFilter");
const regionFilter = document.getElementById("regionFilter");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Initialize infinite scroller observation once
const appearOptions = { threshold: 0, rootMargin: "0px 0px -50px 0px" };
const appearOnScroll = new IntersectionObserver(function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, appearOptions);

function displayMaps(data) {
  grid.innerHTML = "";
  if (data.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text); opacity: 0.7;">No maps found matching your criteria.</div>`;
    return;
  }

  data.forEach(map => {
    grid.innerHTML += `
      <div class="card fade-in">
        <!-- Card Image with Gradient Overlay -->
        <a href="map-detail.html?id=${map.id}" class="card-img-wrapper">
          <img src="${map.image}" alt="${map.title}" loading="lazy">
          <div class="card-overlay" style="position: absolute; bottom: 0; left: 0; right: 0; padding: 20px; background: linear-gradient(transparent, rgba(26, 26, 36, 0.9)); pointer-events: none;">
            <span style="display: inline-block; background: var(--secondary); color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase;">${map.century}</span>
          </div>
        </a>
        
        <!-- Card Content -->
        <div class="card-content">
          <h3 style="font-size: 1.5rem; margin-bottom: 8px; line-height: 1.3;"><a href="map-detail.html?id=${map.id}">${map.title}</a></h3>
          
          <div class="card-meta" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--border);">
            <span class="card-meta-item" style="font-weight: 500;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              ${map.cartographer}
            </span>
            <span class="card-meta-item" style="opacity: 0.7; font-size: 0.9rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              ${map.region}
            </span>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto; margin-bottom: 25px;">
            <div class="price" style="font-size: 1.8rem; font-weight: 600; color: var(--secondary); margin: 0;">₹${map.price}</div>
          </div>
          
          <div class="card-actions">
            <a href="map-detail.html?id=${map.id}" class="btn btn-outline" style="padding: 14px 10px; text-align: center;">View Details</a>
            <button class="btn" onclick="addToCart(${map.id})" style="padding: 14px 10px;">Save to List</button>
          </div>
        </div>
      </div>
    `;
  });

  // Re-run intersection observer for new cards
  setTimeout(() => {
    const faders = document.querySelectorAll('.card.fade-in');
    faders.forEach(fader => appearOnScroll.observe(fader));
  }, 50);
}

function filterMaps() {
  let filtered = maps.filter(map => {
    return (
      (centuryFilter.value === "" || map.century === centuryFilter.value) &&
      (regionFilter.value === "" || map.region === regionFilter.value) &&
      (map.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        map.cartographer.toLowerCase().includes(searchInput.value.toLowerCase()))
    );
  });

  displayMaps(filtered);
}

function addToCart(id) {
  const item = maps.find(m => m.id === id);
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert('"' + item.title + '" added to your inquiry list!');
}

searchInput.addEventListener("input", filterMaps);
centuryFilter.addEventListener("change", filterMaps);
regionFilter.addEventListener("change", filterMaps);

displayMaps(maps);