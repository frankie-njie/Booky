var currentPageNumber = 1
$("document").ready(function() {
    $("#ageRangeCheckBox").change(function() {
        if (this.checked) {
            $("#slider").slider("option", "disabled", false);
        } else {
            $("#slider").slider("option", "disabled", true);
        }
    })
    $('input[name ="gender"]').change(function() {
        currentPageNumber = 1
        performSearch()
    })
    $("#slider").slider({
        range: true,
        min: 0,
        max: 100,
        values: [10,25],
        disabled: true,
        change: function(event, ui) {
            $("#minAge").html(ui.values[0])
            $("#maxAge").html(ui.values[1])
            performSearch()
        }
    });

    //$("#slider").slider("option", "values", [10, 25]);

    $("#filterBtn").click(function() {
        performSearch()
    })

    $("#pageNumber").change(function(){
        currentPageNumber = this.value
        performSearch()
    })

    let total = $("#pagination-total").text()
    totalPages = Math.ceil(total / 10)
    let from = ((currentPageNumber -1) * 10) + 1
    let paginationFootNote = `Displaying ${from} to ${(from + 9)} of ${total}`
    $("#pagination-footnote").text(paginationFootNote)

    $("#firstPage").click(function(){
        currentPageNumber = 1
        $("#pageNumber").val(1)
        $("#pageNumber").change()

    })
    $("#previousPage").click(function(){
        if (currentPageNumber > 1) {
            currentPageNumber--
        }
        $("#pageNumber").val(currentPageNumber)
        $("#pageNumber").change()

    })
    $("#nextPage").click(function(){
        if (currentPageNumber < totalPages){
            currentPageNumber++
        }
        $("#pageNumber").val(currentPageNumber)
        $("#pageNumber").change()

    })
    $("#lastPage").click(function(){
        currentPageNumber = totalPages
        $("#pageNumber").val(currentPageNumber)
        $("#pageNumber").change()
    })

})

const url = "http://localhost:3000/searchAll";

// console.log(contact);
let filterText = document.getElementById("filterText");
let male = document.getElementById("maleCheckbox");
let female = document.getElementById("femaleCheckbox");
let ageRange = document.getElementById("ageRange");
let filterBtn = document.getElementById("filterBtn");
let downloadBtn = document.getElementById("downloadFilter");
let tbody = document.getElementById("tbody")

filterText.addEventListener("keyup", function() {
    currentPageNumber = 1
    performSearch()
})

const performSearch = function() {
    let sex = ""
    $('input[name ="gender"]').each(function() {
        if (this.checked) {
            sex = this.value
        }
    })
    let ageRange = $("#slider").slider("option", "values");
    if ($("#slider").slider("option", "disabled")) {
        ageRange = ["", ""]
    }

    console.log('current page number: ', currentPageNumber)

    const newUrl = url + `?q=${filterText.value}&sex=${sex}&minAge=${ageRange[0]}&maxAge=${ageRange[1]}&page=${currentPageNumber}`
    fetch(newUrl)
        .then(response => {
            if (response.ok) {
                return response;
            }
            throw Error(response.statusText);
        })
        .then(response => response.json())
        .then(data => {
            let rows = ""
            data.forEach(element => {

            const row = `
            <tr>
                <td> ${(highlightMatches(element.fName, filterText.value))}</td>
                <td> ${highlightMatches(element.lName, filterText.value)}</td>
                <td> ${highlightMatches(element.email,filterText.value)}</td>
                <td> ${highlightMatches(element.phoneNum,filterText.value)}</td>
                <td> ${highlightMatches(element.sex,filterText.value)}</td>
                <td> ${highlightMatches(element.age,filterText.value)}</td>
            </tr>
            `
                rows += row

            })
            tbody.innerHTML = rows;
            let total = $("#pagination-total").text()
            let from = ((currentPageNumber -1) * 10) + 1
            let paginationFootNote = `Displaying ${from} to ${(from + data.length - 1)} of ${total}`
            $("#pagination-footnote").text(paginationFootNote)
        })
}

const highlightMatches = function(str, query) {
    if (!str || !query) {
        return str
    }
    str = str.toString()
    let index = str.indexOf(query)
    if (index < 0) {
        return str
    }
    let firstPart = str.substr(0, index)
    let middlePart = `<span class='match'>${query}</span>`
    let endPart = str.substr(index + query.length)
    return firstPart + middlePart + endPart
}