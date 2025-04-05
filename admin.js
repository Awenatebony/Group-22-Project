// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-HC-5-Z7N32SMTsUNISuSqA9tu4usFvU",
    authDomain: "nurturenest-b3ab7.firebaseapp.com",
    projectId: "nurturenest-b3ab7",
    storageBucket: "nurturenest-b3ab7.firebasestorage.app",
    messagingSenderId: "480414547609",
    appId: "1:480414547609:web:bca93b40591950e14bc208",
    measurementId: "G-920MTMSFFR"
};

try {
    // Add testimonial to Firestore (without image)
    await db.collection("testimonials").add({
        name: "Test Name",
        role: "Test Role",
        content: "Test Content",
        imageUrl: "https://example.com/test.jpg"
    });

    console.log("Testimonial added to Firestore!"); // Debugging
    alert("Testimonial added successfully!");
} catch (error) {
    console.error("Error adding testimonial: ", error);
    alert("Failed to add testimonial. Please try again.");
}

// Handle testimonial form submission
document.getElementById("testimonialForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value.trim();
    const role = document.getElementById("role").value.trim();
    const content = document.getElementById("content").value.trim();
    const imageFile = document.getElementById("image").files[0]; // Get the uploaded file

    console.log("Form values:", { name, role, content, imageFile }); // Debugging

    // Basic validation
    if (!name || !role || !content || !imageFile) {
        alert("Please fill out all fields and upload an image.");
        return;
    }

    try {
        console.log("Uploading image to Firebase Storage..."); // Debugging

        // Upload the image to Firebase Storage
        const storageRef = storage.ref(`images/${imageFile.name}`);
        const uploadTask = storageRef.put(imageFile);

        // Wait for the upload to complete
        await new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                null, // No progress handler
                (error) => {
                    console.error("Error uploading image:", error); // Debugging
                    reject(error);
                },
                () => resolve() // Upload complete
            );
        });

        console.log("Image uploaded successfully!"); // Debugging

        // Get the public URL of the uploaded image
        const imageUrl = await storageRef.getDownloadURL();
        console.log("Image URL:", imageUrl); // Debugging

        // Add testimonial to Firestore
        await db.collection("testimonials").add({
            name,
            role,
            content,
            imageUrl
        });

        console.log("Testimonial added to Firestore!"); // Debugging

        // Show success message
        alert("Testimonial added successfully!");

        // Clear the form
        document.getElementById("testimonialForm").reset();
    } catch (error) {
        console.error("Error adding testimonial: ", error);
        alert("Failed to add testimonial. Please try again.");
    }
});