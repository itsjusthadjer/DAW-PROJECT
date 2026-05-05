

document.addEventListener("DOMContentLoaded",()=>{



      const trainerSearch = document.getElementById("trainerSearch");
      const noTrainers = document.getElementById("no-trainers");
      const trainerCards = document.querySelectorAll(".trainer-card");
      const trainerModal = document.getElementById("trainerModal");
      const trainerModalPhoto = document.getElementById("trainerModalPhoto");
      const trainerModalName = document.getElementById("trainerModalName");
      const trainerModalSpecialty = document.getElementById("trainerModalSpecialty");
      const trainerModalBio = document.getElementById("trainerModalBio");
      const trainerModalSchedule = document.getElementById("trainerModalSchedule");
      const modalClose = document.querySelector(".modal-close");

      const trainerData = [
        {
          name: "Yasmine Khelifi",
          specialty: "Aerobics & Swimming",
          bio: "An energetic coach who blends rhythmic aerobics with swimming techniques to boost endurance, coordination, and overall fitness.",
          schedule: ["Saturday - Aerobics", "Monday - Swimming", "Wednesday - Group Class"],
          image: "https://media.istockphoto.com/id/1445097972/photo/soccer-woman-and-coach-portrait-on-field-for-match-game-in-mexico-with-optimistic-and-joyful.jpg?s=612x612&w=0&k=20&c=Q0W4y4u4ttgsiuspFkSsQvnp_3bFZAKV0qJRYOUU9aU="
        },
        {
          name: "Sara Ait Ahmed",
          specialty: "Aerobics & Swimming",
          bio: "A motivating and supportive coach focused on beginner-friendly aerobics and confidence-building swimming lessons for all ages.",
          schedule: ["Sunday - Aerobics", "Tuesday - Swimming", "Thursday - Recovery"],
          image: "https://media.istockphoto.com/id/1475273176/photo/black-woman-fitness-and-coach-with-arms-crossed-and-smile-for-training-exercise-or-workout-at.jpg?s=612x612&w=0&k=20&c=k4mzdGS85dyvsbhmHHTZSukohEoAtzINzDIXBjclRLk="
        },
        {
          name: "Nesrine Haddad",
          specialty: "Fundamental Training & Strength and Free weight",
          bio: "Specializes in proper form, mobility, and building strong fitness foundations.",
          schedule: ["Monday - Fundamentals", "Wednesday - Strength", "Friday - Free Weights"],
          image: "https://media.istockphoto.com/id/1480547017/photo/young-happy-female-coach-during-pe-class-at-elementary-school-gym-looking-at-camera.jpg?s=612x612&w=0&k=20&c=FmdcnNLp1KlsKkyT14ceICDxgTsE1-DSA77c9qnEziU="
        },
        {
          name: "Walid Cherif",
          specialty: "Aerobics & Swimming",
          bio: "A versatile coach known for dynamic group classes and structured swimming sessions that boost stamina and full-body strength.",
          schedule: ["Tuesday - Aerobics", "Thursday - Swimming", "Saturday - Conditioning"],
          image: "https://media.istockphoto.com/id/2160741811/photo/happy-fit-sporty-mature-older-man-wearing-white-t-shirt-isolated-on-background.jpg?s=612x612&w=0&k=20&c=rIFoJNISwtt6UpJrEEdq57QS7IzT86pcbq-VEcJov-w="
        },
        {
          name: "Amine Benali",
          specialty: "Cardio & Strength and Free weight",
          bio: "Focuses on endurance, muscle building, and performance-based workouts.",
          schedule: ["Monday - Cardio", "Wednesday - Strength", "Friday - Performance"],
          image: "https://media.istockphoto.com/id/1459398604/photo/gym-fitness-and-portrait-of-proud-man-standing-with-smile-motivation-health-and-energy-for.jpg?s=612x612&w=0&k=20&c=uuPu_IkCxq1TlVwpHf3I9kjkBj_y_IY4ovXiqcmXIlc="
        },
        {
          name: "Karim Boudjemaa",
          specialty: "Cardio & Fundamental Training",
          bio: "Combines high-intensity cardio with functional movement exercises to improve strength, endurance, and overall conditioning.",
          schedule: ["Tuesday - Cardio", "Thursday - Fundamentals", "Saturday - Conditioning"],
          image: "https://media.istockphoto.com/id/1988004616/photo/portrait-of-professional-fitness-coach-in-a-gym-looking-at-camera.jpg?s=612x612&w=0&k=20&c=AH8Rn7snDjNo4pSoLnjks2gc3iGx3U_lJ11AfYHdXog="
        }
      ];

      function openModal(trainer) {
        trainerModalPhoto.src = trainer.image;
        trainerModalPhoto.alt = trainer.name;
        trainerModalName.textContent = trainer.name;
        trainerModalSpecialty.textContent = trainer.specialty;
        trainerModalBio.textContent = trainer.bio;
        trainerModalSchedule.innerHTML = trainer.schedule.map(item => `<li>${item}</li>`).join("");
        trainerModal.hidden = false;
        document.body.classList.add("modal-open");
        modalClose.focus();
      }

      function closeModal() {
        trainerModal.hidden = true;
        document.body.classList.remove("modal-open");
      }

      trainerSearch.addEventListener("input", function () {
        const query = this.value.trim().toLowerCase();
        let visibleCount = 0;

        trainerCards.forEach((card, index) => {
          const name = card.querySelector("a").textContent.toLowerCase();
          const specialty = card.querySelector("p").textContent.toLowerCase();
          const match = `${name} ${specialty}`.includes(query);
          card.style.display = match ? "" : "none";
          if (match) visibleCount++;
        });

        noTrainers.hidden = visibleCount !== 0;
      });

      trainerCards.forEach((card, index) => {
        card.addEventListener("click", function (event) {
          event.preventDefault();
          openModal(trainerData[index]);
        });
      });

      modalClose.addEventListener("click", closeModal);

      trainerModal.addEventListener("click", event => {
        if (event.target === trainerModal) closeModal();
      });

      document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !trainerModal.hidden) closeModal();
      });



});