function toTeacherDashBoard(){
    localStorage.setItem('role','teacher');
    window.location.href='./teacher-dashboard/teacher-dashboard.html'
}
function handleStudentButton(){
    localStorage.setItem('role','student');
    const grade = localStorage.getItem('grade');
    if(!grade){
        window.location.href='./select-grade/select-grade.html'
    }
    else{
        window.location.href='./student-dashboard/student-dashboard.html'
    }
}