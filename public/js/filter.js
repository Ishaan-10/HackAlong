
// const input = document.querySelector('#search').nodeValue();
console.log("connected")
const input = document.querySelector('#search');
const form = document.querySelector('#searchform');
const users = document.querySelectorAll('.card');

form.addEventListener('input',()=>{
    const text = input.value.toLowerCase();
    
    for(user of users){
        if(user.indexOf(text)){
            user.style.display = 'block';
        }else{
            user.style.display = 'none';
        }
    }

})