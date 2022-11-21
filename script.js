var uid = new ShortUniqueId();
// var uid = 10;
let video = document.querySelector("video");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let transparentColor = "transparent";
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");

let recorder;
let chunks;
let constraints = {
    video: true,
    audio: false,
};
// ------------------------- Setup Camera Display -------------------------------

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;

    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start", () => {
        chunks = [];
    });

    recorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
    });

    recorder.addEventListener("stop", () => {
        // Convert video
        let blob = new Blob(chunks, { type: "video/mp4" });

        // store in database
        if (db) {
            let videoId = uid();
            let dbTransaction = db.transaction("video", "readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id: videoId,
                blobData: blob,
            };

            let addRequest = videoStore.add(videoEntry);
        }
    });
});

// ---------------------------- Capture a Picture -------------------------------

captureBtnCont.addEventListener("click", () => {
    //Animation
    captureBtn.classList.add("scale-capture");

    let canvas = document.createElement("canvas");

    let tool = canvas.getContext("2d");
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;

    tool.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Filters
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    let imageURL = canvas.toDataURL();

    let image = document.createElement("img");
    image.src = imageURL;

    document.body.append(image);

    // Storing in DB
    if (db) {
        let imageId = uid();
        let dbTransaction = db.transaction("image", "readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id: imageId,
            url: imageURL,
        };

        let addRequest = imageStore.add(imageEntry);
    }

    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    }, 250);
});

// ---------------------------- Record a Video -------------------------------

let shouldRecord = false;
recordBtnCont.addEventListener("click", () => {
    shouldRecord = !shouldRecord;
    if (shouldRecord) {
        // start recording
        recorder.start();

        //change button to stop
        recordBtn.style.height = "1.5rem";
        recordBtn.style.width = "1.5rem";
        recordBtn.style.borderRadius = "10%";

        // start timer
        startTimer();
    } else {
        //stop the recording
        recorder.stop();

        //change button to round
        recordBtn.style.height = "4rem";
        recordBtn.style.width = "4rem";
        recordBtn.style.borderRadius = "50%";

        //stop the timer
        stopTimer();
    }
});

// ------------------------------Timer---------------------------------

let timer = document.querySelector(".timer");
let counter = 0;
let timerID;

function startTimer() {
    // Changes on display
    timer.style.display = "block";
    timer.style.backgroundColor = "red";

    function displayTimer() {
        counter++;
        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600;

        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;

        let seconds = totalSeconds;

        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;
    }
    timerID = setInterval(displayTimer, 1000);
}

function stopTimer() {
    clearInterval(timerID);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
    timer.style.backgroundColor = "none";
}

// ------------------------------- Filters -----------------------------------

let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");

allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", () => {
        transparentColor =
            getComputedStyle(filterElem).getPropertyValue("background-color");

        filterLayer.style.backgroundColor = transparentColor;
    });
});
