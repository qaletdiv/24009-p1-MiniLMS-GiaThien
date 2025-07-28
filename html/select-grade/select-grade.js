const selectGradeForm = document.getElementById('select-grade-form');

selectGradeForm.addEventListener('submit',function(e){
    e.preventDefault();
    const gradeSelected=document.getElementById('modal-grade-select');
    const grade = gradeSelected.value;
    // console.log(grade);
    localStorage.setItem('grade',grade);
    window.location.href='./student-dashboard/student-dasboard.html'
})