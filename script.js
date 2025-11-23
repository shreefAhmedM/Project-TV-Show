function zeroPad(num) {
  return num.toString().padStart(2, "0");
}

function setup() {
  const state = {
    episodes: [],
    searchTerm: "",
  };
  return {
    async fetchAllEpisodes() {
      const rootElem = document.getElementById("root");
      rootElem.textContent = "Loading episodes, please waite..";

      try {
        const response = await fetch(
          "https://api.tvmaze.com/shows/82/episodes"
        );
        if (!response.ok) throw new Error("Episode data not available");

        state.episodes = await response.json();
        this.makePageForEpisodes();
      } catch (error) {
        rootElem.textContent = `Error loading episodes: ${error.message}`;
      }
    },
    makePageForEpisodes() {
      const rootElem = document.getElementById("root");
      rootElem.textContent = "";
      const filteredEpisodes = state.episodes.filter(
        ({ name, summary }) =>
          name.toLowerCase().includes(state.searchTerm) ||
          summary.toLowerCase().includes(state.searchTerm)
      );
      filteredEpisodes.forEach(({ name, season, number, image, summary }) => {
        const epiDiv = document.createElement("div");
        epiDiv.className = "epiCard";
        const episodeCode = `S${zeroPad(season)}E${zeroPad(number)}`;

        const titleElem = document.createElement("h2");
        titleElem.textContent = `${name} (${episodeCode})`;
        epiDiv.appendChild(titleElem);
        if (image && image.medium) {
          const imageElem = document.createElement("img");
          imageElem.src = image.medium;
          imageElem.alt = `${name} image`;
          epiDiv.appendChild(imageElem);

          const summaryElem = document.createElement("p");
          summaryElem.innerHTML = summary;
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
        state.searchTerm = searchInput.value.trim().toLowerCase();
        this.makePageForEpisodes();
      });

      searchDiv.appendChild(searchInput);

      const body = document.body;
      body.insertBefore(searchDiv, body.firstChild);
    },
    createShowSelect() {
      const showSelectDiv = document.createElement("div");
      showSelectDiv.className = "showSelect";

      const selectElem = document.createElement("select");
      selectElem.name = "showSelector";
      selectElem.id = "showSelector";

      const defaultOptionElem = document.createElement("option");
    },
  };
}

const tvShow = setup();

window.onload = () => {
  tvShow.fetchAllEpisodes();
  tvShow.makePageForEpisodes();
  tvShow.searchField();
};
