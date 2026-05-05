document.addEventListener("DOMContentLoaded",()=>{      
        
        
        
        
        
        
        
        
        
        
        
        
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

        function loadClasses(){
        let storedClasses = localStorage.getItem(CLASSES_STORAGE_KEY);
        if (!storedClasses) {
            localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(defaultClasses));
            return defaultClasses;
        }

        try {
            return JSON.parse(storedClasses);
        } catch (error) {
            return defaultClasses;
        }
        }

        let classes = loadClasses();

        const tableBody = document.getElementById("tableBody");
        const trainerFilter = document.getElementById("trainerFilter");
        const difficultyFilter = document.getElementById("difficultyFilter");
        const dayFilter = document.getElementById("dayFilter");
        const sortButtons = document.querySelectorAll(".sort-btn");

        let selectedDays = [];
        let sortState = {
        key: "",
        direction: "asc"
        };


        function fillFilters(){


        let trainers = ["all"];
        classes.forEach(c => {
            c.trainer.forEach(t => {
            if (!trainers.includes(t)) trainers.push(t);
            });
        });

        trainerFilter.innerHTML =
            trainers.map(t => `<option value="${t}">${t}</option>`).join("");

        let difficulties = ["all"];
        classes.forEach(c => {
            c.difficulty.forEach(d => {
            if (!difficulties.includes(d)) difficulties.push(d);
            });
        });

        difficultyFilter.innerHTML =
            difficulties.map(d => `<option value="${d}">${d}</option>`).join("");


        let days = [];
        classes.forEach(c => {
            c.day.forEach(d => {
            if (!days.includes(d)) days.push(d);
            });
        });

        dayFilter.innerHTML =
            days.map(d => `<button type="button" class="dayBtn" data-day="${d}">${d}</button>`).join("");
        }


        function filterTable(){

        let trainer = trainerFilter.value;
        let difficulty = difficultyFilter.value;

        let filtered = classes.filter(c => {

            let trainerMatch =
            trainer === "all" || c.trainer.includes(trainer);

            let difficultyMatch =
            difficulty === "all" || c.difficulty.includes(difficulty);

            let dayMatch =
            selectedDays.length === 0 || c.day.some(d => selectedDays.includes(d));

            return trainerMatch && difficultyMatch && dayMatch;
        });

        if (sortState.key) {
            filtered = [...filtered].sort((a, b) => {
            let aValue = getSortValue(a, sortState.key);
            let bValue = getSortValue(b, sortState.key);

            if (aValue < bValue) return sortState.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortState.direction === "asc" ? 1 : -1;
            return 0;
            });
        }

        buildTable(filtered);
        }


        function getSortValue(item, key){
        if (key === "time") return timeToMinutes(item.time);
        if (key === "duration") return durationToMinutes(item.duration);
        return String(item[key]).toLowerCase();
        }


        function timeToMinutes(timeRange){
        let match = String(timeRange).match(/^(\d+)(?::(\d+))?(AM|PM)/i);
        if (!match) return 0;

        let hours = Number(match[1]) % 12;
        let minutes = match[2] ? Number(match[2]) : 0;
        if (match[3].toUpperCase() === "PM") hours += 12;
        return hours * 60 + minutes;
        }


        function durationToMinutes(duration){
        let match = String(duration).match(/^(\d+)h(?:(\d+))?/i);
        if (!match) return 0;

        return Number(match[1]) * 60 + (match[2] ? Number(match[2]) : 0);
        }


        function updateSortIndicators(){
        sortButtons.forEach(btn => {
            let indicator = btn.querySelector(".sort-indicator");
            let isActive = btn.dataset.sort === sortState.key;
            if (indicator) {
            indicator.textContent = isActive ? (sortState.direction === "asc" ? "▲" : "▼") : "";
            }
        });
        }


        function setupDayButtons(){

        document.querySelectorAll(".dayBtn").forEach(btn => {

            btn.addEventListener("click", function () {

            let day = this.dataset.day;

            if (selectedDays.includes(day)) {
                selectedDays = selectedDays.filter(d => d !== day);
                this.classList.remove("active");
            } else {
                selectedDays.push(day);
                this.classList.add("active");
            }

            filterTable();
            });
        });
        }


        function buildTable(data){

        tableBody.innerHTML = "";

        data.forEach(c => {

            let difficulty = c.difficulty.map(d => {

            if (d === "beginner") return `<span class="badge-beg">beginner</span>`;
            if (d === "intermediate") return `<span class="badge-int">intermediate</span>`;
            if (d === "advanced") return `<span class="badge-adv">advanced</span>`;
            return `<span class="badge-all">${d}</span>`;
            }).join(" ");

            tableBody.innerHTML += `
            <tr>
                <td>${c.name}</td>
                <td>${c.trainer.join(", ")}</td>
                <td>${c.day.join(", ")}</td>
                <td>${c.time}</td>
                <td>${c.duration}</td>
                <td>${difficulty}</td>
                <td>${c.capacity || ""}</td>
            </tr>
            `;
        });
        }


        function attachEvents(){

        trainerFilter.addEventListener("change", filterTable);
        difficultyFilter.addEventListener("change", filterTable);

        sortButtons.forEach(btn => {
            btn.addEventListener("click", function () {
            let key = this.dataset.sort;

            if (sortState.key === key) {
                sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
            } else {
                sortState.key = key;
                sortState.direction = "asc";
            }

            updateSortIndicators();
            filterTable();
            });
        });
        }


        window.onload = function () {
        fillFilters();
        setupDayButtons();
        attachEvents();
        updateSortIndicators();
        buildTable(classes);
        };
});