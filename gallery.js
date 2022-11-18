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
            let galleryCont = document.querySelector(".gallery");

            // for each loop on all objects of imageResultArr
            imageResultArr.forEach((imageObj) => {
                // create image element
                let imageElem = document.createElement("div");

                // setting attributes
                imageElem.setAttribute("class", "media-cont");
                imageElem.setAttribute("id", imageObj.id);

                // creating url object to store imageObj url
                let url = imageObj.url;

                // adding Html code to the imageElem
                imageElem.innerHTML = `
            <div class = "media"> 
            <img src = "${url}"/>
            </div>
            <div class = "delete action-btn">DELETE</div>
            <div class = "download action-btn">DOWNLOAD</div>
        `;

                // appending the imageElem to the gallery-cont
                galleryCont.appendChild(imageElem);
            });
        };
        // ------------------- Video DB ---------------------------

        let videoDBTransaction = db.transaction("video", "readonly");
        let videoStore = videoDBTransaction.objectStore("video");

        let videoRequest = videoStore.getAll();

        videoRequest.onsuccess = () => {
            let videoResultArr = videoRequest.result;
            let galleryCont = document.querySelector(".gallery ");

            videoResultArr.forEach((videoObj) => {
                let videoElem = document.createElement("div");

                videoElem.setAttribute("class", "media-cont");
                videoElem.setAttribute("id", videoObj.id);

                let url = videoObj.url;

                videoElem.innerHTML = `
                <div class = "media"> 
                <video src = "${url}"/>
                </div>
                <div class = "delete action-btn">DELETE</div>
                <div class = "download action-btn">DOWNLOAD</div>
        `;

                galleryCont.appendChild(videoElem);
            });
        };
    }
}, 100);

function deleteListener() {}

function downloadListener() {}
