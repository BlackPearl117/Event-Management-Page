document.addEventListener("DOMContentLoaded", function () {
  // Check if FullCalendar is supported
  if (typeof FullCalendar !== "undefined") {
    var calendarEl = document.getElementById("calendar");
    var events = []; // Store events here

    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      events: events,
      dateClick: function (info) {
        alert("Date: " + info.dateStr);
      },
      eventMouseEnter: function (info) {
        // Show tooltip with event details
        var tooltip = new Tooltip(info.el, {
          title: info.event.title,
          placement: "top",
          trigger: "hover",
          container: "body",
        });
      },
      dayRender: function (info) {
        // Add hover functionality to show events for that day
        var date = info.date;
        var eventsForDate = events.filter((event) => {
          return (
            event.start.toISOString().split("T")[0] ===
            date.toISOString().split("T")[0]
          );
        });

        if (eventsForDate.length > 0) {
          info.el.addEventListener("mouseenter", function () {
            var tooltipContent = eventsForDate
              .map((event) => event.title)
              .join("<br>");
            var tooltip = new Tooltip(info.el, {
              title: tooltipContent,
              html: true,
              placement: "top",
              trigger: "hover",
              container: "body",
            });
            tooltip.show();
          });

          info.el.addEventListener("mouseleave", function () {
            Tooltip.hide();
          });
        }
      },
    });

    calendar.render();

    // Event creation form submission
    document
      .getElementById("eventForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        const title = document.getElementById("eventTitle").value;
        const description = document.getElementById("eventDescription").value;
        const date = document.getElementById("eventDate").value;
        const time = document.getElementById("eventTime").value;
        const location = document.getElementById("eventLocation").value;
        const category = document.getElementById("eventCategory").value;

        const eventDateTime = `${date}T${time}`;
        const newEvent = {
          title: title,
          start: eventDateTime,
          description: description,
          location: location,
          category: category,
        };

        events.push(newEvent); // Add event to the events array
        calendar.addEvent(newEvent); // Add event to the calendar

        // Add to upcoming events list
        const upcomingEventsDiv = document.getElementById("upcoming-events");
        const eventItem = document.createElement("div");
        eventItem.className = "event-item";
        eventItem.innerHTML = `
        <strong>${title}</strong><br>
        ${description}<br>
        ${date} ${time}<br>
        ${location}<br>
        <span class="event-category">${category}</span><br>
        <button class="btn btn-outline-primary btn-sm mt-2" onclick="shareEvent('Facebook', '${title}')">Share on Facebook</button>
        <button class="btn btn-outline-primary btn-sm mt-2" onclick="shareEvent('Twitter', '${title}')">Share on Twitter</button>
      `;
        upcomingEventsDiv.appendChild(eventItem);

        // Clear the form
        document.getElementById("eventForm").reset();
        var modal = bootstrap.Modal.getInstance(
          document.getElementById("eventModal")
        );
        modal.hide();
      });

    // Search functionality
    document
      .getElementById("searchForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        const searchTerm = document
          .getElementById("searchInput")
          .value.toLowerCase();
        const eventItems = document.querySelectorAll(".event-item");

        eventItems.forEach((item) => {
          const title = item.querySelector("strong").textContent.toLowerCase();
          if (title.includes(searchTerm)) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });

    // Filter functionality
    document
      .getElementById("filterForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        const selectedCategory =
          document.getElementById("filterCategory").value;
        const selectedDate = document.getElementById("filterDate").value;

        const eventItems = document.querySelectorAll(".event-item");
        eventItems.forEach((item) => {
          const title = item.querySelector("strong").textContent.toLowerCase();
          const eventCategory = item
            .querySelector(".event-category")
            .textContent.toLowerCase();
          const eventDate = item.innerHTML.match(/(\d{4}-\d{2}-\d{2})/)[0];

          let showItem = true;
          if (
            selectedCategory &&
            eventCategory !== selectedCategory.toLowerCase()
          ) {
            showItem = false;
          }
          if (selectedDate && eventDate !== selectedDate) {
            showItem = false;
          }

          item.style.display = showItem ? "block" : "none";
        });
      });

    // RSVP functionality
    document
      .getElementById("upcoming-events")
      .addEventListener("click", function (e) {
        if (e.target.classList.contains("event-item")) {
          alert(
            "You have RSVP'd for " +
              e.target.querySelector("strong").textContent
          );
        }
      });
  } else {
    console.error("FullCalendar is not supported in this browser.");
  }
});

// Function to share event on social media
function shareEvent(platform, eventTitle) {
  alert("Event '" + eventTitle + "' shared on " + platform);
}
