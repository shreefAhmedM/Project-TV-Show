function zeroPad(num) {
  return num.toString().padStart(2, "0");
}

function setup() {
  const state = {
    shows: [],
    episodes: [],
    searchTerm: "",
  };
  return {
    async fetchAllShows() {
      const rootElem = document.getElementById("root");
      rootElem.textContent = "Shows are available, please choose a show...";
      try {
        const response = await fetch("https://api.tvmaze.com/shows");
        if (!response.ok) {
          throw new Error("Shows data not available");
        }
        const shows = await response.json();
        state.shows = shows.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
      } catch (error) {
        rootElem.textContent = `Error loading shows: ${error.message}`;
      }
    },
    async fetchAllEpisodes(showId) {
      const rootElem = document.getElementById("root");
      rootElem.textContent = "Loading episodes, please wait..";

      try {
        const response = await fetch(
          `https://api.tvmaze.com/shows/${showId}/episodes`
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
    createHeader() {
      const headerElem = document.createElement("header");
      const rootElem = document.getElementById("root");
      document.body.insertBefore(headerElem, rootElem);
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

      const header = document.querySelector("header");
      header.appendChild(searchDiv);
    },
    createShowSelect() {
      const showSelectDiv = document.createElement("div");
      showSelectDiv.className = "showSelect";

      const selectElem = document.createElement("select");
      selectElem.name = "showSelector";
      selectElem.id = "showSelector";

      const defaultOptionElem = document.createElement("option");
      defaultOptionElem.value = "";
      defaultOptionElem.textContent = "Select Show";

      selectElem.appendChild(defaultOptionElem);

      selectElem.addEventListener("change", async () => {
        const selectedShowId = selectElem.value;
        if (!selectElem.value) return;

        await this.fetchAllEpisodes(selectedShowId);
        this.makePageForEpisodes();
      });

      const header = document.querySelector("header");
      header.appendChild(selectElem);
    },
    populateShowSelect() {
      const showSelectElem = document.getElementById("showSelector");
      state.shows.forEach(({ id, name }) => {
        const showOpt = document.createElement("option");
        showOpt.value = id;
        showOpt.textContent = name;
        showSelectElem.appendChild(showOpt);
      });
    },
  };
}

const tvShow = setup();

window.onload = async () => {
  await tvShow.fetchAllShows();
  tvShow.createHeader();
  tvShow.createShowSelect();
  tvShow.populateShowSelect();
  tvShow.searchField();
};
