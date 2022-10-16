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
    let galleryCont = document.querySelector(".gallery-cont");

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
            <div> 
            <img src = "${url}"/>
            </div>
            <div class = "delete">DELETE</div>
            <div class = "download">DOWNLOAD</div>
        `;

        // appending the imageElem to the gallery-cont
        galleryCont.appendChild(imageElem);
    });
};
