


document.addEventListener("DOMContentLoaded",()=>{



    //membership registration and validation 

    const Registration=document.getElementById("register");
    const fullname=document.getElementById("Full-Name");
    const email=document.getElementById("email");
    const phone=document.getElementById("phone");
    const dateOfBirth=document.getElementById("date-of-birth");
    const plans=document.querySelectorAll('input[name="plan"]');
    const terms=document.getElementById("agree");


    const errorFullname=document.getElementById("error-fullname");
    const errorEmail=document.getElementById("error-email");
    const errorPhone=document.getElementById("error-phone");
    const errorDateOfBirth=document.getElementById("error-dateOfBirth");
    const errorPlan=document.getElementById("error-plan");
    const termsRequired=document.getElementById("error-terms");


    const validFormMsg=document.getElementById("valid-form-message");




    function FullnameValidation(){
        if(fullname.value.trim() === ""){
            errorFullname.textContent="Please enter your full name";
            fullname.style.border="4px solid #ff0000";
            return false;

        }else if(fullname.value.length < 3){
            errorFullname.textContent="full name must at least contain 3 characters";
            fullname.style.border="4px solid #ff0000";
            return false;
        }else{
            errorFullname.textContent="";
            fullname.style.border="4px solid #008000";
            return true;
        }
    }



    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function emailValidation(){
        if(email.value.trim() === ""){
            errorEmail.textContent="Please enter your email";
            email.style.border="4px solid #ff0000";
            return false;

        }else if(emailRegex.test(email.value.trim()) === false){
            errorEmail.textContent="Please enter a valid email format";
            email.style.border="4px solid #ff0000";
            return false;
        }else{
            errorEmail.textContent="";
            email.style.border="4px solid #008000";
            return true;
        }
    
    }


    function phoneValidation(){
        if(phone.value.trim() === ""){
            errorPhone.textContent="Please enter your phone number";
            phone.style.border="4px solid #ff0000";
            return false;

        }else if(phone.value.length<8 || phone.value.length>15){
            errorPhone.textContent="phone number must have 8-15 digits";
            phone.style.border="4px solid #ff0000";
            return false;
        }else{
            errorPhone.textContent="";
            phone.style.border="4px solid #008000";
            return true;
        }
    }


    function dateOfBirthValidation(){

        const today = new Date();
        const birthDate = new Date(dateOfBirth.value);

        let age=today.getFullYear()-birthDate.getFullYear();
        const months=today.getMonth()-birthDate.getMonth();


        if(dateOfBirth.value === ""){
            errorDateOfBirth.textContent="Please enter your date of birth";
            dateOfBirth.style.border="4px solid #ff0000";
            return false;

        }else{
            if(months < 0  || (months === 0 && today.getDate()< birthDate.getDate())){
                age--;
            }

            if(age<16){
                errorDateOfBirth.textContent="You must be at least 16 years old";
                dateOfBirth.style.border="4px solid #ff0000";
                return false;

            }else{
                errorDateOfBirth.textContent="";
                dateOfBirth.style.border="4px solid #008000";
                return true;
            }
        }
    }




    function planSelectionValidation(){
        let planchecked=false;
        plans.forEach(plan =>{
            if(plan.checked){
                planchecked=true;
            }
        })

        if(!planchecked){
            errorPlan.textContent="Please select a plan";
            return false;
        }else{
            errorPlan.textContent="";
            return true;
        }

    }




    function termsValidation(){
        if(!terms.checked){
            termsRequired.textContent="You must agree to the terms and conditions";
            return false;
        }else{
            termsRequired.textContent="";
            return true;
        }
    }


    function formValidation(e){
        e.preventDefault();



        FullnameValidation();
        emailValidation();
        phoneValidation();
        dateOfBirthValidation();
        planSelectionValidation();
        termsValidation();


        const validForm=FullnameValidation() & emailValidation() & phoneValidation() &
        dateOfBirthValidation() & planSelectionValidation() & termsValidation();


        if(validForm){
            validFormMsg.textContent="Registration successful ! ✅";
            document.getElementById("mini-cart").classList.remove("visible");
            document.querySelectorAll(".membership-plan").forEach(plan=>{
            plan.classList.remove("selected");
        });

        }else{
            validFormMsg.textContent="";
        }
    


    }






    if(fullname) fullname.addEventListener("blur",FullnameValidation);
    if(email) email.addEventListener("blur",emailValidation);
    if(phone) phone.addEventListener("blur",phoneValidation);
    if(dateOfBirth) dateOfBirth.addEventListener("blur",dateOfBirthValidation);
    if(Registration) Registration.addEventListener("submit",formValidation);


    //membership cart and plan selection 

    selectPlanBtns=document.querySelectorAll('.select-plan');



    const proceedPlanBtn = document.getElementById("proceed-plan-btn");
    const removePlanBtn = document.getElementById("remove-plan-btn");
    const miniCart = document.getElementById("register");



    let selectedplan=null;

    selectPlanBtns.forEach(button=>{
        button.addEventListener("click", ()=>{
            const card=button.closest(".membership-plan");
            const nameOfPlan=card.querySelector('h3 span').textContent.trim();
            const priceOfPlan=card.querySelector('.price').textContent.trim();

            selectedplan={name: nameOfPlan,price: priceOfPlan};

            sessionStorage.setItem('selectedPlan',JSON.stringify(selectedplan));

            document.querySelectorAll('.membership-plan').forEach(c=> c.classList.remove('selected'));
            card.classList.add('selected');

            document.getElementById("mini-cart").classList.add("visible");
            document.getElementById("cart-plan-name").textContent=nameOfPlan;
            document.getElementById("cart-plan-price").textContent=priceOfPlan;
        });
    });




    if(proceedPlanBtn) proceedPlanBtn.addEventListener("click",()=>{
        if(selectedplan === null) return;

        const chosenRadio=selectedplan.name.toLowerCase();
        const radio=document.querySelector('input[type="radio"][name="plan"][value="' + chosenRadio + '"]')
        if(radio){radio.checked=true};
        document.getElementById("register").scrollIntoView({ behavior: 'smooth' });
    })



    if(removePlanBtn) removePlanBtn.addEventListener("click",()=>{
        selectedplan=null;
        sessionStorage.removeItem('selectedPlan');
        document.getElementById("mini-cart").classList.remove("visible");
        document.querySelectorAll(".membership-plan").forEach(plan=>{
            plan.classList.remove("selected");
        });
        document.querySelectorAll('input[name="plan"]').forEach(radio=>{radio.checked=false;});
    });

    if(miniCart) miniCart.addEventListener("submit",()=>{
        sessionStorage.removeItem('selectedPlan');
    });

    const savedPlan=sessionStorage.getItem("selectedPlan");

    if(savedPlan!==null){
        selectedplan=JSON.parse(savedPlan);
        document.getElementById('mini-cart').classList.add('visible');
        document.getElementById('cart-plan-name').textContent  = selectedplan.name;
        document.getElementById('cart-plan-price').textContent = selectedplan.price;
        document.querySelectorAll('.membership-plan').forEach(card => {
        const name = card.querySelector('h3 span').textContent.trim();
        if (name === selectedplan.name){card.classList.add('selected')};
    });

    }

    //Contact form & feedback


    const contactName=document.getElementById("name-contact");
    const contactEmail=document.getElementById("email-contact");
    const subject=document.getElementById("subject");
    const message=document.getElementById("message");

    const registerationContact=document.getElementById("contact-registration");
   


    const nameError=document.getElementById("name-error");
    const emailContactError=document.getElementById("email-contact-error");
    const subjectError=document.getElementById("subject-error");
    const messageError=document.getElementById("message-error");

    function nameValidation(){
        if(contactName.value.trim()===""){
            nameError.textContent="Please enter your name";
            contactName.style.border="4px solid #ff0000";
            return false;
        }else if(contactName.value.length < 2){
            nameError.textContent="Full name must at least contain 2 characters";
            contactName.style.border="4px solid #ff0000";
            return false;
        }else{
            nameError.textContent="";
            contactName.style.border="4px solid #008000";
            return true;
        }
    }


    function contactEmailValidation(){
         if(contactEmail.value.trim() === ""){
            emailContactError.textContent="Please enter your email";
            contactEmail.style.border="4px solid #ff0000";
            return false;

        }else if(emailRegex.test(contactEmail.value.trim()) === false){
            emailContactError.textContent="Please enter a valid email format";
            contactEmail.style.border="4px solid #ff0000";
            return false;
        }else{
            emailContactError.textContent="";
            contactEmail.style.border="4px solid #008000";
            return true;
        }
    }


    function subjectValidation(){
        if(subject.value.trim()===""){
            subjectError.textContent="Please enter a subject";
            subject.style.border="4px solid #ff0000";
            return false;
        }else if(subject.value.length < 5){
            subjectError.textContent="Subject must at least contain 5 characters";
            subject.style.border="4px solid #ff0000";
            return false;
        }else{
            subjectError.textContent="";
            subject.style.border="4px solid #008000";
            return true;
        }
    }

    const charCounter=document.getElementById("character-counter-msg");

    function messageValidation(){
        if(message.value.trim()===""){
            messageError.textContent="Please enter a message";
            message.style.border="4px solid #ff0000";
            return false;
        }else if (message.value.length < 20){
            messageError.textContent="Message must at least contain 20 characters";
            message.style.border="4px solid #ff0000";
            return false;
        }else{
            messageError.textContent="";
            message.style.border="4px solid #008000";
            return true;
        }
    }



    if(contactName) contactName.addEventListener("blur",nameValidation);
    if(contactEmail) contactEmail.addEventListener("blur",contactEmailValidation);
    if(subject) subject.addEventListener("blur",subjectValidation);
    if(message) message.addEventListener("blur",messageValidation);
    if(message) message.addEventListener('input', () => {
    charCounter.textContent = `${message.value.length}  character/s`;

    if (message.value.length < 20 && message.value.length >= 0) {
        charCounter.classList.add('not-enough');
    } else {
        charCounter.classList.remove('not-enough');
    }
 });

 const toast=document.getElementById("toast-notif");
 function ContactFormValidation(e){
    e.preventDefault();
    nameValidation();
    contactEmailValidation();
    subjectValidation();
    messageValidation();


    const validateFormContact=nameValidation() & contactEmailValidation() & subjectValidation()
                                & messageValidation();
    if(validateFormContact){

        const newMsg={
            name:contactName.value.trim(),
            email:contactEmail.value.trim(),
            subject:subject.value.trim(),
            message:message.value.trim(),
            date: new Date().toLocaleString()
        }

        const messages=JSON.parse(localStorage.getItem('adminMessages') || '[]');

        messages.push(newMsg);
        localStorage.setItem('adminMessages',JSON.stringify(messages));
        

        toast.classList.add('show');
        setTimeout(()=> toast.classList.remove('show'),4000);
    }
 }

 if(registerationContact) registerationContact.addEventListener("submit",ContactFormValidation);

 




});
