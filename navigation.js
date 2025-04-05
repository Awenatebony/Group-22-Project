// script.js
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// FAQ Section Interactivity
document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
        const faqItem = question.parentElement;
        faqItem.classList.toggle("active");
    });
});





// Handle contact form submission
document.getElementById("contactForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // Basic validation
    if (!name || !email || !subject || !message) {
        alert("Please fill out all fields.");
        return;
    }

    try {
        // Save the message to Firestore
        await db.collection("messages").add({
            name,
            email,
            subject,
            message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp() // Add timestamp
        });

        // Show success message
        alert("Message sent successfully!");

        // Clear the form
        document.getElementById("contactForm").reset();
    } catch (error) {
        console.error("Error sending message: ", error);
        alert("Failed to send message. Please try again.");
    }
});

// Handle newsletter form submission
document.getElementById("newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("newsletterEmail").value.trim();

    if (!email) {
        alert("Please enter your email.");
        return;
    }

    console.log("Subscribed email:", email); // Replace with your logic (e.g., save to Firestore)
    alert("Thank you for subscribing!");

    // Clear the form
    document.getElementById("newsletterForm").reset();
});




document.addEventListener("DOMContentLoaded", function () {
    const navItems = document.querySelectorAll(".nav-links ul li");

    navItems.forEach((item) => {
        item.addEventListener("mouseenter", () => {
            const megaMenu = item.querySelector(".mega-menu");
            if (megaMenu) {
                megaMenu.style.display = "block";
            }
        });

        item.addEventListener("mouseleave", () => {
            const megaMenu = item.querySelector(".mega-menu");
            if (megaMenu) {
                megaMenu.style.display = "none";
            }
        });
    });
});


