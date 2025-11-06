function zeroPad(num) {
  return num.toString().padStart(2, "0");
}
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}
function makePageForEpisodes(episodes) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = "";
  episodes.forEach((episode) => {
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
}

window.onload = setup;
