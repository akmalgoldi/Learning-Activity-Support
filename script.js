let totalStudyTime = 0; // Variabel untuk menyimpan total waktu belajar
let studyTimer;
let isStudying = false;

// Memulai timer Pomodoro
function startPomodoro() {
  const studyTime = parseInt(document.getElementById("studyTime").value);
  const breakTime = parseInt(document.getElementById("breakTime").value);

  let remainingTime = studyTime * 60; // Waktu belajar dalam detik
  isStudying = true;

  // Menampilkan timer
  studyTimer = setInterval(function () {
    if (remainingTime > 0) {
      remainingTime--;
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      document.getElementById("timerDisplay").innerText = `${formatTime(
        minutes
      )}:${formatTime(seconds)}`;
    } else {
      clearInterval(studyTimer);
      totalStudyTime += studyTime; // Menambahkan waktu belajar ke total
      document.getElementById("totalStudyTime").innerText = totalStudyTime; // Update statistik waktu belajar
      alert("Waktu belajar selesai! Saatnya istirahat.");
      startBreak(); // Mulai sesi istirahat
    }
  }, 1000);
}

// Memulai timer untuk istirahat
function startBreak() {
  const breakTime = parseInt(document.getElementById("breakTime").value);
  let remainingTime = breakTime * 60; // Waktu istirahat dalam detik

  studyTimer = setInterval(function () {
    if (remainingTime > 0) {
      remainingTime--;
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      document.getElementById("timerDisplay").innerText = `${formatTime(
        minutes
      )}:${formatTime(seconds)}`;
    } else {
      clearInterval(studyTimer);
      alert("Waktu istirahat selesai! Saatnya belajar lagi.");
      startPomodoro(); // Mulai sesi belajar lagi
    }
  }, 1000);
}

// Menghentikan timer Pomodoro
function stopPomodoro() {
  clearInterval(studyTimer);
  document.getElementById("timerDisplay").innerText = "00:00";
}

// Format waktu (menambahkan 0 jika kurang dari 10)
function formatTime(time) {
  return time < 10 ? "0" + time : time;
}

// Menambahkan tugas
function addTask() {
  const taskInput = document.getElementById("newTask");
  const taskText = taskInput.value.trim();

  if (taskText) {
    const taskList = document.getElementById("taskList");
    const li = document.createElement("li");
    li.classList.add("task-item"); // Menambahkan kelas untuk styling

    li.textContent = taskText;

    // Membuat tombol selesai
    const doneButton = document.createElement("button");
    doneButton.textContent = "Selesai";
    doneButton.classList.add("done-button"); // Tambahkan kelas untuk styling
    doneButton.onclick = function () {
      li.style.textDecoration = "line-through"; // Menandai tugas selesai
      doneButton.disabled = true; // Menonaktifkan tombol selesai setelah digunakan
      li.classList.add("completed"); // Menambahkan kelas untuk tugas yang selesai
      saveTasks(); // Simpan tugas setelah diselesaikan
    };

    // Membuat tombol hapus
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Hapus";
    deleteButton.classList.add("delete-button"); // Tambahkan kelas untuk styling
    deleteButton.onclick = function () {
      taskList.removeChild(li); // Menghapus tugas dari daftar
      saveTasks(); // Simpan setelah tugas dihapus
    };

    // Menambahkan tombol selesai dan hapus ke dalam <li>
    li.appendChild(doneButton);
    li.appendChild(deleteButton);
    taskList.appendChild(li);

    taskInput.value = ""; // Kosongkan input setelah tugas ditambahkan

    saveTasks(); // Simpan daftar tugas setelah ditambahkan
  }
}

// Menyimpan daftar tugas ke localStorage
function saveTasks() {
  const tasks = [];
  const taskListItems = document.querySelectorAll(".task-item");

  taskListItems.forEach(function (task) {
    const taskText = task.textContent.replace("SelesaiHapus", "").trim();
    const isCompleted = task.classList.contains("completed");
    tasks.push({ text: taskText, completed: isCompleted });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks)); // Simpan ke localStorage
}

// Memuat daftar tugas dari localStorage saat halaman dimuat
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks) {
    const taskList = document.getElementById("taskList");

    tasks.forEach(function (task) {
      const li = document.createElement("li");
      li.classList.add("task-item");

      li.textContent = task.text;

      // Menandai tugas selesai jika sudah diselesaikan
      if (task.completed) {
        li.style.textDecoration = "line-through";
        li.classList.add("completed");
      }

      // Membuat tombol selesai
      const doneButton = document.createElement("button");
      doneButton.textContent = "Selesai";
      doneButton.classList.add("done-button");
      doneButton.onclick = function () {
        li.style.textDecoration = "line-through";
        doneButton.disabled = true;
        li.classList.add("completed");
        saveTasks(); // Simpan tugas setelah diselesaikan
      };

      // Membuat tombol hapus
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Hapus";
      deleteButton.classList.add("delete-button");
      deleteButton.onclick = function () {
        taskList.removeChild(li); // Menghapus tugas dari daftar
        saveTasks(); // Simpan setelah tugas dihapus
      };

      li.appendChild(doneButton);
      li.appendChild(deleteButton);
      taskList.appendChild(li);
    });
  }
}

// Memuat tugas saat halaman dimuat
window.onload = loadTasks;
