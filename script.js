const alertBtn = document.getElementById("alertBtn");
const output = document.getElementById("output");
const alertSound = document.getElementById("alertSound");

// Contact form
const contactForm = document.getElementById("contactForm");
const contactList = document.getElementById("contactList");

let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
displayContacts();

// Handle contact saving
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  contacts.push({ name, phone });
  localStorage.setItem("contacts", JSON.stringify(contacts));

  contactForm.reset();
  displayContacts();
  alert("✅ Contact saved successfully!");
});

// Display contacts
function displayContacts() {
  contactList.innerHTML = "<h4>Saved Contacts:</h4>";
  if (contacts.length === 0) {
    contactList.innerHTML += "<p>No contacts saved.</p>";
  } else {
    contacts.forEach((c, index) => {
      contactList.innerHTML += `
        <div class="contact-item">
          👤 <b>${c.name}</b> - 📞 ${c.phone}
          <button onclick="deleteContact(${index})">❌</button>
        </div>`;
    });
  }
}

function deleteContact(index) {
  contacts.splice(index, 1);
  localStorage.setItem("contacts", JSON.stringify(contacts));
  displayContacts();
}

// Alert button functionality
alertBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    output.innerHTML = "📡 Fetching your live location...";
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    output.innerHTML = "❌ Geolocation not supported by your browser.";
  }
});

function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Play alert sound
  alertSound.play();

  // Reverse geocode using OpenStreetMap
  const apiURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      const area = data.display_name;
      const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

      output.innerHTML = `
        ✅ <strong>Location Captured!</strong><br><br>
        📍 <b>Area:</b> ${area}<br><br>
        🌐 <a href="${mapLink}" target="_blank">View on Google Maps</a><br><br>
        🚨 Alert Sent to ${contacts.length} Emergency Contact(s)
      `;

      alert(`🚨 SOS Alert Sent!\nYour Location:\n${area}`);
    })
    .catch(() => {
      output.innerHTML = "⚠️ Unable to fetch area name. Please check your connection.";
    });
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      output.innerHTML = "❌ Permission denied for location access.";
      break;
    case error.POSITION_UNAVAILABLE:
      output.innerHTML = "⚠️ Location information unavailable.";
      break;
    case error.TIMEOUT:
      output.innerHTML = "⏰ Location request timed out.";
      break;
    default:
      output.innerHTML = "❗ An unknown error occurred.";
  }
}
