// Add a testimonial to Firestore
async function addTestimonial() {
    try {
        await db.collection("testimonials").add({
            name: "Sarah T.",
            role: "New Mom",
            content: "NurtureNest has been a lifesaver for me!",
            imageUrl: "./images/user1.jpg"
        });
        console.log("Testimonial added successfully!");
    } catch (error) {
        console.error("Error adding testimonial: ", error);
    }
}

// Fetch testimonials from Firestore
async function fetchTestimonials() {
    const testimonialsContainer = document.querySelector('.testimonial-cards');

    // Clear existing content (to avoid duplicates)
    testimonialsContainer.innerHTML = "";

    try {
        const querySnapshot = await db.collection("testimonials").get();

        if (querySnapshot.empty) {
            testimonialsContainer.innerHTML = `<p>No testimonials found.</p>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            const testimonial = doc.data();
            testimonialsContainer.innerHTML += `
                <div class="testimonial-card">
                    <div class="testimonial-content">
                        <p>${testimonial.content}</p>
                    </div>
                    <div class="testimonial-author">
                        <img src="${testimonial.imageUrl}" alt="${testimonial.name}">
                        <h4>${testimonial.name}</h4>
                        <p>${testimonial.role}</p>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error fetching testimonials: ", error);
        testimonialsContainer.innerHTML = `<p>Failed to load testimonials. Please try again later.</p>`;
    }
}

// Call fetchTestimonials when the page loads
document.addEventListener("DOMContentLoaded", fetchTestimonials);