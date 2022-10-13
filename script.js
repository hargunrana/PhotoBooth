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
        // let blob = new Blob(chunks, { type: "video/mp4" });
        //download video on desktop
        // store in database
    });
});

// ---------------------------- Capture a Picture -------------------------------

captureBtnCont.addEventListener("click", () => {
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
});

// ---------------------------- Record a Video -------------------------------

let shouldRecord = false;
recordBtnCont.addEventListener("click", () => {
    shouldRecord = !shouldRecord;
    if (shouldRecord) {
        // start recording
        recorder.start();

        // start timer
        startTimer();
    } else {
        //stop the recording
        recorder.stop();

        //stop the timer
        stopTimer();
    }
});
