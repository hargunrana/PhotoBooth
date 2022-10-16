//------------------------- Connect to a Database -------------------------

let db;
let openRequest = indexedDB.open("myDatabase");

openRequest.addEventListener("success", () => {
    console.log("db connected");
    db = openRequest.result;
});

openRequest.addEventListener("upgradeneeded", () => {
    console.log("db upgraded or initialized DB");
    db = openRequest.result;

    db.createObjectStore("video", { keyPath: "id" });
    db.createObjectStore("image", { keyPath: "id" });
});

openRequest.addEventListener("error", () => {
    console.log("db error");
});

