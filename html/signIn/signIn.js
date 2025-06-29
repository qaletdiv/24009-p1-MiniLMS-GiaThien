function toRegisterPage(){
    window.location.href = "../register/register.html";
}
function toSignInPage(){
    window.location.href = "../signIn/signIn.html";
}

document.querySelector('form').addEventListener('submit',function(e){
    e.preventDefault();

    const usernameInput=document.getElementById('username').value.trim();
    const passwordInput=document.getElementById('password').value;

    const users=JSON.parse(localStorage.getItem('users'))||[];
    const matchedUser=users.find(user=>user.username===usernameInput&&user.password===passwordInput);
    if (matchedUser){
        alert('Đăng nhập thành công')
        localStorage.setItem('currentUser',JSON.stringify(matchedUser));

        if(matchedUser.role==='student'){
            window.location.href = "../student-dashboard/student-dashboard.html";
        }
        if(matchedUser.role==='teacher') {
            window.location.href = "/html/teacher-dashboard/teacher-dashboard.html";
        }
    }
    else{
        alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
})