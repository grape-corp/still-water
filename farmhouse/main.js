const audio = document.getElementById("bg-music");
const playButton = document.getElementById("play-btn")
const pauseButton = document.getElementById("pause-btn")

// marquee scrolling now playing text
const nowPlaying = document.getElementById("now-playing")
const nowPlaying2 = document.getElementById("now-playing2")
const marqueeItems = document.querySelectorAll(".marquee-item");

// dropdown menu
const dropdown = document.getElementById("dropdown-music-player");
const dropdownBtn = document.getElementById("dropdown-btn");

// audio
const audioSource = audio.querySelector("source").src;
const audioName = audioSource.substring(audioSource.lastIndexOf("/") + 1).replace(".mp3", "")
const audioSources = {
    "html": "assets/sounds/HTMLSong.mp3",
    "moda": "assets/sounds/moda-crime-daughter.mp3",
}
const trackButtons = document.querySelectorAll(".track-btn");

playButton.addEventListener("click", () => {
        audio.play();
        nowPlaying.innerHTML = "now playing: " + audioName;
        nowPlaying2.innerHTML = "now playing: " + audioName;
        marqueeItems.forEach(item => {
            item.style.animationPlayState = "running";
        });
})
pauseButton.addEventListener("click", () => {
    audio.pause();

    marqueeItems.forEach(item => {
        item.style.animationPlayState = "paused";
    });
    
})

dropdownBtn.addEventListener("click", () => {
    console.log('dropdown clicked');
    console.log(dropdown);
    if (dropdown.style.display === "none" || dropdown.style.display === "") {
        dropdown.style.display = "flex";
        dropdownBtn.innerHTML= "/\\";
    } else {
        dropdown.style.display = "none";
        dropdownBtn.innerHTML= "\\/";
    }
}
);

trackButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const id = button.id;  // e.g. "html" or "moda"
        const newSrc = audioSources[id]; // get the corresponding source

        if (newSrc) {
            audio.querySelector("source").src = newSrc;
            audio.load();  // reload the new source
            audio.play();  // play it

            const audioName = newSrc.substring(newSrc.lastIndexOf("/") + 1).replace(".mp3", "");
            nowPlaying.innerHTML = "now playing: " + audioName;
            nowPlaying2.innerHTML = "now playing: " + audioName;

            marqueeItems.forEach(item => {
                item.style.animationPlayState = "running";
            });
            
        } else {
            console.warn("No audio source found for ID:", id);
        }
        dropdown.style.display = "none";
        dropdownBtn.innerHTML= "\\/";
    });
});