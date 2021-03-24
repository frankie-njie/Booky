const contact = [];

let searchText = document.getElementById("searchText");
let matchdiv = document.getElementById("match-list");
let popupDiv = document.getElementById("popup");
let searchBtn = document.getElementById("search-btn");
let downloadAll = document.getElementById("downloadAll");


searchText.addEventListener("keyup", function(e) {
    const newUrl = "http://localhost:3000/search?q=" + searchText.value.toString();
    console.log(searchText.value);
    // const urlParams = {q: searchText.value}
    // console.log(urlParams);

    if (!searchText.value) {
        matchdiv.innerHTML = '';
        popupDiv.innerHTML = '';
        removelist();
        return
    }

    fetch(newUrl)
        .then(response => {
            matchdiv.innerHTML = '';
            if (response.ok) {
                return response;
            }
            throw Error(response.statusText);
        })
        .then(response => response.json())
        .then(data => {
            matchdiv.style.display = "block"
            data.forEach(element => {
                //console.log(element.fName);

                //Display of suggestion for the search
                let anchor = document.createElement("a")
                let newList = document.createElement('li');
                if (!element.fName) {
                    newList.textContent = "No Name" + ",   " + (element.email).toString();
                } else {
                    newList.textContent = (element.fName).toString() + ",   " + (element.email).toString();
                }

               newList.classList.add('list-item')
               anchor.classList.add('anchorlist')

                anchor.appendChild(newList)
                anchor.href = '#';
                anchor.id = element._id;
                matchdiv.appendChild(anchor);

                // event listener to display details for each suggestion
                anchor.addEventListener('click', ({ currentTarget }) => {
                    showpopup();
                    const htmlPopup = `<div class=popupitem>
                                <i id="close-form" class="fas fa-times fa-lg close-form"></i>
                                <h5>Email</h5>
                                <p>${element.email}</p>

                                <h5>First Name</h5>
                                <p>${element.fName}</p>

                                <h5>Last Name</h5>
                                <p>${element.lName}</p>

                                <h5>Phone Number</h5>
                                <p>${element.phoneNum}</p>
                                </div> `;

                    //if(element.fName )
                    popupDiv.innerHTML = htmlPopup;
                    let closeForm = document.getElementsByClassName("close-form");
                    closeForm[0].onclick  = () => {
                        popupDiv.style.visibility = "hidden"
                    };  
                });    
                // console.log("All your details",email, fName, lName);                  
            });
            //onsole.log(data)

        })
        .catch(error => console.log('There was an error:', error))

}, false);

downloadAll.addEventListener("click", function () {

    const downloadUrl =  "http://localhost:3000/download"
    fetch(downloadUrl)
    .then(response => {
        if (response.ok) {
            return response;
        }
        throw Error(response.statusText);
    })
    .then(async response => {
        let text = await response.text();
        download("contacts.csv", text);
    })
})

function download(filename, text){
    let element = document.createElement('a');
    element.setAttribute('href', `data:text/csv;charset=uft-8,` + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}


searchBtn.addEventListener("click", function() {
    console.log("you have hit the server");
    window.location.href ='/generalsearch';
}); 

// window.addEventListener('click', closepopup());     

function removelist (){
    matchdiv.style.display = "none"
}
function showpopup(){
    popupDiv.style.visibility = "visible"
}
// function closepopup({target}){
//     console.log("you are on the window");
//     popupDiv.style.visibility = "hidden"
// }
// $('document').ready(function() {
//     $("#input-b9").fileinput({
//         showPreview: false,
//         showUpload: false,
//         elErrorContainer: '#kartik-file-errors',
//         allowedFileExtensions: ["jpg", "png", "gif"],
//         uploadUrl: '/site/file-upload-single'
//     });
// });