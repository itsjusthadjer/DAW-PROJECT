


document.addEventListener("DOMContentLoaded",()=>{


//Stimulated Member Management



   if (!localStorage.getItem("members")) {
      const sampledMembers=[
         { id: 1, name:"Alice Martin",   email: "alice@email.com",  phone: "0551234567", plan: "Gold",   joinDate: "2026-01-15", status:'active'},
         { id: 2, name: "Karim Bensalah", email: "karim@email.com",  phone: "0662345678", plan: "Silver", joinDate: "2026-03-10",status:'inactive'},
         { id: 3, name: "Sara Ouali",     email: "sara@email.com",   phone: "0773456789", plan: "Bronze", joinDate: "2025-05-20" ,status:'active' },
         { id: 4, name: "Youcef Hamdi",   email: "youcef@email.com", phone: "0554567890", plan: "Gold",   joinDate: "2025-11-01" ,status:'active'},
         { id: 5, name: "Nadia Bouzid",   email: "nadia@email.com",  phone: "0665678901", plan: "Silver", joinDate: "2025-07-08", status:'active'}
        ];
        localStorage.setItem("members", JSON.stringify(sampledMembers));
   }

    function getMembers() {
        return JSON.parse(localStorage.getItem("members")) || [];
    }


    function saveMembers(members) {
        localStorage.setItem("members", JSON.stringify(members));
    }


    const dashboardCount = document.getElementById("dashboard-member-count");
    if (dashboardCount) {
    dashboardCount.textContent = getMembers().length;
    }


    window.addEventListener("storage", () => {
    const dashboardCount = document.getElementById("dashboard-member-count");
    if (dashboardCount) {
        dashboardCount.textContent = getMembers().length;
    }
    });



    
    const activityTbody = document.querySelector('#recent-activity tbody');
    if (activityTbody) {
    const members = getMembers();
    const recent = [...members]
        .filter(m => m.status !== "inactive") 
        .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
        .slice(0, 5);

    activityTbody.innerHTML = "";
    recent.forEach(member => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${member.name}</td>
            <td>${member.joinDate}</td>
            <td>${member.plan}</td>`;
        activityTbody.appendChild(tr);
    });
    }

    /*classes and plan chart and active subs*/




    
    const CLASSES_STORAGE_KEY = "grymusClasses";

    const fallbackClasses = [
        { day: ["Saturday", "Monday", "Wednesday"] },
        { day: ["Saturday", "Monday", "Wednesday"] },
        { day: ["Sunday", "Wednesday", "Thursday"] },
        { day: ["Sunday", "Wednesday", "Thursday"] },
        { day: ["Friday"] }
    ];

    function readStoredArray(key, fallback) {
        const storedData = localStorage.getItem(key);
        if (!storedData) return fallback;
        try {
            const parsed = JSON.parse(storedData);
            return Array.isArray(parsed) ? parsed : fallback;
        } catch { return fallback; }
    }

    function getPlanCounts(members) {
        return members.reduce((counts, member) => {
            const plan = member.plan || "Unknown";
            counts[plan] = (counts[plan] || 0) + 1;
            return counts;
        }, {});
    }

    function getMostPopularPlan(planCounts) {
        const entries = Object.entries(planCounts);
        if (entries.length === 0) return "None";
        return entries.sort((a, b) => b[1] - a[1])[0][0];
    }

    function countWeeklyClasses(classes) {
        return classes.length;
    }

    function renderChart(planCounts) {
        const planChart = document.getElementById("planChart");
        if (!planChart) return;
        const highest = Math.max(...Object.values(planCounts), 1);
        planChart.innerHTML = "";
        Object.entries(planCounts).forEach(([plan, count]) => {
            const height = Math.max((count / highest) * 100, 8);
            planChart.innerHTML += `
                <div class="plan-bar-wrap">
                    <div class="plan-bar" style="height: ${height}%">
                        <span>${count}</span>
                    </div>
                    <p>${plan}</p>
                </div>`;
        });
    }

    function renderExtraStats() {
        const members = getMembers();
        const classes = readStoredArray(CLASSES_STORAGE_KEY, fallbackClasses);
        const planCounts = getPlanCounts(members);

        const activeSubs = document.getElementById("activeSubscriptions");
        const classesPerWeek = document.getElementById("classesPerWeek");
        const popularPlan = document.getElementById("popularPlan");

        if (activeSubs) activeSubs.textContent = members.filter(m => m.status !== "inactive").length;
        if (classesPerWeek) classesPerWeek.textContent = countWeeklyClasses(classes);
        if (popularPlan) popularPlan.textContent = getMostPopularPlan(planCounts);

        renderChart(planCounts);
    }

    renderExtraStats();


    window.addEventListener("focus", renderExtraStats);
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) renderExtraStats();
    });
    setInterval(renderExtraStats, 3000);



















    if (!document.querySelector('#members-table tbody')) return;

    function displayMembers(list){
        const tbody=document.querySelector('#members-table tbody');
        tbody.innerHTML="";
        document.getElementById("member-count").textContent=list.length;
        list.forEach(member=>{
            const trOfMember=document.createElement("tr");
            trOfMember.innerHTML=`
            <td>${member.id}</td>
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td>${member.plan}</td>
            <td>${member.joinDate}</td>
            <td>
                <button type="button" onclick="editMember(${member.id})" id="edit-member-table">Edit</button>
                <button type="button" onclick="deleteMember(${member.id})" id="delete-member-table">Delete</button>
            </td>`;
            tbody.appendChild(trOfMember);
        });
        
    }
    displayMembers(getMembers());

    



    function applyFilters() {
    let members = getMembers();
    const search = document.getElementById("search-input").value.toLowerCase();
    const plan   = document.getElementById("plan-filter").value;

    if (search) {
        members = members.filter(m =>
            m.name.toLowerCase().includes(search) ||
            m.email.toLowerCase().includes(search)
        );
    }

    if (plan !== "All") {
        members = members.filter(m => m.plan === plan);
    }

    displayMembers(members);
    }



    document.getElementById("add-member-btn").addEventListener("click", () => {
        const name     = document.getElementById("admin-name").value.trim();
        const email    = document.getElementById("admin-email").value.trim();
        const phone    = document.getElementById("admin-phone").value.trim();
        const plan     = document.getElementById("admin-plan").value;
        const joinDate = document.getElementById("admin-joindate").value;
        const error    = document.getElementById("add-member-error");

        if (!name || !email || !phone || !plan || !joinDate) {
            error.textContent = "All fields are required.";
            return;
        }

        error.textContent = "";
        const members = getMembers();
        const nextId  = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
        members.push({ id: nextId, name, email, phone, plan, joinDate });
        saveMembers(members);

        document.getElementById("admin-name").value    = "";
        document.getElementById("admin-email").value   = "";
        document.getElementById("admin-phone").value   = "";
        document.getElementById("admin-plan").value    = "";
        document.getElementById("admin-joindate").value = "";

        applyFilters();
    });


    window.deleteMember = function(id) {
        if (!confirm("Are you sure you want to delete this member?")) return;
        let members = getMembers().filter(m => m.id !== id);
        saveMembers(members);
        applyFilters();
    };


    let editingId = null;
 
    window.editMember = function(id) {
        const member = getMembers().find(m => m.id === id);
        editingId = id;
 
        document.getElementById("edit-name").value = member.name;
        document.getElementById("edit-email").value = member.email;
        document.getElementById("edit-phone").value = member.phone;
        document.getElementById("edit-plan").value = member.plan;
        document.getElementById("edit-joindate").value = member.joinDate;
 
        document.getElementById("edit-modal").classList.remove("hidden");
    };



        document.getElementById("save-edit-btn").addEventListener("click", () => {
        const members = getMembers();
        const member  = members.find(m => m.id === editingId);
 
        member.name     = document.getElementById("edit-name").value.trim();
        member.email    = document.getElementById("edit-email").value.trim();
        member.phone    = document.getElementById("edit-phone").value.trim();
        member.plan     = document.getElementById("edit-plan").value;
        member.joinDate = document.getElementById("edit-joindate").value;
 
        saveMembers(members);
        document.getElementById("edit-modal").classList.add("hidden");
        editingId = null;
        applyFilters();
    });


    document.getElementById("cancel-edit-btn").addEventListener("click", () => {
        document.getElementById("edit-modal").classList.add("hidden");
        editingId = null;
    });
 
    
    document.getElementById("search-input").addEventListener("input", applyFilters);
    document.getElementById("plan-filter").addEventListener("change", applyFilters);
 
    applyFilters();








































});