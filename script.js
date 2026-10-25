// nav bar

let toggle = document.querySelector("#toggle")
let navbar = document.querySelector("#medianav")

    toggle.onclick = () => {
        navbar.classList.toggle("active")
    }

let usericon = document.querySelector("#user")
let userdetail = document.querySelector("#usericon")
usericon.onclick = ()=>{
    userdetail.classList.toggle("active")
}
// form

let newBill = document.querySelector(".add-new")
let showForm = document.querySelector(".form")

newBill.onclick = ()=>{
    showForm.classList.toggle("active")
    showForm.scrollIntoView({behavior:"smooth"})
}
//search 

let searchBill = document.querySelector("#searchbill")
let billTable = document.querySelector("#bill-table");

searchBill.oninput = ()=>{

    let searchValue = searchBill.value.toLowerCase();
    let tablerow = billTable.querySelectorAll("tr");

    let noResult = document.querySelector("#no-result");
    let match = false;
    tablerow.forEach((row)=>{
        
        let rowtext = row.textContent.toLowerCase();
        if(rowtext.includes(searchValue)){
            row.style.display = "";
            match = true;
        }
        else{
            row.style.display = "none"
        }
    })
    noResult.style.display = match ? "none": "block";

}
// form bill

let billform = document.querySelector("#form-bill")

// form details are added in table

billform.querySelector(".save").onclick = (e)=>{
    e.preventDefault();
    if(!billform.checkValidity()){
        billform.reportValidity();
        return;
    }

let name = document.querySelector("#billname").value;
let category = document.querySelector("#billcategory").value;
let amount = document.querySelector("#billamount").value;
let date = document.querySelector("#billdate").value;
let status = document.querySelector("#billstatus").value;

addRow(name, category, amount, date, status)

billform.reset();

alert("Bill Form Submitted Successfully!")

}

function addRow(name, category, amount, date, status){

    let records = JSON.parse(localStorage.getItem("billbuddy")) || [];

    
    let record = {
        name : name,
        category: category,
        amount: Number(amount),
        date: date,
        status: status
    }
    records.push(record);

    localStorage.setItem("billbuddy",JSON.stringify(records))

    renderrow(record);
    billcounts();
}

function renderrow(record){

    let row = document.createElement("tr");

    let namecell = document.createElement("td");
    let div = document.createElement("div");
    div.className = "bill-details"

    let namebill = document.createElement("h2")
    namebill.textContent = record.name;

    let utilities = document.createElement("p")
    utilities.textContent =  record.category;

    div.append(namebill, utilities);
    namecell.appendChild(div);

    let amountbill = document.createElement("td")
    amountbill.textContent = "₹"+record.amount;

    let datebill = document.createElement("td");
    datebill.textContent = record.date;

    let statuscell = document.createElement("td")
    let statustxt = document.createElement("span")

    let today = new Date();

    let duedate = new Date(record.date);
    if(record.status == "Pending" && duedate < today){
        record.status = "Overdue";
    }
    statustxt.textContent = record.status;

    let statusClass = {
        Pending : "pending",
        Active : "active",
        Overdue: "overd",
        Paid : "complete"
    };

    if(statusClass[record.status]){
        statustxt.className = statusClass[record.status];
    }

    statuscell.appendChild(statustxt);

    row.append(namecell, amountbill, datebill, statuscell)
    billTable.appendChild(row);

}

function showRecords(){

    let records = JSON.parse(localStorage.getItem("billbuddy")) || [];
    let today = new Date();

    records.forEach(function(record) {
        let duedate = new Date(record.date);

        if (record.status === "Pending" && duedate < today) {
            record.status = "Overdue";
        }

        renderrow(record);
    });

    localStorage.setItem("billbuddy", JSON.stringify(records));
}
showRecords();

// // filter

// let filter = document.querySelectorAll(".filter-buton");

// filter.forEach((button)=>{

// button.onclick = ()=>{
//     let selectstatus = button.dataset.status;
//     let rows = billTable.querySelectorAll("tr");
//     let match = false;
    
//     rows.forEach((row)=>{
//         let statustxt = row.cells[3].textContent.trim();
//         if(selectstatus == "All" || statustxt == selectstatus){
//             row.style.display = "";
//             match = true;
//         }
//         else{
//             row.style.display = "none"
//         }
//     });
//     filter.forEach((btn)=>{
//         btn.classList.remove("active");
//     });
//     button.classList.add("active")
// }
    
// });
// count increasing

function billcounts(){
    let records = JSON.parse(localStorage.getItem("billbuddy")) || []

    let paid = 0;
    let pending = 0;
    let overdue = 0;

    let totalpending = 0;

    records.forEach((record)=>{

        let amount = Number(record.amount)

        if(record.status == "Pending" || record.status == "Overdue"){
            totalpending += amount;
        }

        if(record.status == "Paid"){
            paid++;
        }
        else if(record.status == "Pending"){
            pending++;
        }
        else if(record.status == "Overdue"){
            overdue++;
        }
        // else{
            
        // }
    })
    document.querySelector(".paid-count").textContent = paid;
    document.querySelector(".pending-count").textContent = pending;
    document.querySelector(".overdue-count").textContent = overdue;

    document.querySelector(".total-pending").textContent = totalpending;
}
billcounts();

