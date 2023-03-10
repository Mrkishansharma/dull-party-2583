let main = document.getElementById("rt-container");
let checkBox = document.querySelectorAll("#rt-filter input")
let data = []
let rt_pagination=document.getElementById("pagination-wrapper")
let url="https://63f71d1fe8a73b486af0e017.mockapi.io"





// fetching api
fetching()
async function fetching(page=1) {
    let resp = await fetch(`${url}/products?limit=20&pages=${page}`);
    let rt_total_item=resp.headers.get('X-Total-Count');
    console.log("x-taol===>",rt_total_item);
    let rt_total_pages=Math.ceil(rt_total_item/10)
    resp = await resp.json()
    data = resp
    rt_paginationbtn(rt_total_pages)
    render_ran(resp)
    
}
// pagination
function rt_paginationbtn(page){
    let btn=[]
    for(let i=1; i<=page; i++){
        btn.push(`<button class='pagination-button' data-page-number=${i}>${i}</button>`)
    }

    rt_pagination.innerHTML=btn.join("");

    let all_btn=document.querySelectorAll("#pagination-wrapper button")

    for(let btn of all_btn){
        btn.addEventListener("click",(e)=>{
            fetching(e.target.dataset.pageNumber);
        })
    }
}



// sorting low to high
function low_to_high_ran() {
    let temp_ran = [...data]
    let sort_atob_ran = temp_ran.sort(function (a, b) {
        return a.price - b.price
    })
    
    render_ran(sort_atob_ran)
}
// sorting high to low
function high_to_low_ran() {
    let temp_ran = [...data]
    let sort_atob_ran = temp_ran.sort(function (a, b) {
        return b.price - a.price
    })
    render_ran(sort_atob_ran)
}


// sorting show all data
function showAllProducts_ran(){
    render_ran(data)

}

// time part
function timeAgo_ran(data) {
    let d1 = new Date()

    let d2 = new Date(data)
    let one = 1000 * 60 * 60 * 24;
    let diff = d1.getTime() - d2.getTime();

    let diffday = Math.round(diff / one);
    return diffday
}

// insert data from api to dom
function render_ran(data) {
    let card = `
    ${data.map((item) => getcard_ran(item)).join("")}
    
    `;
    main.innerHTML = card
}



function getcard_ran(obj) {
    let { createdAt, id, title, condition,  image, price } = obj


    let dataadd =
        `<div id="rt-product" data-id="${id}" onclick="normal_ran(event,${id})">
            <img class="rt-img" src="${image}" alt="">
            <h3><i class="fa fa-inr fa-lg" aria-hidden="true"></i>${price}</h3>
            <p>${title.substring(0, 40)}</p>
           
            <div class="rt-cond_btn">
            <h5>${condition}</h5>
            <h6>${timeAgo_ran(createdAt)} day ago
            <button>View </button>
        </div>
        </div>
    `;
    return dataadd

}

// to productdetail page

function normal_ran(event,idd) {
    // console.log("idd====>",idd)
    // console.log("id====>",event.target.dataset.id)
    console.log(event)
    let selectedProduct_ran  = data.filter((ele)=>{
        return idd==ele.id
    })
    console.log(selectedProduct_ran);
    
    localStorage.setItem("currentProductDetails_SellBuyer",JSON.stringify(selectedProduct_ran[0]))
    location.href = "productDetails.html"
}


// rest below all are filtering part

let filterdata_ran = (e) => {
    let arr = []
    checkBox.forEach((input) => {
        if (input.checked) {
            arr.push(input.name)
        }
    })
    let filterdata = data.filter((item) => {
        let flag = false;
        for (let a of arr) {
            if (a === item.category|| a==item.condition ) {
                flag = true;
            }
            
            
        }
        if (flag) {
            return true
        }
        return false
    })
    if(filterdata==""){
        render_ran(data)
    }else{ 
    render_ran(filterdata)
    }

}

checkBox.forEach((input) => {
    input.addEventListener("change", filterdata_ran)
})




let SS_navbar_search = document.querySelector(".SS-navbar-search > input")
console.log("searchbar==>",SS_navbar_search);

SS_navbar_search.addEventListener("input",(e)=>{
  console.log(e.target.value);
  fetch(`https://63f71d1fe8a73b486af0e017.mockapi.io/products?search=${e.target.value}`)
  .then(res=>{
    return res.json()
  }).then(data =>{
    console.log("productdata==>",data);
    render_ran(data)
  })
})