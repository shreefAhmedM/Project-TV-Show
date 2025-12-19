let showsList = [];
let showsCache = null;
let episodesCache = {};
let currentShowId = null;
let allEpisodesList = [];
let currentShowSearchTerm = "";
let currentEpisodeSearchTerm = "";

const root = document.getElementById("root");
const backToShowsBtn = document.getElementById("back-to-shows");
const showSearchInput = document.getElementById("show-search-input");
const episodeControls = document.getElementById("episode-controls");
const seasonSelector = document.getElementById("season-selector");
const episodeSearchInput = document.getElementById("search-term-input");
const foundNumShowsHide = document.getElementById("foundNumShowsHide");
const filteringFor = document.getElementById("filteringFor");
const numbersOfEpisodes = document.getElementById("numbers-of-episodes");

window.onload = async function () {
  await fetchAndDisplayShows();
  showSearchInput.addEventListener("input", handleShowSearch);

  backToShowsBtn.addEventListener("click", () => {
    displayShowsListing(showsList);
  });
  episodeSearchInput.addEventListener("input", handleEpisodeSearch);
  seasonSelector.addEventListener("change", handleSeasonSelector);
};

async function fetchAndDisplayShows() {
  if (!showsCache) {
    const response = await fetch("https://api.tvmaze.com/shows");
    showsCache = await response.json();
  }
  showsList = showsCache;
  displayShowsListing(showsList);
}
function highlightText(text, searchTerm) {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

// Usage in show card rendering
summaryDiv.innerHTML = highlightText(show.summary || "", currentShowSearchTerm);

function displayShowsListing(shows) {
  currentShowId = null;
  filteringFor.style.display = "inline-block";
  foundNumShowsHide.style.display = "inline-block";
  backToShowsBtn.style.display = "none";
  episodeControls.style.display = "none";
  root.innerHTML = "";
  showSearchInput.style.display = "inline-block";

  shows.forEach((show) => {
    const card = createShowCard(show);
    root.appendChild(card);
  });
}

function createShowCard(show) {
  const card = document.createElement("div");
  card.className = "show-card";

  // Build the inner HTML first
  card.innerHTML = `<h2 class="showName">${show.name}</h2>
    <img src="${show.image ? show.image.medium : ""}"/>
    <div>${show.summary || ""}</div>
    <p><strong>Genres:</strong> ${show.genres?.join(", ") || "N/A"}</p>
    <p><strong>Status:</strong> ${show.status || "N/A"}</p>
    <p><strong>Rating:</strong> ${show.rating?.average ?? "N/A"}</p>
    <p><strong>Runtime:</strong> ${show.runtime ?? "N/A"} min</p>`;

  // Add click listener only to the <h2>
  const title = card.querySelector("h2.showName");
  title.style.cursor = "pointer";
  title.addEventListener("click", (e) => {
    e.stopPropagation();
    selectShow(show.id);
  });

  return card;
}

function handleShowSearch(e) {
  const foundNumShows = document.getElementById("foundNumShows");
  currentShowSearchTerm = e.target.value.trim().toLowerCase();
  const filtered = showsList.filter(
    (show) =>
      show.name.toLowerCase().includes(currentShowSearchTerm) ||
      (show.genres &&
        show.genres.some((genre) =>
          genre.toLowerCase().includes(currentShowSearchTerm)
        )) ||
      (show.summary &&
        show.summary.toLowerCase().includes(currentShowSearchTerm))
  );

  displayShowsListing(filtered);

  // Update the counter
  foundNumShows.textContent = currentShowSearchTerm
    ? `${filtered.length} `
    : `${showsList.length}`;
}

async function selectShow(showId) {
  currentShowId = showId;
  numbersOfEpisodes.style.display = "inline-block";
  filteringFor.style.display = "none";
  foundNumShowsHide.style.display = "none";
  showSearchInput.style.display = "none";
  backToShowsBtn.style.display = "inline-block";
  episodeControls.style.display = "flex";
  if (!episodesCache[showId]) {
    const res = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
    episodesCache[showId] = await res.json();
  }
  allEpisodesList = episodesCache[showId];
  episodeSearchInput.value = "";
  seasonSelector.value = "";
  makePageForEpisodes(allEpisodesList);
  populateSeasonSelector(allEpisodesList);
  updateMatchCount(allEpisodesList.length, allEpisodesList.length);
}

function makePageForEpisodes(episodes) {
  root.innerHTML = "";
  episodes.forEach((episode) => {
    root.appendChild(createEpisodeCard(episode));
  });
}

function createEpisodeCard(ep) {
  const card = document.createElement("div");
  card.className = "episode-card";
  card.innerHTML = `<h2>${ep.name}</h2>
    <h3>S${String(ep.season).padStart(2, "0")}E${String(ep.number).padStart(
    2,
    "0"
  )}</h3>
    <a href="${ep.url}" target="_blank"><img src="${
    ep.image ? ep.image.medium : ""
  }" alt="${ep.name}" /></a>
    <div>${ep.summary || ""}</div>`;
  return card;
}

function handleEpisodeSearch(e) {
  currentEpisodeSearchTerm = e.target.value.trim().toLowerCase();
  seasonSelector.value = "";
  var filtered = filterEpisodes(allEpisodesList, currentEpisodeSearchTerm);
  updateMatchCount(filtered.length, allEpisodesList.length);
  makePageForEpisodes(filtered);
}

function handleSeasonSelector(e) {
  episodeSearchInput.value = "";
  currentEpisodeSearchTerm = "";
  let val = e.target.value;
  if (!val) {
    makePageForEpisodes(allEpisodesList);
    updateMatchCount(allEpisodesList.length, allEpisodesList.length);
    return;
  }
  let filtered = allEpisodesList.filter((ep) => ep.season == val);
  makePageForEpisodes(filtered);
  updateMatchCount(filtered.length, allEpisodesList.length);
}

function filterEpisodes(list, searchTerm) {
  if (!searchTerm) return list;
  return list.filter(
    (ep) =>
      ep.name.toLowerCase().includes(searchTerm) ||
      (ep.summary && ep.summary.toLowerCase().includes(searchTerm))
  );
}

function populateSeasonSelector(eps) {
  seasonSelector.innerHTML = '<option value="">All Seasons</option>';
  [...new Set(eps.map((ep) => ep.season))].forEach((season) => {
    let opt = document.createElement("option");
    opt.value = season;
    opt.textContent = `Season ${season}`;
    seasonSelector.appendChild(opt);
  });
}

function updateMatchCount(filtered, total) {
  numbersOfEpisodes.textContent = `${filtered}/${total}`;
}
