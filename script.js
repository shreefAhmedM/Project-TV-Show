//____Setup All Episodes___
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);

}


//___ Make Page For Episodes___
function makePageForEpisodes(episodeList) {
  episodeList.forEach(episode => {
  createEpisodeCard(episode,fortSeaEpicode(episode.season,episode.number));
  }
)}

//____Season and Episode Code ___
function fortSeaEpicode(season, episode){
  const formattedSeason = season.toString().padStart(2, "0");
  const formattedEpisode = episode.toString().padStart(2, "0");
  return `-S${formattedSeason}E${formattedEpisode}`;
}


// ___create Episode Card___
function createEpisodeCard(episode ,fortSeaEpicode){
  console.log(episode)
  const rootElem = document.getElementById("root");

// Create the card container
   const card = document.createElement("div");
   card.className = "card";
 
// Create the title
   const title = document.createElement("div");
   title.className = "card__title";
   const titleHeading = document.createElement("h3");
   titleHeading.innerHTML = `${episode.name}${fortSeaEpicode} `;
   title.appendChild(titleHeading);

  // Create the image container
   const imgContainer = document.createElement("div");
   imgContainer.className = "card__img";
   const img = document.createElement("img");
   img.src = episode.image.medium; 
   img.alt = episode.name;
   imgContainer.appendChild(img);

 // Create the body
   const body = document.createElement("div");
   body.className = "card__body";
   const bodyText = document.createElement("p");
   bodyText.innerHTML = episode.summary; 
   body.appendChild(bodyText);

//  Append all parts to the card
   card.appendChild(title);
   card.appendChild(imgContainer);
   card.appendChild(body);

// Append the card to the root element
   rootElem.appendChild(card);

}
window.onload = setup;
