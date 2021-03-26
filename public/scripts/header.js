
$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
});

let seeAll = document.getElementById('countAll');
let mContacts = document.getElementById('maleContacts');
let fContacts = document.getElementById('femaleContacts');
headerurl = "http://localhost:3000/header"

fetch(headerurl)
.then(response => {
    if (response.ok) {
        return response;
    }
    throw Error(response.statusText);
})
.then(response => response.json())
.then(data => {
    seeAll.innerHTML = data.countAll;
    mContacts.innerHTML = data.maleContacts;
    fContacts.innerHTML = data.femaleContacts;
})