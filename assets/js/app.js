var cl=console.log;
const BASE_URL="https://xhrcrud-default-rtdb.firebaseio.com";
const PRODUCT_URL=`${BASE_URL}/product.json`;
const spinner=document.getElementById("spinner")
const Myform=document.getElementById("Myform")
const product=document.getElementById("product")
 const groceryConatiner=document.getElementById("groceryConatiner")
  const AddBtn=document.getElementById("AddBtn");
 const UpdBtn=document.getElementById("UpdBtn");


// Spinner
function Spinnerhandler(){
    spinner.classList.toggle("d-none")
}

// Snackbar
function Snackbar(msg,icon){
    Swal.fire({
        title:msg,
        icon:icon,
        timer:3000,
    })

}


// localstate
const state={
    productArr:[],
    editId:null

}


//Obj to Arr
function ObjtoArr(obj){
    state.productArr=[];
    for(const key in obj){
        obj[key].id=key;
     state.productArr.unshift(obj[key])

    }
}

//templating
function Rendering(arr){
    let result=``;
    arr.forEach(ele => {
        result+=`
        <li class="list-group-item d-flex justify-content-between align-items-center" id="${ele.id}">
                                    <strong>${ele.product}</strong>
                                    <div>
                                    <i onclick="OnEditTodo(this)"  class="fa-regular fa-pen-to-square fa-2x text-primary"></i>
                                    <i onclick="OnDlt(this)"  class="fa-solid fa-trash-can fa-2x text-danger"></i>
                                        </div>
                                </li>`
        
    });
    groceryConatiner.innerHTML=result;

}

// read
function ShowAlltodo(){
    Spinnerhandler();
    fetch(PRODUCT_URL,{
        method:"GET",
        body:null,
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"

        }
    })
    .then(res=>{
        if(!res.ok){
            throw new Error(`HTTP ERROR:${res.status}`);
            
        }
        return res.json();
    })
    .then(data=>{
        cl(data)
        ObjtoArr(data);
        Rendering(state.productArr)

    })
    .catch(err=>{
        cl("error")
    })
    .finally(()=>{
            Spinnerhandler();

    })


}
ShowAlltodo();



// create
function CreateAll(ele){
    Spinnerhandler();
    ele.preventDefault();
    let NewObj={
        product:product.value
    }
    fetch(PRODUCT_URL,{
        method:"POST",
        body:JSON.stringify(NewObj),
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"

        }
    })
    .then(res=>{
        if(!res.ok){
            throw new Error(`HTTP ERROR${res.status}`)
        }
        return res.json();
    })
    .then(data=>{
let li = document.createElement("li")    
li.id = data.name;
li.className="list-group-item d-flex justify-content-between align-items-center"
        li.innerHTML=`<strong>${NewObj.product}</strong>
                                    <div>
                                    <i  onclick="OnEditTodo(this)"  class="fa-regular fa-pen-to-square fa-2x text-primary"></i>
                                    <i  onclick="OnDlt(this)" class="fa-solid fa-trash-can fa-2x text-danger"></i>
                                        </div>
        `
        groceryConatiner.append(li);
        Snackbar("list created Sucsesfully!!","success")
        Myform.reset();
    

    })
    .catch(err=>{
        cl(err);

    })
    .finally(()=>{
        Spinnerhandler();

    })
}


// /edit
function OnEditTodo(eve){
    Spinnerhandler();
    let editId =eve.closest("li").id;
        state.editId=editId;
let Edit_url= `${BASE_URL}/product/${editId}.json`
fetch(Edit_url,{
    method:"GET",
    body:null,
    headers:{
        "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"

    }
    })
    .then(res=>{
        if(!res.ok){
            throw new Error(`HTTP ERROR:${res.status}`)
        }
        return res.json();
    })
    .then(data=>{
       product.value = data.product;
        AddBtn.classList.add("d-none");
        UpdBtn.classList.remove("d-none")
    })
    .catch(err=>{
        cl(err)
    })
    .finally(()=>{
        Spinnerhandler();
    })
}



// update
function OnBtnHandler(eve){
    Spinnerhandler();
    let Update_id= state.editId
    let update_url=`${BASE_URL}/product/${Update_id}.json`
    let upobj={
        id:Update_id,
        product:product.value
    }
    fetch(update_url,{
        method:"PATCH",
        body:JSON.stringify(upobj),
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
         
    
        }

    })
    .then(res=>{
        if(!res.ok){
            throw new Error(`HTTP ERROR ${res.status}`)

        }
        return res.json();

    })
    .then(res=>{
        let li= document.getElementById(Update_id);
        li.querySelector("strong").innerHTML=res.product;
        AddBtn.classList.remove("d-none");
        UpdBtn.classList.add("d-none")
        Snackbar("list updated Sucsesfully!!","success");
        Myform.reset();
        
    

    })
    .catch(err=>{
        cl(err);
    })
    .finally(()=>{
        Spinnerhandler();

    })


}





function OnDlt(eve){

    let Remove_Id=eve.closest("li").id
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
    Spinnerhandler();
    let Remove_URL= `${BASE_URL}/product/${Remove_Id}.json`
    fetch(Remove_URL,{
        method:"DELETE",
        body:null,
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"

        }
    })
    .then(res=>{
        if(!res.ok){
            throw new Error(`HTTP ERROR: ${res.status}`)
        }
        return res.json();
    })
    .then(res=>{
        cl(res)
        let index=state.productArr.findIndex(b=>b.id===Remove_Id);
        state.productArr.splice(index,1);
        eve.closest("li").remove();
        Snackbar("Your Item remove sucsessfully!!","success")
    })
    .catch(err=>{
        cl(err)

    })
    .finally(()=>{
        Spinnerhandler();
    })
  }
});

}



Myform.addEventListener("submit",CreateAll);
UpdBtn.addEventListener("click",OnBtnHandler);