
function toCreateLesson() {
  window.location.href = '../create-lesson/create-lesson.html'
}

document.addEventListener("DOMContentLoaded",function(){
  renderLessons();
  renderExercise();
})

function renderLessons(){
  const lessons = JSON.parse(localStorage.getItem("lessons"))||[];
  const lessonList = document.getElementById("lesson-list");

  if(lessons.length===0){
    lessonList.innerHTML = "<li>Chưa có bài giảng</li>"
    return;
  }

  lessons.forEach((lesson)=>{
    const li = document.createElement('li');
    li.classList.add("lesson-item");
    li.innerHTML=`<a href="/html/teacher-submission/teacher-submission.html?type=lesson&id=${lesson.id}">
      ${lesson.title}
    </a>`
    lessonList.appendChild(li);
  })
}

function renderExercise(){
  const exercises = JSON.parse(localStorage.getItem("exercises"))||[];
  const exerciseList = document.getElementById("exercise-list");

  if(exercises.length===0){
    exerciseList.innerHTML = "<li>Chưa có bài tập</li>"
    return;
  }

  exercises.forEach((exercise)=>{
    const li = document.createElement('li');
    li.classList.add("exercise-item");
    li.innerHTML=`<a href="/html/teacher-submission/teacher-submission.html?type=exercise&id=${exercise.id}">
      ${exercise.title}
    </a>`
    exerciseList.appendChild(li);
  })
}