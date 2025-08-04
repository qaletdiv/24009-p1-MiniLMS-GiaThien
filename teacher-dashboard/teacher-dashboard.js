function toIndex(){
  window.location.href = '../index.html'
}


function toCreateLesson() {
  window.location.href = '../create-lesson/create-lesson.html'
}



document.addEventListener("DOMContentLoaded",function(){
  renderLessons();
  renderExercise();
  updateStats();
  
 
  window.addEventListener('storage', function(e) {
    if (e.key === 'lessons' || e.key === 'exercises') {
      updateStats();
      renderLessons();
      renderExercise();
    }
  });
  
  
 
})

function updateStats() {
  
  const lessons = JSON.parse(localStorage.getItem("lessons")) || [];
  const exercises = JSON.parse(localStorage.getItem("exercises")) || [];
  
  
  const lessonCountElement = document.getElementById("lesson-count");
  const exerciseCountElement = document.getElementById("exercise-count");
  
  if (lessonCountElement) {
    lessonCountElement.textContent = lessons.length;
  }
  
  if (exerciseCountElement) {
    exerciseCountElement.textContent = exercises.length;
  }
  
  
  const lessonCountBadge = document.getElementById("lesson-count-badge");
  const exerciseCountBadge = document.getElementById("exercise-count-badge");
  
  if (lessonCountBadge) {
    lessonCountBadge.textContent = lessons.length;
  }
  
  if (exerciseCountBadge) {
    exerciseCountBadge.textContent = exercises.length;
  }
  
 
 
}

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
    li.innerHTML=`
      <div class="lesson-content">
        <span class="lesson-title">${lesson.title}</span>
        <button class="btn-view-lesson" onclick="viewLesson(${lesson.id})">
          Xem bài giảng
        </button>
      </div>
    `
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
    li.innerHTML=`
      <div class="exercise-content">
        <span class="exercise-title">${exercise.title}</span>
        <button class="btn-view-exercise" onclick="viewExercise(${exercise.id})">
          Xem bài tập
        </button>
      </div>
    `
    exerciseList.appendChild(li);
  })
}

function viewLesson(lessonId) {
  window.location.href = `/teacher-submission/teacher-submission.html?type=lesson&id=${lessonId}`;
}

function viewExercise(exerciseId) {
  window.location.href = `/teacher-submission/teacher-submission.html?type=exercise&id=${exerciseId}`;
}