const selectGradeForm = document.getElementById('select-grade-form');
const gradeButtons = document.querySelectorAll('.grade-btn')
let selectedGrade = null;

gradeButtons.forEach(button => {
    button.addEventListener('click', () => {
        gradeButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedGrade = button.getAttribute('data-grade');
    });
});

selectGradeForm.addEventListener('submit',function(e){
    e.preventDefault();
    if (!selectedGrade) {
        alert('Vui lòng chọn lớp trước khi xác nhận.');
        return;
    }
    localStorage.setItem('grade', selectedGrade);
    window.location.href = '/html/student-dashboard/student-dashboard.html';
})