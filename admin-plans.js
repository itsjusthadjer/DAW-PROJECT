







const CLASSES_STORAGE_KEY = "grymusClasses";

const defaultClasses = [
  { name: "Cardio", trainer: ["Amine Benali"], day: ["Saturday", "Monday", "Wednesday"], time: "6AM-12PM", duration: "3h", difficulty: ["beginner", "intermediate"], capacity: 20 },
  { name: "Cardio", trainer: ["Karim Boudjemaa"], day: ["Saturday", "Monday", "Wednesday"], time: "12PM-6PM", duration: "3h", difficulty: ["advanced"], capacity: 20 },
  { name: "Cardio", trainer: ["Karim Boudjemaa"], day: ["Sunday", "Wednesday", "Thursday"], time: "6AM-12PM", duration: "3h", difficulty: ["advanced"], capacity: 20 },
  { name: "Cardio", trainer: ["Amine Benali"], day: ["Sunday", "Wednesday", "Thursday"], time: "12PM-6PM", duration: "3h", difficulty: ["beginner", "intermediate"], capacity: 20 },
  { name: "Cardio", trainer: ["Amine Benali"], day: ["Friday"], time: "2PM-6PM", duration: "3h", difficulty: ["all"], capacity: 20 },
  { name: "Strength and Free weights", trainer: ["Nesrine Haddad"], day: ["Saturday", "Monday", "Wednesday"], time: "6AM-12PM", duration: "3h", difficulty: ["beginner", "intermediate"], capacity: 18 },
  { name: "Strength and Free weights", trainer: ["Amine Benali"], day: ["Saturday", "Monday", "Wednesday"], time: "12PM-6PM", duration: "3h", difficulty: ["advanced"], capacity: 18 },
  { name: "Strength and Free weights", trainer: ["Amine Benali"], day: ["Sunday", "Wednesday", "Thursday"], time: "6AM-12PM", duration: "3h", difficulty: ["advanced"], capacity: 18 },
  { name: "Strength and Free weights", trainer: ["Nesrine Haddad"], day: ["Sunday", "Wednesday", "Thursday"], time: "12PM-6PM", duration: "3h", difficulty: ["beginner", "intermediate"], capacity: 18 },
  { name: "Strength and Free weights", trainer: ["Nesrine Haddad"], day: ["Friday"], time: "2PM-6PM", duration: "3h", difficulty: ["all"], capacity: 18 },
  { name: "Fundamental Training", trainer: ["Karim Boudjemaa"], day: ["Saturday", "Monday", "Wednesday"], time: "6AM-12PM", duration: "3h", difficulty: ["beginner", "intermediate"], capacity: 16 },
  { name: "Fundamental Training", trainer: ["Nesrine Haddad"], day: ["Saturday", "Monday", "Wednesday"], time: "12PM-6PM", duration: "3h", difficulty: ["advanced"], capacity: 16 },
  { name: "Fundamental Training", trainer: ["Nesrine Haddad"], day: ["Sunday", "Wednesday", "Thursday"], time: "6AM-12PM", duration: "3h", difficulty: ["advanced"], capacity: 16 },
  { name: "Fundamental Training", trainer: ["Karim Boudjemaa"], day: ["Sunday", "Wednesday", "Thursday"], time: "12PM-6PM", duration: "3h", difficulty: ["beginner", "intermediate"], capacity: 16 },
  { name: "Fundamental Training", trainer: ["Karim Boudjemaa"], day: ["Friday"], time: "2PM-6PM", duration: "3h", difficulty: ["all"], capacity: 16 },
  { name: "Water Aerobics", trainer: ["Yasmine Khelifi", "Sara Ait Ahmed"], day: ["Saturday", "Monday", "Wednesday"], time: "10AM-12:30PM", duration: "2h30", difficulty: ["all"], capacity: 15 },
  { name: "Water Aerobics", trainer: ["Yasmine Khelifi", "Walid Cherif"], day: ["Sunday", "Tuesday", "Thursday"], time: "10AM-12:30PM", duration: "2h30", difficulty: ["all"], capacity: 15 },
  { name: "Swimming Lessons", trainer: ["Sara Ait Ahmed", "Walid Cherif"], day: ["Saturday", "Monday", "Wednesday"], time: "1PM-3PM", duration: "2h", difficulty: ["all"], capacity: 12 },
  { name: "Swimming Lessons", trainer: ["Yasmine Khelifi", "Walid Cherif"], day: ["Sunday", "Wednesday", "Thursday"], time: "10AM-12PM", duration: "2h", difficulty: ["all"], capacity: 12 }
];

const adminClassesBody = document.getElementById("adminClassesBody");
const classForm = document.getElementById("classForm");
const classFormTitle = document.getElementById("classFormTitle");
const classFormMessage = document.getElementById("classFormMessage");
const cancelEdit = document.getElementById("cancelEdit");
const editIndex = document.getElementById("editIndex");
const className = document.getElementById("className");
const classTrainer = document.getElementById("classTrainer");
const classDay = document.getElementById("classDay");
const classTime = document.getElementById("classTime");
const classDuration = document.getElementById("classDuration");
const classDifficulty = document.getElementById("classDifficulty");
const classCapacity = document.getElementById("classCapacity");

