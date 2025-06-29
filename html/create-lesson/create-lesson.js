function signOut(){
  localStorage.removeItem('currentUser');
  window.location.href = '../index.html';
}

const form=document.querySelector('.lesson-form');
form.addEventListener('submit', function(e){
    e.preventDefault()
    const title=document.getElementById('title').value.trim();
    const grade=document.getElementById('grade').value;
    const content=document.getElementById('content').value.trim();

   

    const newLesson={
      title,
      grade,
      content,
    }

    const lessons = JSON.parse(localStorage.getItem('lessons'))||[];
    lessons.push (newLesson)
    localStorage.setItem('lessons',JSON.stringify(lessons));

    alert ('Tạo bài thành công')
    window.location.href='../teacher-dashboard/teacher-dashboard.html'
})