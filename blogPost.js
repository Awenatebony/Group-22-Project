// Fetch blog posts from Firestore
async function fetchBlogPosts() {
    const blogPostsContainer = document.querySelector('.blog-cards');

    // Clear existing content (to avoid duplicates)
    blogPostsContainer.innerHTML = "";

    try {
        const querySnapshot = await db.collection("blogPosts").get();

        if (querySnapshot.empty) {
            blogPostsContainer.innerHTML = `<p>No blog posts found.</p>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            const blogPost = doc.data();
            blogPostsContainer.innerHTML += `
                <div class="blog-card">
                    <img src="${blogPost.imageUrl}" alt="${blogPost.title}">
                    <div class="blog-content">
                        <h3>${blogPost.title}</h3>
                        <p>${blogPost.content}</p>
                        <a href="#" class="blog-btn">Read More</a>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error fetching blog posts: ", error);
        blogPostsContainer.innerHTML = `<p>Failed to load blog posts. Please try again later.</p>`;
    }
}

// Call fetchBlogPosts when the page loads
document.addEventListener("DOMContentLoaded", fetchBlogPosts);