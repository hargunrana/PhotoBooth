var uid = new ShortUniqueId();
let video = document.querySelector("video");
let captureBtn = document.querySelector(".capture-btn");
let recordBtn = document.querySelector(".record-btn");

let recorder;
let chunks;
let constraints = {
    video: true,
    audio: false,
};

// ----------------------- Set up Camera Display --------------------------

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
        let galleryCont = document.querySelector(".gallery-images");
        galleryCont.innerHTML = ``;
        displayGallery();
    });
});

// -------------------------------- Mode Selection ---------------------
let optionsBtnArr = document.querySelector(".options").children;
let imageModeBtn = optionsBtnArr[0];
let videoModeBtn = optionsBtnArr[1];
let optionToggle = true;

imageModeBtn.addEventListener("click", switchMode);
videoModeBtn.addEventListener("click", switchMode);

function switchMode() {
    if (optionToggle == true) {
        videoModeBtn.classList.add("in-use");
        imageModeBtn.classList.remove("in-use");

        recordBtn.style.display = "flex";
        captureBtn.style.display = "none";
    } else {
        imageModeBtn.classList.add("in-use");
        videoModeBtn.classList.remove("in-use");
        recordBtn.style.display = "none";
        captureBtn.style.display = "flex";
    }
    optionToggle = !optionToggle;
}

// ---------------------------- Capture a Picture -------------------------------

captureBtn.addEventListener("click", () => {
    //Animation
    // captureBtn.classList.add("scale-capture");

    let canvas = document.createElement("canvas");

    let tool = canvas.getContext("2d");
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;

    tool.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Filters
    // tool.fillStyle = transparentColor;
    // tool.fillRect(0, 0, canvas.width, canvas.height);

    let imageURL = canvas.toDataURL();

    let image = document.createElement("img");
    image.src = imageURL;

    // document.body.append(image);

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

    let galleryCont = document.querySelector(".gallery-images");
    galleryCont.innerHTML = ``;
    displayGallery();

    // setTimeout(() => {
    //     captureBtn.classList.remove("scale-capture");
    // }, 250);
});

// ---------------------------- Record a Video -------------------------------

let shouldRecord = false;
recordBtn.addEventListener("click", () => {
    shouldRecord = !shouldRecord;
    if (shouldRecord) {
        // start recording
        recorder.start();

        //change button to stop
        // recordBtn.style.height = "1.5rem";
        // recordBtn.style.width = "1.5rem";
        // recordBtn.style.borderRadius = "10%";

        // start timer
        // startTimer();
    } else {
        //stop the recording
        recorder.stop();
        // galleryCont.innerHTML = ``;
        // displayGallery();

        //change button to round
        // recordBtn.style.height = "4rem";
        // recordBtn.style.width = "4rem";
        // recordBtn.style.borderRadius = "50%";

        //stop the timer
        // stopTimer();
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

// ----------------------GALLERY---------------------------------

function displayGallery() {
    setTimeout(() => {
        if (db) {
            // ------------------- Image DB ---------------------------

            // make the image transaction obj from db
            let imageDBTransaction = db.transaction("image", "readonly");

            // create image store object from the transaction
            let imageStore = imageDBTransaction.objectStore("image");

            // get all data from the imageStore
            let imageRequest = imageStore.getAll();

            imageRequest.onsuccess = () => {
                // receive all the image objects in imageResultArr
                let imageResultArr = imageRequest.result;

                // object of the gallery on the html
                let galleryCont = document.querySelector(".gallery-images");

                // for each loop on all objects of imageResultArr
                imageResultArr.forEach((imageObj) => {
                    // create image element
                    let imageElem = document.createElement("div");

                    // setting attributes
                    imageElem.setAttribute("class", "media");
                    imageElem.setAttribute("id", imageObj.id);

                    // creating url object to store imageObj url
                    let url = imageObj.url;

                    // adding Html code to the imageElem
                    imageElem.innerHTML = `
                    <img src = "${url}"/>
                    <div class="delete action-btn">x</div>
                    <div class="download">.</div>
                `;

                    // appending the imageElem to the gallery-cont
                    galleryCont.appendChild(imageElem);

                    // Action Buttons

                    let type = "i";
                    let deleteBtn = imageElem.querySelector(".delete");
                    deleteBtn.addEventListener("click", () => {
                        deleteListener(imageElem, type, imageObj.id);
                    });

                    let downloadBtn = imageElem.querySelector(".download");
                    downloadBtn.addEventListener("click", () => {
                        downloadListener(type, imageObj.id, url);
                    });
                });
            };
            // ------------------- Video DB ---------------------------

            let videoDBTransaction = db.transaction("video", "readonly");
            let videoStore = videoDBTransaction.objectStore("video");

            let videoRequest = videoStore.getAll();

            videoRequest.onsuccess = () => {
                let videoResultArr = videoRequest.result;
                let galleryCont = document.querySelector(".gallery-images");

                videoResultArr.forEach((videoObj) => {
                    let videoElem = document.createElement("div");

                    videoElem.setAttribute("class", "media");
                    videoElem.setAttribute("id", videoObj.id);
                    console.log(videoObj.blobData);
                    let url = URL.createObjectURL(videoObj.blobData);

                    videoElem.innerHTML = `
                    <video src = "${url}" autoplay/>
                    <div class="delete action-btn">x</div>
                    <div class="download">.</div>
                `;

                    galleryCont.appendChild(videoElem);

                    // Action Buttons

                    let type = "v";

                    let deleteBtn = videoElem.querySelector(".delete");
                    deleteBtn.addEventListener("click", () => {
                        deleteListener(videoElem, type, videoObj.id);
                    });

                    let downloadBtn = videoElem.querySelector(".download");
                    downloadBtn.addEventListener("click", () => {
                        downloadListener(type, videoObj.id, url);
                    });
                });
            };
        }
    }, 100);
}

displayGallery();

let deleteListener = function deleteListener(e, type, id) {
    if (type == "i") {
        let imageTransaction = db.transaction("image", "readwrite");
        let imageStore = imageTransaction.objectStore("image");
        imageStore.delete(id);
    } else {
        let videoTransaction = db.transaction("video", "readwrite");
        let videoStore = videoTransaction.objectStore("video");
        videoStore.delete(id);
    }

    e.remove();
};

let downloadListener = function (type, id, url) {
    let a = document.createElement("a");
    a.href = url;
    if (type == "i") {
        a.download = "Image-" + id + ".png";
    } else {
        a.download = "Video-" + id + ".mp4";
    }
    a.click();
};
