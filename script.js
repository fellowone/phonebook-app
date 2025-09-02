const contactList = document.getElementById("contactList");
const saveBtn = document.getElementById("saveBtn");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const contactIdInput = document.getElementById("contactId");
const searchInput = document.getElementById("search");

let contacts = [];

// Fetch initial data from mock JSON
async function fetchContacts() {
    try {
        const response = await fetch("contacts.json");
        if (!response.ok) throw new Error("Failed to fetch contacts");
        contacts = await response.json();
        renderContacts();
    } catch (error) {
        console.error(error);
        contactList.innerHTML = "<p style='color:red'>Failed to load contacts</p>";
    }
}

// Render contacts in UI
function renderContacts() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredContacts = contacts.filter(
        c => c.name.toLowerCase().includes(searchTerm) || c.phone.includes(searchTerm)
    );

    contactList.innerHTML = filteredContacts
        .map(contact => `
            <div class="contact-item">
                <span><strong>${contact.name}</strong> - ${contact.phone}</span>
                <div class="contact-actions">
                    <button class="edit-btn" onclick="editContact(${contact.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
                </div>
            </div>
        `)
        .join("");
}

// Save or Update contact
saveBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const id = contactIdInput.value;

    if (!name || !phone) {
        alert("Please fill in all fields");
        return;
    }

    if (id) {
        // Update existing contact
        contacts = contacts.map(contact =>
            contact.id === parseInt(id) ? { ...contact, name, phone } : contact
        );
    } else {
        // Add new contact
        contacts.push({
            id: Date.now(),
            name,
            phone
        });
    }

    nameInput.value = "";
    phoneInput.value = "";
    contactIdInput.value = "";
    renderContacts();
});

// Edit contact
function editContact(id) {
    const contact = contacts.find(c => c.id === id);
    nameInput.value = contact.name;
    phoneInput.value = contact.phone;
    contactIdInput.value = contact.id;
}

// Delete contact
function deleteContact(id) {
    contacts = contacts.filter(contact => contact.id !== id);
    renderContacts();
}

// Search contacts
searchInput.addEventListener("input", renderContacts);

// Initialize app
fetchContacts();
