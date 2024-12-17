let totalStudyTime = 0;
let studySessions = 0; 
let studyTimer;
let isStudying = false;
let remainingTime = 0;
let studyTimes = []; 

function startPomodoro() {
  const studyTime = parseInt(document.getElementById("studyTime").value);
  const breakTime = parseInt(document.getElementById("breakTime").value);

  if (!remainingTime) {
    remainingTime = studyTime * 60;
  }
  isStudying = true;

  localStorage.setItem("isStudying", isStudying);
  localStorage.setItem("remainingTime", remainingTime);
  localStorage.setItem("studyTime", studyTime);
  localStorage.setItem("breakTime", breakTime);

  studyTimer = setInterval(function () {
    if (remainingTime > 0) {
      remainingTime--;
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      document.getElementById("timerDisplay").innerText = `${formatTime(
        minutes
      )}:${formatTime(seconds)}`;

      localStorage.setItem("remainingTime", remainingTime);
    } else {
      clearInterval(studyTimer);
      totalStudyTime += studyTime;
      studySessions++;
      studyTimes.push(studyTime);
      document.getElementById("totalStudyTime").innerText = totalStudyTime;
      document.getElementById("averageStudyTime").innerText = (totalStudyTime / studySessions).toFixed(2);
      updateChart();
      alert("Waktu belajar selesai! Saatnya istirahat.");
      remainingTime = 0;
      startBreak();
    }
  }, 1000);
}

function startBreak() {
  const breakTime = parseInt(localStorage.getItem("breakTime"));

  if (!remainingTime) {
    remainingTime = breakTime * 60;
  }

  localStorage.setItem("isStudying", false);
  localStorage.setItem("remainingTime", remainingTime);

  studyTimer = setInterval(function () {
    if (remainingTime > 0) {
      remainingTime--;
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      document.getElementById("timerDisplay").innerText = `${formatTime(
        minutes
      )}:${formatTime(seconds)}`;

      localStorage.setItem("remainingTime", remainingTime);
    } else {
      clearInterval(studyTimer);
      alert("Waktu istirahat selesai! Saatnya belajar lagi.");
      remainingTime = 0;
      startPomodoro();
    }
  }, 1000);
}

function stopPomodoro() {
  clearInterval(studyTimer);
  isStudying = false;
  localStorage.setItem("remainingTime", remainingTime);
  localStorage.setItem("isStudying", isStudying);
}

function resetPomodoro() {
  clearInterval(studyTimer);
  remainingTime = 0;
  isStudying = false;
  document.getElementById("timerDisplay").innerText = "00:00";
  localStorage.removeItem("isStudying");
  localStorage.removeItem("remainingTime");

  document.getElementById("studyTime").value = 25;
  document.getElementById("breakTime").value = 5;
  localStorage.setItem("studyTime", 25);
  localStorage.setItem("breakTime", 5);
}

function formatTime(time) {
  return time < 10 ? "0" + time : time;
}

function addTask() {
  const taskInput = document.getElementById("newTask");
  const taskText = taskInput.value.trim();

  if (taskText) {
    const taskList = document.getElementById("taskList");
    const li = document.createElement("li");
    li.classList.add("task-item");

    li.textContent = taskText;

    const doneButton = document.createElement("button");
    doneButton.textContent = "Selesai";
    doneButton.classList.add("done-button");
    doneButton.onclick = function () {
      li.style.textDecoration = "line-through";
      doneButton.disabled = true;
      li.classList.add("completed");
      saveTasks();
    };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Hapus";
    deleteButton.classList.add("delete-button");
    deleteButton.onclick = function () {
      taskList.removeChild(li);
      saveTasks();
    };

    li.appendChild(doneButton);
    li.appendChild(deleteButton);
    taskList.appendChild(li);

    taskInput.value = "";

    saveTasks();
  }
}

function saveTasks() {
  const tasks = [];
  const taskListItems = document.querySelectorAll(".task-item");

  taskListItems.forEach(function (task) {
    const taskText = task.textContent.replace("SelesaiHapus", "").trim();
    const isCompleted = task.classList.contains("completed");
    tasks.push({ text: taskText, completed: isCompleted });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks) {
    const taskList = document.getElementById("taskList");

    tasks.forEach(function (task) {
      const li = document.createElement("li");
      li.classList.add("task-item");

      li.textContent = task.text;

      if (task.completed) {
        li.style.textDecoration = "line-through";
        li.classList.add("completed");
      }

      const doneButton = document.createElement("button");
      doneButton.textContent = "Selesai";
      doneButton.classList.add("done-button");
      doneButton.onclick = function () {
        li.style.textDecoration = "line-through";
        doneButton.disabled = true;
        li.classList.add("completed");
        saveTasks();
      };

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Hapus";
      deleteButton.classList.add("delete-button");
      deleteButton.onclick = function () {
        taskList.removeChild(li);
        saveTasks();
      };

      li.appendChild(doneButton);
      li.appendChild(deleteButton);
      taskList.appendChild(li);
    });
  }
}

window.onload = function () {
  loadTasks();

  if (localStorage.getItem("remainingTime")) {
    remainingTime = parseInt(localStorage.getItem("remainingTime"));
    isStudying = localStorage.getItem("isStudying") === "true";

    if (isStudying) {
      document.getElementById("studyTime").value = localStorage.getItem("studyTime");
      startPomodoro();
    } else {
      document.getElementById("breakTime").value = localStorage.getItem("breakTime");
      startBreak();
    }
  } else {
    if (localStorage.getItem("studyTime")) {
      document.getElementById("studyTime").value = localStorage.getItem("studyTime");
    }
    if (localStorage.getItem("breakTime")) {
      document.getElementById("breakTime").value = localStorage.getItem("breakTime");
    }
  }

  document.getElementById("timerDisplay").classList.add("fade-in");

  initChart();
};

function initChart() {
  const ctx = document.getElementById('studyChart').getContext('2d');
  window.studyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Waktu Belajar (menit)',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function updateChart() {
  const studyChart = window.studyChart;
  studyChart.data.labels.push(`Sesi ${studySessions}`);
  studyChart.data.datasets[0].data.push(studyTimes[studyTimes.length - 1]);
  studyChart.update();
}

document.getElementById("breakTime").addEventListener("change", function() {
  localStorage.setItem("breakTime", this.value);
});

document.getElementById("studyTime").addEventListener("change", function() {
  localStorage.setItem("studyTime", this.value);
});
