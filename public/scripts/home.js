const url = "http://localhost:3000/search";
const contact = [];

let searchText = document.getElementById("searchText");
let matchdiv = document.getElementById("match-list");
let popupDiv = document.getElementById("popup");
let searchBtn = document.getElementById("search-btn")

searchText.addEventListener("keypress", function(e) {
    const newUrl = "http://localhost:3000/search?q=" + searchText.value.toString();
    console.log(searchText.value);
    // const urlParams = {q: searchText.value}
    // console.log(urlParams);

    if (!searchText.value) {
        matchdiv.innerHTML = '';
        popupDiv.innerHTML = '';
        return
    }

    fetch(newUrl)
        .then(response => {
            matchdiv.innerHTML = 'Waiting for response...';
            if (response.ok) {
                return response;
            }
            throw Error(response.statusText);
        })
        .then(response => response.json())
        .then(data => {

            data.forEach(element => {
                console.log(element.fName);

                //Display of suggestion for the search
                let anchor = document.createElement("a")
                let newList = document.createElement('li');
                newList.textContent = (element.fName).toString() + ",  " + (element.email).toString();

                anchor.appendChild(newList)
                anchor.href = '#';
                anchor.id = element._id;
                matchdiv.appendChild(anchor);

                // event listener to display details for each suggestion
                anchor.addEventListener('click', ({ currentTarget }) => {
                    const htmlPopup = `<div class=popup>
                                d<img src="" alt="">
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
                    console.log(currentTarget.id)
                    console.log(popupDiv)
                });

                // console.log("All your details",email, fName, lName);
            });
            //onsole.log(data)

        })
        .catch(error => console.log('There was an error:', error))

}, false);

searchBtn.addEventListener("click", function() {
    console.log("you have hit the server");
    //location("http://localhost:3000/generalsearch");
});
