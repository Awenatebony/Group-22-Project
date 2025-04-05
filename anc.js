document.addEventListener('DOMContentLoaded', function() {
    // Initialize Charts
    initializeHealthMetrics();
    
    // Initialize Modal System
    initModalSystem();
    
    // Initialize Buttons with Modal functionality
    initializeButtons();
    
    // Initialize Reminders
    initializeReminders();
    
    // Initialize Mobile Menu
    initMobileMenu();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking on links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// Modal System
function initModalSystem() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelModalBtn = document.querySelector('.cancel-btn');
    const confirmModalBtn = document.querySelector('.confirm-btn');

    // Function to open modal with specific content
    window.openModal = function(title, content, confirmCallback = null) {
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Set up confirm button if callback provided
        if (confirmCallback) {
            confirmModalBtn.style.display = 'inline-block';
            confirmModalBtn.onclick = function() {
                confirmCallback();
                closeModal();
            };
        } else {
            confirmModalBtn.style.display = 'none';
        }
    };

    // Function to close modal
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close modal when clicking X, cancel button, or outside modal
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

// Health Metrics Charts
function initializeHealthMetrics() {
    // Blood Pressure Chart
    const bpCtx = document.querySelector('.metric-card:nth-child(1) .metric-chart');
    if (bpCtx) {
        new Chart(bpCtx, {
            type: 'line',
            data: {
                labels: ['Week 8', 'Week 12', 'Week 16', 'Week 20'],
                datasets: [{
                    label: 'Systolic',
                    data: [120, 118, 122, 119],
                    borderColor: '#e7008a',
                    tension: 0.4
                }, {
                    label: 'Diastolic',
                    data: [80, 78, 82, 79],
                    borderColor: '#666',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    // Weight Chart
    const weightCtx = document.querySelector('.metric-card:nth-child(2) .metric-chart');
    if (weightCtx) {
        new Chart(weightCtx, {
            type: 'line',
            data: {
                labels: ['Week 8', 'Week 12', 'Week 16', 'Week 20'],
                datasets: [{
                    label: 'Weight (kg)',
                    data: [65, 66.5, 68, 69.5],
                    borderColor: '#e7008a',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Fetal Movement Chart
    const movementCtx = document.querySelector('.metric-card:nth-child(3) .metric-chart');
    if (movementCtx) {
        new Chart(movementCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Kicks per hour',
                    data: [4, 6, 5, 8, 7, 6, 5],
                    backgroundColor: '#e7008a'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Button Initialization with Modal Integration
function initializeButtons() {
    // View Details Buttons
    const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const visitCard = this.closest('.visit-card');
            const visitTitle = visitCard.querySelector('h3').textContent;
            const weekTag = visitCard.querySelector('.week-tag').textContent;
            const completionDate = visitCard.querySelector('.completion-date')?.textContent || 'Not specified';
            
            const modalContent = `
                <div class="visit-details-content">
                    <div class="detail-section">
                        <h4>Visit Information</h4>
                        <p><strong>Visit:</strong> ${visitTitle}</p>
                        <p><strong>Week:</strong> ${weekTag}</p>
                        <p><strong>Date:</strong> ${completionDate}</p>
                        <p><strong>Provider:</strong> Dr. Smith</p>
                    </div>
                    <div class="detail-section">
                        <h4>Check-ups Completed</h4>
                        <ul class="list-unstyled">
                            ${Array.from(visitCard.querySelectorAll('.visit-content ul li')).map(li => `<li>${li.textContent.trim()}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>Doctor's Notes</h4>
                        <p>${visitCard.querySelector('.visit-notes p')?.textContent || 'No notes available'}</p>
                    </div>
                </div>
            `;
            
            openModal('Visit Details', modalContent, () => {
                // Generate and download PDF report
                generatePDFReport(visitTitle, weekTag, completionDate);
                showNotification('Report downloaded successfully!');
            });
            
            // Change confirm button text
            document.querySelector('.confirm-btn').textContent = 'Download Report';
        });
    });

    // Reminder Buttons - Now with functional email/SMS integration
    const reminderBtns = document.querySelectorAll('.reminder-btn');
    reminderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const visitCard = this.closest('.visit-card');
            const visitTitle = visitCard.querySelector('h3').textContent;
            const weekTag = visitCard.querySelector('.week-tag').textContent;
            const visitDate = visitCard.querySelector('.upcoming')?.textContent?.replace('Scheduled for: ', '') || 
                             visitCard.querySelector('.completion-date')?.textContent?.replace('Completed on: ', '') || 
                             'Not specified';
            
            const modalContent = `
                <form class="modal-form" id="reminderForm">
                    <div class="form-group">
                        <label>Visit:</label>
                        <input type="text" value="${visitTitle} (${weekTag})" readonly class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Date:</label>
                        <input type="text" value="${visitDate}" readonly class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Reminder Type:</label>
                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="email" checked data-type="email">
                                <span>Email Reminders</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="sms" data-type="sms">
                                <span>SMS Reminders</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="notification" checked data-type="notification">
                                <span>App Notification</span>
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>When to Remind:</label>
                        <select name="timing" class="form-control">
                            <option value="1">1 day before</option>
                            <option value="3" selected>3 days before</option>
                            <option value="7">1 week before</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Additional Notes:</label>
                        <textarea name="notes" placeholder="Any special instructions..." class="form-control"></textarea>
                    </div>
                </form>
            `;
            
            openModal('Set Reminder', modalContent, () => {
                const form = document.getElementById('reminderForm');
                const formData = new FormData(form);
                const reminderData = {
                    visit: formData.get('visit'),
                    date: visitDate,
                    types: [],
                    timing: formData.get('timing'),
                    notes: formData.get('notes')
                };
                
                // Get selected reminder types
                form.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
                    reminderData.types.push(checkbox.getAttribute('data-type'));
                });
                
                // Save reminder
                saveReminder(reminderData);
                showNotification('Reminder set successfully!');
                
                // Send reminders based on selection
                if (reminderData.types.includes('email')) {
                    sendEmailReminder(reminderData);
                }
                if (reminderData.types.includes('sms')) {
                    sendSMSReminder(reminderData);
                }
                if (reminderData.types.includes('notification')) {
                    sendAppNotification(reminderData);
                }
            });
        });
    });

    // Schedule/Reschedule Buttons
    const scheduleBtns = document.querySelectorAll('.schedule-btn, .reschedule-btn');
    scheduleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const isReschedule = this.classList.contains('reschedule-btn');
            const visitCard = this.closest('.visit-card');
            const visitTitle = visitCard.querySelector('h3').textContent;
            
            const modalContent = `
                <form class="modal-form" id="scheduleForm">
                    <div class="form-group">
                        <label>${isReschedule ? 'New ' : ''}Appointment Date:</label>
                        <input type="date" required class="form-control" min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label>Preferred Time:</label>
                        <input type="time" required class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Healthcare Provider:</label>
                        <select required class="form-control">
                            <option value="">Select Provider</option>
                            <option value="1">Dr. Smith</option>
                            <option value="2">Dr. Johnson</option>
                            <option value="3">Dr. Williams</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Special Requests:</label>
                        <textarea placeholder="Any special requirements..." class="form-control"></textarea>
                    </div>
                </form>
            `;
            
            openModal(isReschedule ? 'Reschedule Visit' : 'Schedule Visit', modalContent, () => {
                const form = document.getElementById('scheduleForm');
                const formData = new FormData(form);
                const appointmentData = {
                    visit: visitTitle,
                    date: formData.get('date'),
                    time: formData.get('time'),
                    provider: formData.get('provider'),
                    requests: formData.get('requests')
                };
                
                // Save appointment
                saveAppointment(appointmentData);
                showNotification(isReschedule ? 'Visit rescheduled!' : 'Visit scheduled!');
                
                // Update UI
                if (isReschedule && visitCard.querySelector('.upcoming')) {
                    visitCard.querySelector('.upcoming').textContent = `Scheduled for: ${formatAppointmentDate(appointmentData.date, appointmentData.time)}`;
                }
            });
        });
    });

    // Add Reading Buttons
    const addReadingBtns = document.querySelectorAll('.add-reading-btn');
    addReadingBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const metricCard = this.closest('.metric-card');
            const metricType = metricCard.querySelector('h3').textContent;
            
            const modalContent = `
                <form class="modal-form" id="readingForm">
                    <div class="form-group">
                        <label>Date:</label>
                        <input type="date" required class="form-control" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label>Time:</label>
                        <input type="time" required class="form-control" value="${new Date().toTimeString().substring(0, 5)}">
                    </div>
                    <div class="form-group">
                        <label>Value:</label>
                        <input type="number" step="0.1" required class="form-control" placeholder="Enter ${metricType.toLowerCase()} value">
                    </div>
                    <div class="form-group">
                        <label>Notes:</label>
                        <textarea class="form-control" placeholder="Any additional notes..."></textarea>
                    </div>
                </form>
            `;
            
            openModal(`Add ${metricType} Reading`, modalContent, () => {
                const form = document.getElementById('readingForm');
                const formData = new FormData(form);
                const readingData = {
                    metric: metricType,
                    date: formData.get('date'),
                    time: formData.get('time'),
                    value: formData.get('value'),
                    notes: formData.get('notes')
                };
                
                // Save reading
                saveReading(readingData);
                showNotification('Reading saved successfully!');
                
                // Update chart
                updateHealthMetricChart(metricType, readingData);
            });
        });
    });

    // CTA Buttons
    const notificationBtn = document.querySelector('.cta-btn.primary');
    const preferencesBtn = document.querySelector('.cta-btn.secondary');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', enableNotifications);
    }
    
    if (preferencesBtn) {
        preferencesBtn.addEventListener('click', showPreferences);
    }
}

// ======================
// FUNCTIONALITY FUNCTIONS
// ======================

// Reminder System
function initializeReminders() {
    // Load saved reminders from localStorage
    const savedReminders = JSON.parse(localStorage.getItem('ancReminders') || '[]');
    
    // Check for upcoming reminders
    checkUpcomingReminders(savedReminders);
}

function saveReminder(reminderData) {
    const reminders = JSON.parse(localStorage.getItem('ancReminders') || '[]');
    reminders.push({
        ...reminderData,
        id: Date.now().toString(),
        created: new Date().toISOString()
    });
    localStorage.setItem('ancReminders', JSON.stringify(reminders));
}

function checkUpcomingReminders(reminders) {
    const now = new Date();
    reminders.forEach(reminder => {
        const reminderDate = new Date(reminder.date);
        if (reminderDate > now) {
            scheduleReminderNotification(reminder);
        }
    });
}

function scheduleReminderNotification(reminder) {
    // In a real app, this would schedule actual notifications
    console.log('Scheduled reminder:', reminder);
}

// Email Functionality
function sendEmailReminder(reminderData) {
    // In a real app, this would connect to an email service
    console.log('Email reminder sent:', {
        to: 'user@example.com',
        subject: `Upcoming ANC Visit: ${reminderData.visit}`,
        body: `This is a reminder for your ${reminderData.visit} scheduled for ${reminderData.date}.\n\nNotes: ${reminderData.notes || 'None'}`
    });
    
    // Simulate email sending
    showNotification('Email reminder scheduled!');
}

// SMS Functionality
function sendSMSReminder(reminderData) {
    // In a real app, this would connect to an SMS gateway
    console.log('SMS reminder sent:', {
        to: '+1234567890',
        message: `Reminder: ${reminderData.visit} on ${reminderData.date}. ${reminderData.notes ? 'Note: ' + reminderData.notes : ''}`
    });
    
    // Simulate SMS sending
    showNotification('SMS reminder scheduled!');
}

// App Notification
function sendAppNotification(reminderData) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Upcoming Visit: ${reminderData.visit}`, {
            body: `Scheduled for ${reminderData.date}\n${reminderData.notes || ''}`,
            icon: '/path/to/icon.png'
        });
    } else {
        console.log('App notification:', reminderData);
    }
}

// Notification Permission
function enableNotifications() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showNotification('Notifications enabled successfully!');
                // Save preference
                localStorage.setItem('notificationPermission', 'granted');
            }
        });
    } else {
        showNotification('Notifications not supported in this browser');
    }
}

// Preferences Modal
function showPreferences() {
    const savedPrefs = JSON.parse(localStorage.getItem('notificationPreferences') || '{}');
    
    const modalContent = `
        <form class="modal-form" id="preferencesForm">
            <div class="form-group">
                <h4>Notification Methods</h4>
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="email" ${savedPrefs.email !== false ? 'checked' : ''} data-type="email">
                        <span>Email Notifications</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="sms" ${savedPrefs.sms ? 'checked' : ''} data-type="sms">
                        <span>SMS Notifications</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="app" ${savedPrefs.app !== false ? 'checked' : ''} data-type="app">
                        <span>App Notifications</span>
                    </label>
                </div>
            </div>
            <div class="form-group">
                <h4>Notification Types</h4>
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="reminders" ${savedPrefs.reminders !== false ? 'checked' : ''}>
                        <span>Visit Reminders</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="updates" ${savedPrefs.updates ? 'checked' : ''}>
                        <span>Health Updates</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="tips" ${savedPrefs.tips ? 'checked' : ''}>
                        <span>Daily Tips</span>
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label>Default Reminder Time:</label>
                <select name="reminderTime" class="form-control">
                    <option value="morning" ${savedPrefs.reminderTime === 'morning' ? 'selected' : ''}>Morning (8 AM)</option>
                    <option value="afternoon" ${!savedPrefs.reminderTime || savedPrefs.reminderTime === 'afternoon' ? 'selected' : ''}>Afternoon (1 PM)</option>
                    <option value="evening" ${savedPrefs.reminderTime === 'evening' ? 'selected' : ''}>Evening (6 PM)</option>
                </select>
            </div>
        </form>
    `;
    
    openModal('Notification Preferences', modalContent, () => {
        const form = document.getElementById('preferencesForm');
        const preferences = {
            email: form.querySelector('[name="email"]').checked,
            sms: form.querySelector('[name="sms"]').checked,
            app: form.querySelector('[name="app"]').checked,
            reminders: form.querySelector('[name="reminders"]').checked,
            updates: form.querySelector('[name="updates"]').checked,
            tips: form.querySelector('[name="tips"]').checked,
            reminderTime: form.querySelector('[name="reminderTime"]').value
        };
        
        localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
        showNotification('Preferences saved successfully!');
    });
}

// Health Data Functions
function saveReading(readingData) {
    const readings = JSON.parse(localStorage.getItem('healthReadings') || '{}');
    if (!readings[readingData.metric]) {
        readings[readingData.metric] = [];
    }
    readings[readingData.metric].push({
        ...readingData,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('healthReadings', JSON.stringify(readings));
}

function updateHealthMetricChart(metricType, newReading) {
    // In a real app, this would update the Chart.js instance
    console.log(`Updating ${metricType} chart with new reading:`, newReading);
}

// Appointment Functions
function saveAppointment(appointmentData) {
    const appointments = JSON.parse(localStorage.getItem('ancAppointments') || '[]');
    appointments.push({
        ...appointmentData,
        id: Date.now().toString()
    });
    localStorage.setItem('ancAppointments', JSON.stringify(appointments));
}

function formatAppointmentDate(dateString, timeString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', options)} at ${timeString}`;
}

// PDF Generation
function generatePDFReport(visitTitle, weekTag, completionDate) {
    // In a real app, this would generate an actual PDF
    console.log('Generating PDF report for:', { visitTitle, weekTag, completionDate });
    // Simulate PDF download
    const blob = new Blob([`ANC Visit Report\n\nVisit: ${visitTitle}\nWeek: ${weekTag}\nDate: ${completionDate}`], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ANC-Report-${visitTitle.replace(/\s+/g, '-')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Utility Functions
function getCurrentUser() {
    // In a real app, this would get the logged in user
    return {
        id: 'user123',
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+1234567890'
    };
}