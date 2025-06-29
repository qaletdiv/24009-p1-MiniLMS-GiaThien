
function signOut(){
  localStorage.removeItem('currentUser');
  window.location.href = '../index.html';
}
function toCreateExcercise(){
  window.location.href='../create-exercise/create-exercise.html'
}

function toCreateLesson(){
  window.location.href='../create-lesson/create-lesson.html'
}

const lessons = JSON.parse(localStorage.getItem('lessons'))||[];
const container = document.getElementById('lesson-count');

if(lessons.length>0){
  const link = document.createElement('a');
  link.href="../lessonCreated/lessonCreated.html";
  link.textContent=`Bài giảng đã tạo: ${lessons.length}`;
  link.classList.add('lesson-link');

  container.appendChild(link);
}

const exercises = JSON.parse(localStorage.getItem('exercises')) || [];
const exerciseContainer = document.getElementById('exercise-count');

if (exercises.length > 0) {
  const exLink = document.createElement('a');
  exLink.href = "../exerciseCreated/exerciseCreated.html";
  exLink.textContent = `Bài tập đã tạo: ${exercises.length}`;
  exLink.classList.add('exercise-link');

  exerciseContainer.appendChild(exLink);
}