let classes = loadClasses();

function loadClasses(){
  const storedClasses = localStorage.getItem(CLASSES_STORAGE_KEY);
  if (!storedClasses) {
    localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(defaultClasses));
    return defaultClasses;
  }

  try {
    return JSON.parse(storedClasses);
  } catch (error) {
    localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(defaultClasses));
    return defaultClasses;
  }
}

function saveClasses(){
  localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(classes));
}

function toList(value){
  return value.split(",").map(item => item.trim()).filter(Boolean);
}

function normalize(value){
  return String(value).trim().toLowerCase().replace(/\s+/g, "");
}

function normalizeList(values){
  return values.map(normalize).sort().join("|");
}

function slotChanged(originalClass, newClass){
  return normalizeList(originalClass.trainer) !== normalizeList(newClass.trainer) ||
    normalizeList(originalClass.day) !== normalizeList(newClass.day) ||
    normalize(originalClass.time) !== normalize(newClass.time);
}

function hasDuplicate(newClass, currentIndex){
  return classes.some((item, index) => {
    const sameClass = String(index) === String(currentIndex);
    const sameTime = normalize(item.time) === normalize(newClass.time);
    const sameTrainer = item.trainer.some(trainer => newClass.trainer.map(normalize).includes(normalize(trainer)));
    const sameDay = item.day.some(day => newClass.day.map(normalize).includes(normalize(day)));

    return !sameClass && sameTrainer && sameDay && sameTime;
  });
}

function showMessage(message, isError){
  classFormMessage.textContent = message;
  classFormMessage.className = isError ? "form-error" : "form-success";
}

function clearForm(){
  classForm.reset();
  editIndex.value = "";
  classFormTitle.textContent = "Add New Class";
  cancelEdit.hidden = true;
}

function buildClassFromForm(){
  return {
    name: className.value.trim(),
    trainer: toList(classTrainer.value),
    day: toList(classDay.value),
    time: classTime.value.trim(),
    duration: classDuration.value.trim(),
    difficulty: [classDifficulty.value],
    capacity: Number(classCapacity.value)
  };
}

function renderClasses(){
  adminClassesBody.innerHTML = "";

  classes.forEach((item, index) => {
    adminClassesBody.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.trainer.join(", ")}</td>
        <td>${item.day.join(", ")}</td>
        <td>${item.time}</td>
        <td>${item.duration}</td>
        <td>${item.difficulty.join(", ")}</td>
        <td>${item.capacity || ""}</td>
        <td>
          <div class="action-buttons">
            <input type="button" value="Edit" data-action="edit" data-index="${index}">
            <input type="button" value="delete" data-action="delete" data-index="${index}">
          </div>
        </td>
      </tr>
    `;
  });
}

classForm.addEventListener("submit", event => {
  event.preventDefault();

  const newClass = buildClassFromForm();
  const currentIndex = editIndex.value;
  const originalClass = currentIndex === "" ? null : classes[Number(currentIndex)];

  if (newClass.trainer.length === 0 || newClass.day.length === 0) {
    showMessage("Please enter at least one trainer and one day.", true);
    return;
  }

  if ((!originalClass || slotChanged(originalClass, newClass)) && hasDuplicate(newClass, currentIndex)) {
    showMessage("Duplicate class blocked: this trainer already has a class on that day at that time.", true);
    return;
  }

  if (currentIndex === "") {
    classes.push(newClass);
    showMessage("Class added and saved.", false);
  } else {
    classes[Number(currentIndex)] = newClass;
    showMessage("Class updated and saved.", false);
  }

  saveClasses();
  renderClasses();
  clearForm();
});

adminClassesBody.addEventListener("click", event => {
  const button = event.target.closest("input[type='button']");
  if (!button) return;

  const index = Number(button.dataset.index);
  const item = classes[index];

  if (button.dataset.action === "delete") {
    classes.splice(index, 1);
    saveClasses();
    renderClasses();
    clearForm();
    showMessage("Class deleted and saved.", false);
    return;
  }

  editIndex.value = index;
  className.value = item.name;
  classTrainer.value = item.trainer.join(", ");
  classDay.value = item.day.join(", ");
  classTime.value = item.time;
  classDuration.value = item.duration;
  classDifficulty.value = item.difficulty[0] || "all";
  classCapacity.value = item.capacity || "";
  classFormTitle.textContent = "Edit Class";
  cancelEdit.hidden = false;
  document.getElementById("class-details").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
  classForm.classList.remove("form-swipe");
  void classForm.offsetWidth;
  classForm.classList.add("form-swipe");
});

cancelEdit.addEventListener("click", () => {
  clearForm();
  showMessage("", false);
});

renderClasses();