function signOut() {
  localStorage.removeItem('currentUser');
  window.location.href = "../signIn/signIn.html";
}

function toTeacherDashBoard(){
  window.location.href = "../teacher-dashboard/teacher-dashboard.html";
}


window.addEventListener("DOMContentLoaded", () => {
  const exerciseList = document.getElementById("exercise-list");
  const exercises = JSON.parse(localStorage.getItem("exercises")) || [];
  const submissions = JSON.parse(localStorage.getItem("submittedExercises")) || [];

  if (exercises.length === 0) {
    exerciseList.innerHTML = "<p>Chưa có bài tập nào được tạo.</p>";
    return;
  }

  exercises.forEach((exercise, index) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("exercise-wrapper");

    wrapper.innerHTML = `
      <h3>${index + 1}. ${exercise.title} (Lớp ${exercise.grade})</h3>
    `;

    
    const relatedSubs = submissions.filter(sub => sub.exerciseTitle === exercise.title && sub.grade === exercise.grade);

    if (relatedSubs.length === 0) {
      wrapper.innerHTML += `<p><em>Chưa có học sinh nào nộp bài này.</em></p>`;
    } else {
      const ul = document.createElement("ul");
      relatedSubs.forEach((sub, i) => {
        ul.innerHTML += `
          <li>
            ${i + 1}. <strong>${sub.student}</strong> - Điểm: ${sub.totalScore}/${sub.maxScore}
            <br><small>Nộp lúc: ${new Date(sub.submittedAt).toLocaleString()}</small>
          </li>
        `;
      });
      wrapper.appendChild(ul);
    }

    exerciseList.appendChild(wrapper);
  });
});
