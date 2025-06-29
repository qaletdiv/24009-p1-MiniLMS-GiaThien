const roleSelect = document.getElementById('role');
const gradeContainer = document.getElementById('grade-container');
const gradeSelect = document.getElementById('grade');
function toRegisterPage(){
    window.location.href = "../register/register.html";
}
function toSignInPage(){
    window.location.href = "../signIn/signIn.html"
}
roleSelect.addEventListener('change',function() {
    if(this.value==='student'){
        gradeContainer.style.display = 'block';
        gradeSelect.setAttribute('require','require')
    }
    else{
        gradeContainer.style.display = 'none';
        gradeSelect.removeAttribute('required')
        gradeSelect.value=''
    }
})
document.querySelector('form').addEventListener('submit',function(e){
    e.preventDefault();
    const username=document.getElementById('username').value.trim();
    const password=document.getElementById('password').value;
    const confirmPassword=document.getElementById('confirm-password').value;
    const role = document.getElementById('role').value;
    const grade = document.getElementById('grade').value;

    if(password!==confirmPassword){
        alert('Mật khẩu không khớp');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users'))||[];

    const userExists = users.some(user=>user.username===username);
        if (userExists){
            alert('Tên đăng nhập đã tồn tại');
            return;
        }
    

    const newUser={
        username,
        password,
        role,
        grade: role === 'student' ? grade : null,
    }
   
    users.push(newUser);
    localStorage.setItem('users',JSON.stringify(users));
    alert ('Đăng ký thành công');
    toSignInPage();
})