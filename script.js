function zeroPad(num) {
  return num.toString().padStart(2, "0");
}

function setup() {
  const state = {
    episodes: [],
    searchTerm: "",
  };
  return {
    fetchAllEpisodes() {
      state.episodes = getAllEpisodes();
    },
    makePageForEpisodes() {
      const rootElem = document.getElementById("root");
      rootElem.textContent = "";
      const filteredEpisodes = state.episodes.filter((episode) =>
        episode.name.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
      filteredEpisodes.forEach((episode) => {
        const epiDiv = document.createElement("div");
        epiDiv.className = "epiCard";
        const episodeCode = `S${zeroPad(episode.season)}E${zeroPad(
          episode.number
        )}`;

        const titleElem = document.createElement("h2");
        titleElem.textContent = `${episode.name} (${episodeCode})`;
        epiDiv.appendChild(titleElem);
        if (episode.image && episode.image.medium) {
          const imageElem = document.createElement("img");
          imageElem.src = episode.image.medium;
          imageElem.alt = `${episode.name} image`;
          epiDiv.appendChild(imageElem);

          const summaryElem = document.createElement("p");
          summaryElem.innerHTML = episode.summary;
          epiDiv.appendChild(summaryElem);
          rootElem.appendChild(epiDiv);
        }
      });
    },
    searchField() {
      const searchDiv = document.createElement("div");
      searchDiv.className = "searchField";

      const searchInput = document.createElement("input");
      searchInput.type = "search";
      searchInput.id = "searchInput";
      searchInput.placeholder = "Search Term";

      searchInput.addEventListener("keyup", () => {
        state.searchTerm = searchInput.value;
        this.makePageForEpisodes();
      });

      searchDiv.appendChild(searchInput);

      const body = document.body;
      body.insertBefore(searchDiv, body.firstChild);
    },
  };
}

const tvShow = setup();

window.onload = () => {
  tvShow.fetchAllEpisodes();
  tvShow.makePageForEpisodes();
  tvShow.searchField();
};
