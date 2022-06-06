let form = document.getElementById('reg-form');
form["email"].oninput= (event)=>{
    let email = document.getElementById("email");
    let error=document.getElementById("email-error");
    
    email.addEventListener("input", function (event) {
      if (email.value=="") {
        
        
        error.style.display="block";
        email.style.boxShadow="0 0 5px 5px #7FCD91"
      } else {
      
       
       error.style.display="none";
        email.style.boxShadow="none"; 
      }
    });}

form["password"].oninput=(event)=>{
    let password = document.getElementById("password-login");
    let error=document.getElementById("pass-error");
    password.addEventListener("input",function(event){
        if (password.v) {
        
        
            error.style.display="block";
            password.style.boxShadow="0 0 5px 5px #7FCD91"
          } else {
          
           
           error.style.display="none";
            password.style.boxShadow="none"; 
          }
    })
}