let form = document.getElementById('reg-form');
form["email"].oninput= (event)=>{
    let email = document.getElementById("email");
    let error=document.getElementById("email-error");
    let r=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    email.addEventListener("input", function (event) {
      if (r.test(email.value)) {
        email.setCustomValidity("");
        error.style.display="none";
        email.style.boxShadow="none"; 
      } else {
      
       email.setCustomValidity("Enter correct email address");
       error.style.display="block";
        email.style.boxShadow="0 0 5px 5px #7FCD91"
      }
    });}

form["password"].oninput=(event)=>{
  let error=document.getElementById("pass-error");
    let password = document.getElementById("password");
    let r =/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    password.addEventListener("input",function(event){
        if(r.test(password.value)){
            password.setCustomValidity("");
            error.style.display="none";
            password.style.boxShadow="none";
        }else{
            password.setCustomValidity("*Minimum eight characters \n *At least one letter\n *One number\n *One special character");
            error.style.display="block";
            password.style.boxShadow="0 0 5px 5px #7FCD91";
        }
    })
}