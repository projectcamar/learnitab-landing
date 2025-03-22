'use client'

export default function Home() {
  return (
    <div dangerouslySetInnerHTML={{
      __html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Learnitab</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div id="background-image" class="background-image"></div>
    <div id="drop-zone" class="drop-zone">
    <div class="background-image"></div>
    <div class="blur-overlay"></div>
        
        <p>Drag your image here to change background</p>
    </div>
    <div class="top-right">
        <div id="fullscreen-switch" class="switch-container">
            <img src="src/assets/sidebar-icon/fullscreen.svg" alt="Fullscreen Mode" id="fullscreen-icon">
            <span class="icon-name">Fullscreen</span>
        </div>
        <div id="dark-mode-switch" class="switch-container">
            <img src="src/assets/sidebar-icon/moon.svg" alt="Dark Mode">
            <span class="icon-name">Dark Mode</span>
        </div>
        <button id="explore-opportunity" class="explore-btn">Explore Opportunity</button>
    </div>
    <div class="fullscreen-iframe" id="fullscreen-kanban">
        <span class="close-fullscreen">&times;</span>
        <iframe src="https://projectcamar.github.io/learnitab-kanban/" frameborder="0"></iframe>
    </div>
    <div class="fullscreen-iframe" id="fullscreen-breathe" style="display: none;">
        <span class="close-fullscreen">&times;</span>
        <img src="images/breathe.gif" alt="Breathe Animation" style="width: 100%; height: 100%; object-fit: contain;">
    </div>
    <div class="fullscreen-iframe" id="fullscreen-ramadhan" style="display: none;">
        <span class="close-fullscreen">&times;</span>
        <iframe src="https://learnitab.com/ramadhantracker" frameborder="0"></iframe>
    </div>
    <div class="sidebar">
        <div class="sidebar-icon-container" id="background-changer">
            <img src="src/assets/sidebar-icon/image.svg" alt="Change Background" class="sidebar-icon" data-emoji="🖼️">
            <span class="icon-name">Change Background</span>
        </div>
        <div class="sidebar-icon-container">
            <img src="src/assets/sidebar-icon/file.svg" alt="Google Docs" class="sidebar-icon" data-iframe-src="https://docs.google.com/document/u/0/" data-emoji="📝">
            <span class="icon-name">Google Docs</span>
        </div>
        <div class="sidebar-icon-container">
            <img src="src/assets/sidebar-icon/google-sheets.svg" alt="Google Sheet" class="sidebar-icon" data-iframe-src="https://docs.google.com/spreadsheets/" data-emoji="📊">
            <span class="icon-name">Google Sheet</span>
        </div>
        <div class="sidebar-icon-container">
            <img src="src/assets/sidebar-icon/pdf.svg" alt="Small PDF" class="sidebar-icon" data-iframe-src="https://smallpdf.com/pdf-tools/" data-emoji="📄">
            <span class="icon-name">Small PDF</span>
        </div>
        <div class="sidebar-icon-container">
            <img src="src/assets/sidebar-icon/canva.svg" alt="Canva" class="sidebar-icon" data-iframe-src="https://www.canva.com/features/" data-emoji="🎨">
            <span class="icon-name">Canva</span>
        </div>
        <div class="sidebar-icon-container">
            <img src="src/assets/sidebar-icon/kanban.svg" alt="Kanban Tracker" class="sidebar-icon" data-iframe-src="kanban.html" data-emoji="📋">
            <span class="icon-name">Kanban Tracker</span>
        </div>
        <div class="sidebar-icon-container">
            <img src="src/assets/sidebar-icon/calculator.svg" alt="Calculator" class="sidebar-icon" data-iframe-src="https://www.desmos.com/scientific" data-emoji="🔢">
            <span class="icon-name">Calculator</span>
        </div>
        <div class="sidebar-icon-container">
            <img src="src/assets/sidebar-icon/chatgpt.svg" alt="ChatGPT" class="sidebar-icon" data-iframe-src="https://chatgpt.com" data-emoji="🤖">
            <span class="icon-name">ChatGPT</span>
        </div>
        <div class="sidebar-icon-container">
            <img src="src/assets/sidebar-icon/music.svg" alt="Media: Spotify, Apple Music & Youtube" class="sidebar-icon" data-iframe-src="spotify.html" data-emoji="🎵">
            <span class="icon-name">Media: Spotify, Apple Music & Youtube</span>
        </div>
        <div class="sidebar-icon-container">
            <img src="src/assets/sidebar-icon/quillbot.svg" alt="Pomodoro" class="sidebar-icon" data-iframe-src="https://pomofocus.io/" data-emoji="⏰">
            <span class="icon-name">Pomodoro</span>
        </div>
        <div class="sidebar-icon-container">
            <img src="src/assets/sidebar-icon/calendar.svg" alt="Countdown Days" class="sidebar-icon" id="countdown-icon" data-emoji="📅">
            <span class="icon-name">Countdown Days</span>
        </div>
        <div class="sidebar-icon-container">
            <img src="src/assets/sidebar-icon/notion.svg" alt="Notion" class="sidebar-icon" data-iframe-src="https://www.notion.so/login" data-emoji="📔">
            <span class="icon-name">Notion</span>
        </div>
        <div class="sidebar-icon-container">
            <img src="src/assets/sidebar-icon/breathe.svg" alt="Breathe" class="sidebar-icon" data-emoji="🧘">
            <span class="icon-name">Breathe</span>
        </div>
        <div class="sidebar-icon-container">
            <img src="src/assets/sidebar-icon/moon.svg" alt="Ramadhan Tracker" class="sidebar-icon" data-emoji="🌙">
            <span class="icon-name">Ramadhan Tracker</span>
        </div>
    </div>

    <div class="cat-container">
        <img src="src/assets/catidle.gif" alt="Cat" id="cat-gif" class="cat-gif">
        <audio id="cat-spin-sound" preload="auto">
            <source src="src/assets/catspinningsound.mp3" type="audio/mpeg">
        </audio>
    </div>

    <div class="tools-list-hover-area"></div>
    <div id="tools-list" class="tools-list" style="display: none;">
        <div class="tool-icon-container">
            <img src="src/assets/sidebar-icon/file.svg" alt="Google Docs" class="tool-icon" data-iframe-src="https://docs.google.com/document/u/0/" data-emoji="📝">
            <span class="icon-name">Google Docs</span>
        </div>
        <div class="tool-icon-container">
            <img src="src/assets/sidebar-icon/google-sheets.svg" alt="Google Sheet" class="tool-icon" data-iframe-src="https://docs.google.com/spreadsheets/" data-emoji="📊">
            <span class="icon-name">Google Sheet</span>
        </div>
        <div class="tool-icon-container">
            <img src="src/assets/sidebar-icon/pdf.svg" alt="Small PDF" class="tool-icon" data-iframe-src="https://smallpdf.com/pdf-tools" data-emoji="📄">
            <span class="icon-name">Small PDF</span>
        </div>
        <div class="tool-icon-container">
            <img src="src/assets/sidebar-icon/canva.svg" alt="Canva" class="tool-icon" data-iframe-src="https://www.canva.com/features" data-emoji="🎨">
            <span class="icon-name">Canva</span>
        </div>
        <div class="tool-icon-container">
            <img src="src/assets/sidebar-icon/kanban.svg" alt="Kanban Tracker" class="tool-icon" data-iframe-src="https://projectcamar.github.io/learnitab-kanban/" data-emoji="📋">
            <span class="icon-name">Kanban Tracker</span>
        </div>
        <div class="tool-icon-container">
            <img src="src/assets/sidebar-icon/calculator.svg" alt="Calculator" class="tool-icon" data-iframe-src="https://www.desmos.com/scientific" data-emoji="🔢">
            <span class="icon-name">Calculator</span>
        </div>
        <div class="tool-icon-container">
            <img src="src/assets/sidebar-icon/chatgpt.svg" alt="ChatGPT" class="tool-icon" data-iframe-src="https://chatgpt.com" data-emoji="🤖">
            <span class="icon-name">ChatGPT</span>
        </div>
        <div class="tool-icon-container">
            <img src="src/assets/sidebar-icon/music.svg" alt="Media: Spotify, Apple Music & Youtube" class="tool-icon" data-iframe-src="spotify.html" data-emoji="🎵">
            <span class="icon-name">Media: Spotify, Apple Music & Youtube</span>
        </div>
        <div class="tool-icon-container">
            <img src="src/assets/sidebar-icon/quillbot.svg" alt="Pomodoro" class="tool-icon" data-iframe-src="https://pomofocus.io/" data-emoji="⏰">
            <span class="icon-name">Pomodoro</span>
        </div>
        <div class="tool-icon-container">
            <img src="src/assets/sidebar-icon/calendar.svg" alt="Countdown Days" class="tool-icon" id="countdown-icon-list" data-emoji="📅">
            <span class="icon-name">Countdown Days</span>
        </div>
        <div class="tool-icon-container" id="background-changer-list">
            <img src="src/assets/sidebar-icon/image.svg" alt="Change Background" class="tool-icon" data-emoji="🖼️">
            <span class="icon-name">Change Background</span>
        </div>
        <div class="tool-icon-container">
            <img src="src/assets/sidebar-icon/breathe.svg" alt="Breathe" class="tool-icon" data-emoji="🧘">
            <span class="icon-name">Breathe</span>
        </div>
        <div class="tool-icon-container">
            <img src="src/assets/sidebar-icon/moon.svg" alt="Ramadhan Tracker" class="tool-icon" data-emoji="🌙">
            <span class="icon-name">Ramadhan Tracker</span>
        </div>
    </div>
    

    <div id="welcome-screen" class="welcome-screen">
        <div class="onboarding-step" id="welcome-step">
            <div class="welcome-animation">
                <div class="floating-circles">
                    <div class="circle c1"></div>
                    <div class="circle c2"></div>
                    <div class="circle c3"></div>
                    <div class="circle c4"></div>
                    <div class="circle c5"></div>
                </div>
                <div class="shine-effect"></div>
            </div>
            <img src="images/Learnitab_Welcome.png" alt="Learnitab Logo" class="welcome-logo pulse-animation" draggable="false">
            <h1 class="welcome-title">Ready for Your Study Adventure?</h1>
            <p class="welcome-subtitle">Your Personal Study Space Awaits!</p>
            <button class="onboarding-button gradient-btn" data-next="step1">
                <span class="btn-text">Begin Journey</span>
                <span class="btn-icon">→</span>
            </button>
            <div class="decorative-dots">
                <div class="dot-row"></div>
                <div class="dot-row"></div>
                <div class="dot-row"></div>
            </div>
        </div>

        <div class="onboarding-step" id="step1" style="display: none;">
            <div class="welcome-animation">
                <div class="floating-circles">
                    <div class="circle c1" style="top: 70%; left: 10%; width: 150px; height: 150px;"></div>
                    <div class="circle c2" style="top: -30px; right: 20%; width: 100px; height: 100px;"></div>
                    <div class="circle c3" style="bottom: 15%; right: 5%; width: 120px; height: 120px;"></div>
                    <div class="circle c4" style="top: 30%; left: -20px; width: 90px; height: 90px;"></div>
                    <div class="circle c5" style="bottom: -20px; left: 30%; width: 110px; height: 110px;"></div>
                </div>
                <div class="shine-effect"></div>
            </div>
            <div class="onboarding-content" style="width: 50%; float: left; padding-right: 20px;">
                <h2>Your Dream Study Space is Here!</h2>
                <p>Imagine having everything you need for studying in one place - from Google Docs for notes, ChatGPT for homework help, to Spotify for study music. No more tab chaos, just pure focus!</p>
                <button class="onboarding-button" data-next="step2">Show Me More</button>
            </div>
            <div class="showcase-images">
                <img src="images/showcase1.jpg" alt="Showcase 1" class="showcase-img" draggable="false">
                <img src="images/showcase3.jpg" alt="Showcase 3" class="showcase-img" draggable="false">
                <img src="images/showcase4.jpg" alt="Showcase 4" class="showcase-img" draggable="false">
            </div>
            <img src="src/assets/add-icon/arrow.svg" class="guide-arrow" alt="Guide Arrow">
        </div>

        <div class="onboarding-step" id="step2" style="display: none;">
            <div class="welcome-animation">
                <div class="floating-circles">
                    <div class="circle c1" style="top: 20%; right: 15%; width: 130px; height: 130px;"></div>
                    <div class="circle c2" style="bottom: 40%; left: 5%; width: 110px; height: 110px;"></div>
                    <div class="circle c3" style="top: -40px; left: 30%; width: 150px; height: 150px;"></div>
                    <div class="circle c4" style="bottom: -30px; right: 25%; width: 120px; height: 120px;"></div>
                    <div class="circle c5" style="top: 50%; right: -20px; width: 100px; height: 100px;"></div>
                </div>
                <div class="shine-effect"></div>
            </div>
            <div class="onboarding-content">
                <h2>Level Up Your Student Life!</h2>
                <p>Want to stand out? Connect with amazing mentors and discover job opportunities that match your interests. Our Opportunity Portal helps you find remote, on-site, and visa sponsorship positions across all regions and job types!</p>
            </div>
            <div class="showcase-container">
                <img src="images/showcase2.jpg" alt="Showcase 2" class="showcase-img" style="width: 600px; height: auto; margin-left: 100px; margin-top: -30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" draggable="false">
            </div>
            <img src="src/assets/add-icon/arrow.svg" class="guide-arrow" alt="Guide Arrow">
            <button class="onboarding-button" data-next="name-step">Let's Make It Mine</button>
            <div class="privacy-policy-footer">
                By continuing, you agree to our <a href="https://learnitab.com/privacy" target="_blank">Terms of Service</a> and <a href="https://learnitab.com/privacy" target="_blank">Privacy Policy</a>
                <div class="privacy-settings">Your privacy matters – review our policy in settings</div>
            </div>
        </div>

        <div class="onboarding-step" id="name-step" style="display: none;">
            <div class="surreal-container">
                <div class="floating-elements">
                    <div class="float-item f1" style="top: 20%; right: 15%; width: 130px; height: 130px;"></div>
                    <div class="float-item f2" style="bottom: 40%; left: 5%; width: 110px; height: 110px;"></div>
                    <div class="float-item f3" style="top: -40px; left: 30%; width: 150px; height: 150px;"></div>
                    <div class="float-item f4" style="bottom: -30px; right: 25%; width: 120px; height: 120px;"></div>
                    <div class="float-item f5" style="top: 50%; right: -20px; width: 100px; height: 100px;"></div>
                </div>
                
                <div class="glowing-rings">
                    <div class="ring r1"></div>
                    <div class="ring r2"></div>
                    <div class="ring r3"></div>
                </div>

                <div class="name-content">
                    <h2 class="glitch-text" data-text="What Should We Call You?">What Should We Call You?</h2>
                    <p class="fade-text">Let's make this space truly yours!</p>
                    
                    <div class="input-wrapper">
                        <div class="input-highlight"></div>
                        <input type="text" id="name-input" placeholder="Your name here">
                        <div class="input-particles"></div>
                    </div>

                    <button id="name-submit" class="pulse-button">
                        <span class="button-text">Start My Journey</span>
                        <div class="button-particles"></div>
                    </button>
                </div>
            </div>
            <div class="privacy-policy-footer">
                By continuing, you agree to our <a href="https://learnitab.com/privacy" target="_blank">Terms of Service</a> and <a href="https://learnitab.com/privacy" target="_blank">Privacy Policy</a>
                <div class="privacy-settings">Your privacy matters – review our policy in settings</div>
            </div>
        </div>
    </div>

    <div id="main-content" class="main-content" style="display: none;">
        <div class="greeting" id="greeting">
            <span id="greeting-text"></span>
            <span id="user-name" class="editable-name" title="Click to edit">
                <span id="user-name-text"></span>
                <i class="fas fa-edit edit-icon"></i>
            </span>
            <span id="greeting-punctuation"></span>
        </div>
        <div id="name-edit-container" class="name-edit-container" style="display: none;">
            <input type="text" id="name-edit-input" class="name-edit-input">
            <button id="name-edit-save" class="name-edit-save">Save</button>
            <button id="name-edit-cancel" class="name-edit-cancel">Cancel</button>
        </div>
        <div class="date-weather">
            <span id="date"></span>
            <span class="weather-divider">•</span>
            <span id="temperature"></span>
        </div>
        <div id="time" class="time"></div>
        <div id="quote" class="quote">Loading quote...</div>
    <div class="search-hover-area"></div>
        <div class="search-container">
            <div class="search-bar">
                <input type="text" id="search-input" class="search-input" placeholder="Search anything...">
                <button id="search-button" class="search-button">
                    <img src="src/assets/add-icon/magnifying-glass.svg" alt="Search Icon" class="icon">
                </button>
            </div>
            <ul id="suggestions" class="suggestions"></ul>
        </div>

        <div class="add-item-container">
            <input type="text" class="add-item-input" placeholder="Write your list here...">
            <button class="list-toggle-button">
                <img src="src/assets/add-icon/angle-down.svg" alt="List Toggle Icon" class="icon" id="list-icon">
            </button>
        </div>

        <div class="shortcut-container">
            <div class="shortcuts-list"></div>
            <div id="add-shortcut-button" class="shortcut-icon add-shortcut-button" style="display: none;">
                <span class="plus-icon">+</span>
                <span class="shortcut-name">Add<br>Shortcut</span>
            </div>
        </div>

        <div class="list-content" id="list-content">
        </div>
    </div>
    <div id="card-mode" class="card-mode" style="display: none;">
        <div class="card" id="greeting-card">
            <h2>Greeting</h2>
            <div id="card-greeting"></div>
            <div id="card-date"></div>
            <div id="card-time"></div>
        </div>
        <div class="card" id="quote-card">
            <h2>Quote</h2>
            <div id="card-quote"></div>
        </div>
        <div class="card" id="search-card">
            <h2>Search</h2>
            <div id="card-search"></div>
        </div>
        <div class="card" id="list-card">
            <h2>To-Do List</h2>
            <div id="card-list"></div>
        </div>
    </div>
    <div id="iframe-container" style="display: none;">
        <div class="iframe-header">
            <div class="greeting-small" id="greeting-small">Hi, <span id="user-name-small"></span>!</div>
            <div class="student-dashboard">Opportunity Portal - Find remote, on-site, and visa sponsorship positions across all regions and job types.</div>
        </div>
        <iframe src="https://learnitab.com/app" frameborder="0"></iframe>
    </div>

    <div class="draggable" id="draggable-iframe-template" style="display: none;" data-last-accessed="">
        <div class="draggable-header">
            <span class="draggable-title-container">
                <span class="draggable-title" style="color: #fff;">Draggable iFrame</span>
            </span>
            <div class="icons">
                <i class="fas fa-window-minimize minimize-btn"></i>
                <i class="fas fa-times close-btn"></i>
            </div>
        </div>
        <iframe frameborder="0"></iframe>
    </div>

    <div class="custom-context-menu" id="context-menu">
        <ul>
            <li id="minimize-all">Minimize All Tabs</li>
            <li id="close-all-tabs">Close All Tabs</li>
            <li id="explore-opportunity-context" class="bold-text">Explore Opportunity</li>
            <li id="open-google-docs">Google Docs</li>
            <li id="open-spotify">Open Spotify</li>
            <li id="open-calculator">Open Calculator</li>
            <li id="open-chatgpt">Open ChatGPT</li>
            <li id="open-kanban">Kanban Tracker</li>
            <li id="change-background">Change Background</li>
            <li id="open-countdown">Countdown Days</li>
        </ul>
    </div>
    <div id="background-modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <div class="modal-header">
            <h2>Choose a Background</h2>
                <div class="add-custom-btn">
                    <input type="file" id="custom-bg-upload" accept="image/*" style="display: none;">
                    <label for="custom-bg-upload">
                        <i class="fas fa-plus"></i> Add Custom Background
                    </label>
                </div>
            </div>
            
            <!-- Single background container without nested divs -->
            <div class="background-options">
                <!-- Regular backgrounds -->
                <div class="background-option" data-bg="images/1.gif">
                    <div class="background-preview" style="background-image: url('images/1.png');"></div>
                </div>
                <div class="background-option" data-bg="images/2.gif">
                    <div class="background-preview" style="background-image: url('images/2.png');"></div>
                </div>
                <div class="background-option" data-bg="images/3.gif">
                    <div class="background-preview" style="background-image: url('images/3.png');"></div>
                </div>
                <div class="background-option" data-bg="images/4.gif">
                    <div class="background-preview" style="background-image: url('images/4.png');"></div>
                </div>
                <div class="background-option" data-bg="images/5.gif">
                    <div class="background-preview" style="background-image: url('images/5.png');"></div>
                </div>
                <div class="background-option" data-bg="images/6.gif">
                    <div class="background-preview" style="background-image: url('images/6.png');"></div>
                </div>
                <div class="background-option" data-bg="images/7.gif">
                    <div class="background-preview" style="background-image: url('images/7.png');"></div>
                </div>
                <div class="background-option" data-bg="images/8.gif">
                    <div class="background-preview" style="background-image: url('images/8.png');"></div>
                </div>
                <div class="background-option" data-bg="images/9.gif">
                    <div class="background-preview" style="background-image: url('images/9.png');"></div>
                </div>
                <div class="background-option" data-bg="images/10.gif">
                    <div class="background-preview" style="background-image: url('images/10.png');"></div>
                </div>
                <div class="background-option" data-bg="images/11.gif">
                    <div class="background-preview" style="background-image: url('images/11.png');"></div>
                </div>
                <div class="background-option" data-bg="images/12.gif">
                    <div class="background-preview" style="background-image: url('images/12.png');"></div>
                </div>
                <div class="background-option" data-bg="images/13.gif">
                    <div class="background-preview" style="background-image: url('images/13.png');"></div>
                </div>
                <div class="background-option" data-bg="images/14.gif">
                    <div class="background-preview" style="background-image: url('images/14.png');"></div>
                </div>
                <div class="background-option" data-bg="images/15.gif">
                    <div class="background-preview" style="background-image: url('images/15.png');"></div>
                </div>
                
                <!-- New static PNG backgrounds -->
                <div class="background-option" data-bg="images/bg_1.png">
                    <div class="background-preview" style="background-image: url('images/bg_1.png');"></div>
                </div>
                <div class="background-option" data-bg="images/bg_2.png">
                    <div class="background-preview" style="background-image: url('images/bg_2.png');"></div>
                </div>
                <div class="background-option" data-bg="images/bg_3.png">
                    <div class="background-preview" style="background-image: url('images/bg_3.png');"></div>
                </div>
                
                <!-- Video backgrounds section divider -->
                <div class="video-section-divider"></div>
                
                <!-- Video backgrounds -->
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="nQRFSKnG000">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/nQRFSKnG000/0.jpg');"></div>
                    <span class="youtube-label">Study with Enhypen</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="ANuQjiEMMcU">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/ANuQjiEMMcU/0.jpg');"></div>
                    <span class="youtube-label">Study with Bangchan</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="8fUStnj06II">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/8fUStnj06II/0.jpg');"></div>
                    <span class="youtube-label">Study with BTS</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="IrHlDvCdEhk">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/IrHlDvCdEhk/0.jpg');"></div>
                    <span class="youtube-label">Study with IVE</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="kNPihHVBBOQ">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/kNPihHVBBOQ/0.jpg');"></div>
                    <span class="youtube-label">Study with NCT</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="kD1wOiq9Abs">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/kD1wOiq9Abs/0.jpg');"></div>
                    <span class="youtube-label">Study ENHYPEN Jay</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="QFfZlBdAhgs">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/QFfZlBdAhgs/0.jpg');"></div>
                    <span class="youtube-label">Hyunjin Stray Kids</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="e5pC8Eg6vt0">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/e5pC8Eg6vt0/0.jpg');"></div>
                    <span class="youtube-label">Study with Minji NewJeans</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="UqyE--PPQLE">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/UqyE--PPQLE/0.jpg');"></div>
                    <span class="youtube-label">Suga BTS</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="anU4bUUFvPw">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/anU4bUUFvPw/0.jpg');"></div>
                    <span class="youtube-label">Study w/ AESPA</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="TBJVvyMBDdk">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/TBJVvyMBDdk/0.jpg');"></div>
                    <span class="youtube-label">Study w/ BTS</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="ghaFWN4bGyA">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/ghaFWN4bGyA/0.jpg');"></div>
                    <span class="youtube-label">Study with Ryujin Red Velvet</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="EYpwvrJlV-s">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/EYpwvrJlV-s/0.jpg');"></div>
                    <span class="youtube-label">Felix Stray Kids</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="FGLrDT4xrLo">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/FGLrDT4xrLo/0.jpg');"></div>
                    <span class="youtube-label">Study with EXO</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="grCmdIxPHFc">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/grCmdIxPHFc/0.jpg');"></div>
                    <span class="youtube-label">Study with TXT</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="94xotVEfIM0">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/94xotVEfIM0/0.jpg');"></div>
                    <span class="youtube-label">Study w/ Blackpink</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="xIrQbb3GFoY">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/xIrQbb3GFoY/0.jpg');"></div>
                    <span class="youtube-label">Study with SKZ</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="UcvqDaXHing">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/UcvqDaXHing/0.jpg');"></div>
                    <span class="youtube-label">Study w/ SKZ 2</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="CGhWkVgxI2U">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/CGhWkVgxI2U/0.jpg');"></div>
                    <span class="youtube-label">SKZ Hanjisung</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="CFQzQN9P23w">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/CFQzQN9P23w/0.jpg');"></div>
                    <span class="youtube-label">Study with SKZ</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="t0ud3Eet1yo">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/t0ud3Eet1yo/0.jpg');"></div>
                    <span class="youtube-label">Study with Seventeen</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="FCam_mAqXi8">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/FCam_mAqXi8/0.jpg');"></div>
                    <span class="youtube-label">BTS V Kim Taehyung</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="wHVyZjqw2EM">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/wHVyZjqw2EM/0.jpg');"></div>
                    <span class="youtube-label">BTS X Blackpink Study</span>
                </div>
                
                <!-- New Ambience section divider -->
                <div class="video-section-divider-2"></div>
                
                <!-- Ambience video backgrounds -->
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="MLm07I49RiE" data-unmute="true">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/MLm07I49RiE/0.jpg');"></div>
                    <span class="youtube-label">Sky</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="5OQawXs9X1o" data-unmute="true">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/5OQawXs9X1o/0.jpg');"></div>
                    <span class="youtube-label">Milky Way Galaxy</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="A9Hi0mn85Eg" data-unmute="true">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/A9Hi0mn85Eg/0.jpg');"></div>
                    <span class="youtube-label">Japan Night Walk</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="qmN1Gf8rRc8" data-unmute="true">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/qmN1Gf8rRc8/0.jpg');"></div>
                    <span class="youtube-label">Japan Aerial</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="KjkZspnLHoI" data-unmute="true">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/KjkZspnLHoI/0.jpg');"></div>
                    <span class="youtube-label">Japan Countryside</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="CxwJrzEdw1U" data-unmute="true">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/CxwJrzEdw1U/0.jpg');"></div>
                    <span class="youtube-label">Norway 4K</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="KOc146R8sws" data-unmute="true">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/KOc146R8sws/0.jpg');"></div>
                    <span class="youtube-label">Norway Relaxation</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="N-TV_6eIDxw" data-unmute="true">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/N-TV_6eIDxw/0.jpg');"></div>
                    <span class="youtube-label">Aurora</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="Da9S9yjZZP4" data-unmute="true">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/Da9S9yjZZP4/0.jpg');"></div>
                    <span class="youtube-label">Novigrad</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="gP9sGBywjks" data-unmute="true">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/gP9sGBywjks/0.jpg');"></div>
                    <span class="youtube-label">Rain Storm</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="SiryvrStb8E" data-unmute="true">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/SiryvrStb8E/0.jpg');"></div>
                    <span class="youtube-label">Tokyo Raining Night</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="kZN2yTa1HcY" data-unmute="true">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/kZN2yTa1HcY/0.jpg');"></div>
                    <span class="youtube-label">Japan Cherry Blossoms</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="DPyOZB62Rh0" data-unmute="true">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/DPyOZB62Rh0/0.jpg');"></div>
                    <span class="youtube-label">Downtown Seoul</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="pQzt0sQ3Pio" data-unmute="true">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/pQzt0sQ3Pio/0.jpg');"></div>
                    <span class="youtube-label">Kyoto Morning</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="AEE5vALCqKc" data-unmute="true">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/AEE5vALCqKc/0.jpg');"></div>
                    <span class="youtube-label">Japan Cherry Blossom Seasons 2</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="gosjiD288Jk" data-unmute="true">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/gosjiD288Jk/0.jpg');"></div>
                    <span class="youtube-label">Celestial Relaxation</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="AgpWX18dby4" data-unmute="true">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/AgpWX18dby4/0.jpg');"></div>
                    <span class="youtube-label">Oceanscapes</span>
                </div>
                <div class="background-option youtube-bg" data-bg-type="youtube" data-video-id="wnhvanMdx4s" data-unmute="true">
                    <div class="youtube-preview" style="background-image: url('https://img.youtube.com/vi/wnhvanMdx4s/0.jpg');"></div>
                    <span class="youtube-label">Earth from Space</span>
                </div>
            </div>
        </div>
    </div>
    <script src="script.js"></script>
    <div id="countdown-modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Add Countdown</h2>
            <form id="countdown-form">
                <input type="text" id="event-title" placeholder="Event Title" required>
                <input type="text" id="event-link" placeholder="Add link (optional)">
                <input type="date" id="event-date" required>
                <button type="submit">Add Countdown</button>
            </form>
        </div>
    </div>
    
    <!-- Add this container for the countdown bubbles -->
    <div id="countdown-bubbles-container"></div>
    
    <!-- Add this modal for editing countdown -->
    <div id="edit-countdown-modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Edit Countdown</h2>
            <form id="edit-countdown-form">
                <input type="text" id="edit-event-title" placeholder="Event Title" required>
                <input type="text" id="edit-event-link" placeholder="Add link (optional)">
                <input type="date" id="edit-event-date" required>
                <button type="submit">Update Countdown</button>
            </form>
        </div>
    </div>
    <div class="toggle-switch-container" style="display: none;">
        <span>Sidebar</span>
        <label class="switch">
            <input type="checkbox" id="toggle-tools-mode">
            <span class="slider round"></span>
        </label>
        <span>Tools List</span>
    </div>
    <div class="switches-hover-area"></div>
    <div id="add-edit-shortcuts-switch" class="switch-container hideable-switch">
        <img src="src/assets/sidebar-icon/edit.svg" alt="Add/Edit Shortcuts">
        <span class="icon-name">Add/Edit Shortcuts</span>
    </div>
    <div id="settings-switch" class="settings-switch switch-container hideable-switch">
        <img src="src/assets/sidebar-icon/settings.svg" alt="Settings">
        <span class="icon-name">Settings</span>
    </div>
    <div id="mode-switch" class="mode-switch switch-container">
        <img src="src/assets/sidebar-icon/tools-list.svg" alt="Switch Mode" id="mode-switch-icon">
        <span class="icon-name">Switch Layout</span>
    </div>

<div id="shortcut-modal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Edit Shortcut</h2>
        <form id="shortcut-form">
            <div class="shortcut-form-group">
                <label for="shortcut-name">Name:</label>
                <input type="text" id="shortcut-name" placeholder="Shortcut Name" required>
            </div>
            <div class="shortcut-form-group">
                <label for="shortcut-link">URL:</label>
                <input type="text" id="shortcut-link" placeholder="google.com" required>
            </div>
            <div class="shortcut-buttons">
                <button type="button" id="shortcut-cancel">Cancel</button>
                <button type="submit" id="shortcut-save">Save</button>
            </div>
        </form>
    </div>
</div>
<div id="settings-modal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Settings</h2>
        <div class="settings-container">
            <!-- Appearance Settings Group -->
            <div class="settings-group">
                <h3>Appearance Settings</h3>
                <div class="setting-item">
                    <label for="background-blur">Background Blur</label>
                    <div class="setting-tooltip">Adjust the blur intensity of your background image</div>
                    <input type="range" id="background-blur" min="0" max="20" step="1" value="0">
                </div>
                
                <div class="setting-item">
                    <label for="flip-background">Flip Background Mirror</label>
                    <div class="setting-tooltip">Mirror your background image horizontally</div>
                    <label class="switch">
                        <input type="checkbox" id="flip-background">
                        <span class="slider round"></span>
                    </label>
                </div>
                
                <div class="setting-item">
                    <label for="cinematic-mode">Cinematic Mode</label>
                    <div class="setting-tooltip">Adds cinematic black bars at the top and bottom of the screen when idle</div>
                    <label class="switch">
                        <input type="checkbox" id="cinematic-mode">
                        <span class="slider round"></span>
                    </label>
                </div>
                
                <div class="setting-item">
                    <label for="show-cat">Show Cat</label>
                    <div class="setting-tooltip">Show/hide the interactive cat at the bottom of the screen</div>
                    <label class="switch">
                        <input type="checkbox" id="show-cat" checked>
                        <span class="slider round"></span>
                    </label>
                </div>
                
                <div class="setting-item">
                    <label for="icon-style">Icon Style</label>
                    <div class="setting-tooltip">Choose between default icons or emoji style for all application icons</div>
                    <select id="icon-style" class="settings-select">
                        <option value="default">Default Icons</option>
                        <option value="emoji">Emoji Style</option>
                    </select>
                </div>
            </div>

            <!-- Content Settings Group -->
            <div class="settings-group">
                <h3>Content & Features</h3>
                <div class="setting-item">
                    <label for="show-quotes">Show Quotes</label>
                    <div class="setting-tooltip">Toggle visibility of inspirational quotes on your dashboard</div>
                    <label class="switch">
                        <input type="checkbox" id="show-quotes" checked>
                        <span class="slider round"></span>
                    </label>
                </div>
                
                <div class="setting-item">
                    <label for="quote-type">Quote Type</label>
                    <div class="setting-tooltip">Choose the type of quotes to display: motivational, religious, or humorous</div>
                    <select id="quote-type" class="settings-select">
                        <option value="motivational">Motivational Quote</option>
                        <option value="bible">Bible Verse</option>
                        <option value="quran">Qur'an Verse</option>
                        <option value="joke">Random Joke</option>
                        <option value="stoic">Stoic Quote</option>
                    </select>
                </div>
                
                <div class="setting-item">
                    <label for="show-add-item">Show Add Item</label>
                    <div class="setting-tooltip">Toggle visibility of the to-do list input field</div>
                    <label class="switch">
                        <input type="checkbox" id="show-add-item" checked>
                        <span class="slider round"></span>
                    </label>
                </div>
                
                <div class="setting-item">
                    <label for="show-btc">Bitcoin Price Tracker</label>
                    <div class="setting-tooltip">Show/hide the Bitcoin price widget with real-time updates</div>
                    <label class="switch">
                        <input type="checkbox" id="show-btc">
                        <span class="slider round"></span>
                    </label>
                </div>
                
                <div class="setting-item">
                    <label for="use-chrome-defaults">Use Chrome Defaults Search</label>
                    <div class="setting-tooltip">Use Chrome's default search behavior instead of custom search</div>
                    <label class="switch">
                        <input type="checkbox" id="use-chrome-defaults">
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>

            <!-- Data Management Group -->
            <div class="settings-group">
                <h3>Data Management</h3>
                <div class="setting-item import-export">
                    <label>Import/Export Data</label>
                    <div class="setting-tooltip">
                        Backup or restore your personal data including shortcuts, background preferences, settings configuration, and countdown events
                    </div>
                    <div class="import-export-buttons">
                        <button id="export-data" class="data-btn">
                            <i class="fas fa-download"></i>
                            Export User Data
                        </button>
                        <button id="import-data" class="data-btn">
                            <i class="fas fa-upload"></i>
                            Import User Data
                        </button>
                        <input type="file" id="import-file" style="display: none;" accept=".json">
                    </div>
                </div>
            </div>

            <!-- About/Connect Section -->
            <div class="settings-group">
                <h3>About & Connect</h3>
                <div class="setting-item">
                    <p>Your feedback shapes Learnitab's future! Please share your thoughts through our <a href="https://forms.gle/sTDsqTb1Us7Qxvyg6" target="_blank" style="color: white; font-weight: bold;">feedback form</a> and connect with us on social media for the latest updates and features.</p>
                    <div class="social-media-icons" style="display: flex; gap: 10px;">
                        <a href="https://discord.gg/rXRza3Wn" target="_blank" title="Join us on Discord">
                            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="#7289DA" viewBox="0 0 24 24"><path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.444.864-.608 1.249-1.844-.276-3.68-.276-5.486 0-.164-.393-.405-.874-.617-1.249a.077.077 0 0 0-.079-.037c-1.6.3-3.15.822-4.885 1.515a.07.07 0 0 0-.032.027C.533 9.045-.32 13.579.099 18.057a.082.082 0 0 0 .031.055c2.052 1.5 4.033 2.422 5.992 3.029a.077.077 0 0 0 .084-.027c.461-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.041-.104c-.652-.249-1.27-.555-1.87-.892a.077.077 0 0 1-.008-.127c.126-.094.252-.192.373-.291a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .079.009c.121.099.247.197.373.291a.077.077 0 0 1-.007.127 12.298 12.298 0 0 1-1.87.891.076.076 0 0 0-.042.105c.36.699.772 1.364 1.226 1.993a.076.076 0 0 0 .084.028c1.959-.607 3.94-1.53 5.992-3.029a.077.077 0 0 0 .031-.055c.5-5.177-.838-9.661-3.548-13.661a.06.06 0 0 0-.031-.027zM8.02 15.331c-1.182 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.174 1.085 2.156 2.418 0 1.334-.955 2.419-2.156 2.419zm7.974 0c-1.182 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.174 1.085 2.156 2.418 0 1.334-.946 2.419-2.156 2.419z"/></svg>
                        </a>
                        <a href="https://www.instagram.com/learnitab/" target="_blank" title="Follow us on Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#E4405F" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                              </svg>
                        </a>
                        <a href="https://www.linkedin.com/company/learnitab" target="_blank" title="Connect with us on LinkedIn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#0077B5" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.137 1.445-2.137 2.939v5.667h-3.554V8.997h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V8.997h3.564v11.455zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                        </a>
                    </div>
                </div>
            </div>

            <div class="settings-group">
                <h3>Support</h3>
                <div class="setting-item support-plea">
                    <div class="support-header">
                        <i class="fas fa-heart pulse-heart" style="color: #ff6b6b; font-size: 24px; margin-right: 10px;"></i>
                        <h4 style="margin: 0; color: #ff6b6b;">Help Keep Learnitab Alive!</h4>
                    </div>
                    <p>Learnitab is and will <span style="font-weight: bold; text-decoration: underline;">always be completely free</span> for everyone! But servers aren't free, and we're running on pure passion (and coffee ☕). If you've found value in Learnitab, consider supporting us with any amount you can. Every contribution helps us keep the lights on and continue making your study experience amazing!</p>
                    <div class="support-buttons" style="display: flex; flex-direction: column; gap: 12px; margin-top: 15px;">
                        <a href="https://saweria.co/learnitab" target="_blank" class="support-button" style="text-decoration: none; padding: 10px 15px; background: linear-gradient(135deg, #4a4a4a, #333); color: white; border-radius: 6px; text-align: center; font-weight: bold; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: all 0.3s ease;">
                            <i class="fas fa-mug-hot" style="margin-right: 8px;"></i>Buy us a coffee via Saweria
                        </a>
                        <a href="https://sociabuzz.com/learnitab/donate" style="text-decoration: none; padding: 10px 15px; background: linear-gradient(135deg, #4a4a4a, #333); color: white; border-radius: 6px; text-align: center; font-weight: bold; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: all 0.3s ease;">
                            <i class="fas fa-hand-holding-heart" style="margin-right: 8px;"></i>Support via SociaBuzz
                        </a>
                    </div>
                </div>
            </div>

            <!-- Privacy Policy text at the bottom, outside any section -->
            <p style="margin-top: 20px; font-size: 14px; color: #aaa; text-align: center; border-top: 1px solid #444; padding-top: 15px;">
                By using Learnitab, you agree to our <a href="https://learnitab.com/privacy" target="_blank" style="color: #ccc; text-decoration: underline;">Terms of Service</a> and <a href="https://learnitab.com/privacy" target="_blank" style="color: #ccc; text-decoration: underline;">Privacy Policy</a>. Your privacy is important to us.
            </p>
            <div class="rating-container" style="margin-top: 15px; background: linear-gradient(135deg, #4a4a4a, #333); border-radius: 8px; padding: 12px; text-align: center;">
                <p style="margin: 0 0 10px 0;">Enjoying Learnitab? Please rate us in the Chrome Web Store!</p>
                <a href="https://chromewebstore.google.com/detail/learnitabproductivity-das/gpfbhkcbpgghppecgkdnipkmnojaeblj" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #1a73e8; color: white; text-decoration: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; transition: background-color 0.2s;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>
                    Rate us 5 stars
                </a>
            </div>
        </div>
    </div>
</div>
</div>
<div class="btc-widget">
    <span class="close-btn">&times;</span>
    <div class="btc-price">Loading...</div>
    <div class="btc-updated"></div>
</div>
</div>
</div>
<audio id="hover-sound" preload="auto">
    <source src="src/assets/tick.mp3" type="audio/mpeg">
    <source src="src/assets/tick.wav" type="audio/wav">
</audio>
</body>
</html>
      `
    }} />
  )
}
