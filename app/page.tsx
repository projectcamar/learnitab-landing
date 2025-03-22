'use client'

export default function Home() {
  return (
    <div dangerouslySetInnerHTML={{
      __html: `
<!DOCTYPE html>
<html>
<head>
    <title>Learnitab</title>
    <!-- External Dependencies -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/89/three.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/css/bootstrap.css" rel="stylesheet">
    <!-- Add Plus Jakarta Sans font -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Add FontAwesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <style>
        body {
            color: white;
            margin: 0;
            text-align: center;
            background-color: black;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }
        canvas {
            display: block;
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 0;
        }
        p {
            color: rgba(255,255,255, 0.5)
        }
        .header {
            /* Remove this class entirely from styles since we'll handle this in sections */
        }
        .footer {
            /* Remove this class entirely from styles since we'll handle this in sections */
        }
        .description {
            color: gray;
            padding-top: 50px;
        }
        a, a:hover, a:visited {
            color: white;
            text-decoration: none;
        }
        .disable-selection {
            -moz-user-select: none;
            -ms-user-select: none;
            -khtml-user-select: none;
            -webkit-user-select: none;
            -webkit-touch-callout: none;
        }
        h1::after {
            content: ' Beta';
            font-size: 12px;
            position: absolute;
            top: 3px;
            padding-left: 5px;
            font-weight: 400;
        }
        h2::after {
            content: '2';
            font-size: 12px;
            position: absolute;
            top: 14px;
            padding-left: 5px;
        }
        .btn {
            border-radius: 100px;
            padding: 10px 25px;
        }
        .sections-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow-y: auto;
            scroll-snap-type: y mandatory;
            z-index: 1;
        }

        .section {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            scroll-snap-align: start;
            position: relative;
            padding: 20px;
        }

        .content-section {
            background-color: transparent;
            padding: 2rem;
            max-width: 900px;
            width: 90%;
            margin: 0 auto;
            border: none;
            box-shadow: none;
        }

        #hero {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .features-container {
            position: relative;
            height: 100vh;
            overflow-y: auto;
            scroll-snap-type: y mandatory;
            -ms-overflow-style: none;
            scrollbar-width: none;
            scroll-behavior: smooth;
            background: transparent;
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .features-container::-webkit-scrollbar {
            display: none;
        }

        .features-page {
            height: 100vh;
            scroll-snap-align: start;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2.5rem;
            max-width: 1000px;
            margin: 0 auto;
            justify-content: center;
            padding: 1rem;
        }

        .feature-card {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-width: 450px;         /* Added max-width to cards */
            margin: 0 auto;           /* Center cards */
        }

        .feature-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 12px;
            transition: all 0.3s ease;
        }

        .feature-card:hover .feature-image {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .feature-content {
            text-align: left;
        }

        .nav-dots {
            position: fixed;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 3;
        }

        .nav-dot {
            width: 12px;
            height: 12px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            margin: 10px 0;
            cursor: pointer;
            transition: 0.3s;
        }

        .nav-dot.active {
            background: #fff;
        }

        :root {
            --primary: #F02050;
            --primary-darker: #d01040;
            --background: rgba(0, 0, 0, 0.8);
            --card-background: rgba(15, 15, 15, 0.9);
        }

        .btn {
            background: var(--primary);
            border: none;
            padding: 0.875rem 1.5rem;
            font-weight: 500;
            letter-spacing: 0.3px;
            transition: all 0.2s ease;
            text-transform: none;
            position: relative;
            overflow: hidden;
        }

        .btn:hover {
            background: var(--primary-darker);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(240, 32, 80, 0.3);
        }

        .btn::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
            background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
            background-repeat: no-repeat;
            background-position: 50%;
            transform: scale(10, 10);
            opacity: 0;
            transition: transform .3s, opacity .5s;
        }

        .btn:active::after {
            transform: scale(0, 0);
            opacity: .3;
            transition: 0s;
        }

        h1 {
            font-size: 4rem;
            font-weight: 800;
            letter-spacing: -0.5px;
            margin-bottom: 1.5rem;
            background: linear-gradient(to right, #fff, #ccc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 30px rgba(0,0,0,0.5);
        }

        h2 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 2rem;
            background: linear-gradient(to right, #fff, #ccc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 20px rgba(0,0,0,0.5);
        }

        h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: rgba(255, 255, 255, 0.9);
            text-shadow: 0 0 15px rgba(0,0,0,0.5);
        }

        p {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.7;
            font-size: 1.1rem;
            text-shadow: 0 0 10px rgba(0,0,0,0.3);
        }

        .small {
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 2rem;
        }

        .nav-dots {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 50px;
            backdrop-filter: blur(8px);
        }

        .nav-dot {
            width: 10px;
            height: 10px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .nav-dot:hover {
            background: rgba(255, 255, 255, 0.5);
        }

        .nav-dot.active {
            background: var(--primary);
            box-shadow: 0 0 10px var(--primary);
        }

        .contact-info {
            display: grid;
            gap: 1rem;
            margin-top: 2rem;
            padding: 1.5rem;
            background: transparent;
            border: none;
        }

        .contact-info p {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: rgba(255, 255, 255, 0.8);
        }

        #hero .content-section {
            text-align: center;
            max-width: 900px;
            position: relative;
            z-index: 2;
        }

        #about .content-section {
            text-align: center;
        }

        .section {
            padding: 4rem 2rem;
        }

        /* Smooth scrolling for the whole page */
        .sections-container {
            scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        .sections-container::-webkit-scrollbar {
            width: 8px;
        }

        .sections-container::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
        }

        .sections-container::-webkit-scrollbar-thumb {
            background: var(--primary);
            border-radius: 4px;
        }

        .sections-container::-webkit-scrollbar-thumb:hover {
            background: var(--primary-darker);
        }

        .button-group {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
        }

        .btn-primary {
            background: #9333EA;
            color: white;
            border: none;
            position: relative;
            z-index: 1;
        }

        .btn-primary:hover {
            background: #7928CA;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(147, 51, 234, 0.3);
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(8px);
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .btn {
            padding: 0.75rem 1.5rem;
            font-weight: 500;
            transition: all 0.2s ease;
            white-space: nowrap;
        }

        #features .content-section {
            max-width: 1200px;        /* Increased section max-width */
            padding: 0;               /* Remove padding */
            width: 100%;             /* Full width */
        }

        #features h2 {
            margin-bottom: 1rem;      /* Reduced margin */
            position: absolute;       /* Position title above cards */
            top: 2rem;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            text-align: center;
            z-index: 1;
        }

        @media (max-width: 1024px) {
            .features-grid {
                grid-template-columns: 1fr;  /* Single column on smaller screens */
            }
        }

        .contact-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            margin: 2rem 0;  /* Reduced from 3rem to 2rem */
        }

        .contact-item {
            text-align: center;
            padding: 2rem;
            transition: transform 0.3s ease;
        }

        .contact-item:hover {
            transform: translateY(-5px);
        }

        .contact-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(147, 51, 234, 0.1);
            border-radius: 50%;
            transition: background 0.3s ease;
        }

        .contact-item:hover .contact-icon {
            background: rgba(147, 51, 234, 0.2);
        }

        .contact-icon i {
            font-size: 24px;
            color: #9333EA;
        }

        .contact-item:hover .contact-icon i {
            transform: scale(1.1);
            transition: transform 0.3s ease;
        }

        .contact-item h3 {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
            color: rgba(255, 255, 255, 0.9);
        }

        .contact-item p {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.7);
            margin: 0;
        }

        .cta-section {
            text-align: center;
            margin-top: 2rem;  /* Reduced from 3rem to 2rem */
        }

        .cta-section h3 {
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
            color: rgba(255, 255, 255, 0.9);
        }

        @media (max-width: 768px) {
            .contact-grid {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }

            .contact-item {
                padding: 1.5rem;
            }
        }

        .features-container {
            position: relative;
            height: 100vh;
            overflow-y: auto;
            scroll-snap-type: y mandatory;
            -ms-overflow-style: none;
            scrollbar-width: none;
            scroll-behavior: smooth;
            background: transparent;
        }

        .section {
            overflow: hidden; /* Prevent scrolling outside of sections */
        }

        .contact-icon img {
            display: none;
        }

        .contact-section-wrapper {
            display: flex;
            flex-direction: column;
            gap: 1rem;  /* Add some gap between elements */
        }

        #contact .content-section {
            padding-top: 1rem;  /* Reduce top padding */
        }

        #contact h2 {
            margin-bottom: 1rem;  /* Reduce bottom margin of the heading */
        }

        #contact > .content-section > p {
            margin-bottom: 1rem;  /* Reduce margin below the description */
        }

        .about-wrapper {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin: 2rem auto;
            max-width: 1200px;
            text-align: left;
            background: rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 1.5rem;
            padding: 2rem;
            height: auto; /* Remove any fixed height */
        }

        .about-left {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .about-text {
            background: rgba(147, 51, 234, 0.05);
            padding: 1.25rem;
            border-radius: 1rem;
            border: 1px solid rgba(147, 51, 234, 0.1);
            height: auto; /* Remove any fixed height */
        }

        .about-text p {
            font-size: 0.95rem;
            line-height: 1.4;
            margin: 0;
        }

        .purple-text {
            color: #9333EA;
            margin-bottom: 0.5rem;
            font-size: 1.25rem;
        }

        .highlight {
            color: #9333EA;
            font-weight: 500;
        }

        .benefits-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .benefits-list li {
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.1rem;
            line-height: 1.5;
            display: flex;
            align-items: flex-start; /* Align to top */
            gap: 0.5rem;
            padding-right: 1rem; /* Add some right padding */
        }

        .about-footer {
            text-align: center;
            margin-top: 1rem;
            padding: 0 1rem 2rem; /* Add bottom padding */
            font-size: 0.95rem;
            line-height: 1.4;
        }

        @media (max-width: 768px) {
            .about-wrapper {
                grid-template-columns: 1fr;
                gap: 1.5rem;
                padding: 1.5rem;
                margin: 1rem;
            }

            #about.section {
                padding: 2rem 1rem;
            }

            .benefits-list li {
                font-size: 1rem;
                padding-right: 0.5rem;
            }

            .about-text p {
                font-size: 0.9rem;
            }
        }

        .btn-with-icon {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-wave {
            position: relative;
        }

        .btn-wave::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            border-radius: 100px;
            background: #9333EA;
            transform: translate(-50%, -50%);
            z-index: -1;
            animation: buttonWave 2s infinite;
        }

        @keyframes buttonWave {
            0% {
                width: 100%;
                height: 100%;
                opacity: 0.5;
            }
            70% {
                width: 130%;
                height: 130%;
                opacity: 0;
            }
            100% {
                width: 100%;
                height: 100%;
                opacity: 0;
            }
        }

        .chrome-icon {
            font-size: 1.2rem;
        }

        .about-container {
            position: relative;
            height: 100vh;
            overflow-y: auto;
            scroll-snap-type: y mandatory;
            -ms-overflow-style: none;
            scrollbar-width: none;
            scroll-behavior: smooth;
            background: transparent;
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .about-container::-webkit-scrollbar {
            display: none;
        }

        .about-page {
            height: 100vh;
            scroll-snap-align: start;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }

        .about-text {
            background: rgba(147, 51, 234, 0.05);
            padding: 2rem;
            border-radius: 1rem;
            border: 1px solid rgba(147, 51, 234, 0.1);
            max-width: 800px;
            margin: 0 auto;
            text-align: left;
        }

        /* Update existing about styles */
        #about .content-section {
            padding: 0;
            max-width: 100%;
        }

        #about h2 {
            position: absolute;
            top: 2rem;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
            margin: 0;
        }

        .about-footer {
            text-align: center;
        }

        @media (max-width: 768px) {
            .about-text {
                padding: 1.5rem;
                margin: 1rem;
            }
        }

        .about-text-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        @media (max-width: 768px) {
            .about-text-container {
                grid-template-columns: 1fr;
                gap: 1.5rem;
                padding: 0 1rem;
            }
        }

        .final-message {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 70vh;
            text-align: center;
            background: rgba(147, 51, 234, 0.1);
            padding: 2rem;
        }

        .message-block {
            margin: 2rem 0;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .highlight-large {
            font-size: 2.5rem;
            font-weight: 800;
            line-height: 1.2;
            background: linear-gradient(45deg, #9333EA, #7928CA);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 30px rgba(147, 51, 234, 0.3);
            display: block;
        }

        .message-small {
            font-size: 1.4rem;
            color: rgba(255, 255, 255, 0.9);
            margin: 1rem 0;
            font-weight: 500;
            display: block;
        }

        @media (max-width: 768px) {
            .highlight-large {
                font-size: 2rem;
            }
            
            .message-small {
                font-size: 1.1rem;
            }

            .message-block {
                margin: 1.5rem 0;
            }

            .final-message {
                padding: 1rem;
            }
        }

        .cinema-bars {
            position: fixed;
            left: 0;
            width: 100%;
            height: 15vh;
            background: #000;
            z-index: 10;
            transition: transform 0.5s ease;
        }

        .cinema-bar-top {
            top: 0;
            transform: translateY(-100%);
        }

        .cinema-bar-bottom {
            bottom: 0;
            transform: translateY(100%);
        }

        .show-cinema-bars .cinema-bar-top {
            transform: translateY(0);
        }

        .show-cinema-bars .cinema-bar-bottom {
            transform: translateY(0);
        }

        /* Add/update these mobile responsive styles */
        @media (max-width: 768px) {
            h1 {
                font-size: 2.5rem; /* Smaller heading for mobile */
                margin-bottom: 1rem;
            }
            
            h2 {
                font-size: 2rem;
            }
            
            .small {
                font-size: 1rem;
            }
            
            .button-group {
                flex-direction: column;
                gap: 1rem;
                padding: 0 1rem;
            }
            
            .btn {
                width: 100%;
                margin: 0;
            }
            
            .feature-card {
                padding: 1rem;
            }
            
            .feature-image {
                height: 150px; /* Smaller images on mobile */
            }
            
            .features-grid {
                grid-template-columns: 1fr; /* Single column on mobile */
                gap: 1.5rem;
                padding: 1rem;
                margin-top: 4rem; /* Add space for the title */
            }
            
            .contact-grid {
                grid-template-columns: 1fr;
                gap: 1.5rem;
                padding: 1rem;
            }
            
            .nav-dots {
                right: 10px; /* Move dots closer to edge on mobile */
            }
            
            .sections-container {
                height: 100%;
                overflow-y: auto;
            }
            
            .section {
                min-height: 100vh;
                padding: 2rem 1rem;
            }
            
            .content-section {
                width: 100%;
                padding: 1rem;
            }

            #features h2 {
                font-size: 1.8rem;
                padding: 0 1rem;
            }

            .feature-content h3 {
                font-size: 1.3rem;
            }

            .feature-content p {
                font-size: 1rem;
            }

            .features-page {
                padding: 1rem;
                height: auto;
                min-height: 100vh;
            }
        }

        #contact .about-wrapper {
            margin-top: 2rem;
            gap: 1.5rem;
        }

        #contact .about-text {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        #contact .benefits-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        #contact .benefits-list li {
            display: flex;
            align-items: center;
            gap: 1rem;
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.9);
        }

        #contact .benefits-list i {
            font-size: 1.2rem;
        }

        @media (max-width: 768px) {
            #contact .about-wrapper {
                grid-template-columns: 1fr;
                margin: 1rem;
                padding: 1.5rem;
            }
        }

        .music-control {
            width: 12px;  /* Match dot size */
            height: 12px; /* Match dot size */
            border-radius: 50%;
            background: rgba(147, 51, 234, 0.2);
            border: none;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin-bottom: 1rem;
            backdrop-filter: blur(8px);
            transition: all 0.3s ease;
        }

        .music-control:hover {
            background: rgba(147, 51, 234, 0.3);
            transform: scale(1.1);
        }

        .music-control i {
            font-size: 8px; /* Smaller icon size */
        }

        @media (max-width: 768px) {
            .music-control {
                width: 10px;  /* Match mobile dot size */
                height: 10px; /* Match mobile dot size */
            }
            
            .music-control i {
                font-size: 6px; /* Even smaller icon for mobile */
            }
        }

        .logo {
            width: 80px;
            height: auto;
            margin: 0 auto;
            display: block;
            position: relative;
            z-index: 2;
        }

        #rotating-text {
            font-weight: 700;  /* Makes the text bold */
        }
    </style>
</head>
<body>
    <audio id="backgroundMusic" loop autoplay>
        <source src="https://od.lk/s/OTZfMTAwMzI2Mzk3Xw/Is%20It%20The%20Answer%20-%20Reality%20Club.mp3" type="audio/mp3">
    </audio>

    <div class="cinema-bar-top cinema-bars"></div>
    <div class="cinema-bar-bottom cinema-bars"></div>

    <div class="sections-container">
        <section class="section" id="hero">
            <div class="content-section">
                <img src="/images/Logo%20Learnitab.png" alt="Learnitab Logo" class="logo">
                <h1><strong>Learnitab</strong></h1>
                <p class="small"><strong><span id="rotating-text">Productivity</span></strong> at Your Fingertips</p>
                <div class="button-group">
                    <a href="https://chromewebstore.google.com/detail/learnitab-your-all-in-one/gpfbhkcbpgghppecgkdnipkmnojaeblj" 
                       class="btn btn-primary btn-with-icon btn-wave">
                        <i class="fab fa-chrome chrome-icon"></i>
                        Add to Chrome
                    </a>
                    <a href="https://learnitab.com/app" 
                       class="btn btn-secondary">
                        Learnitab Opportunity Portal #KaburAjaDulu
                    </a>
                </div>
            </div>
        </section>

        <section class="section" id="features">
            <div class="content-section">
                <h2>Explore the Learnitab Universe</h2>
                <div class="features-container">
                    <!-- First Scroll -->
                    <div class="features-page">
                        <div class="features-grid">
                            <div class="feature-card">
                                <img src="https://learnitab.com/images/Learnitab_page-0001.jpg" alt="Time Management" class="feature-image">
                                <div class="feature-content">
                                    <h3>⏰ Time Management</h3>
                                    <p>Stay on top of your tasks with our intelligent Todo List and visualize important dates with Countdown Timers.</p>
                                </div>
                            </div>
                            <div class="feature-card">
                                <img src="https://learnitab.com/images/Learnitab_page-0002.jpg" alt="Student Tools" class="feature-image">
                                <div class="feature-content">
                                    <h3>🎯 Student Tools</h3>
                                    <p>Access KBBI, Gramatika, Wikipedia, Scientific Calculator, and Pomodoro Timer all in one place for seamless studying.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Second Scroll -->
                    <div class="features-page">
                        <div class="features-grid">
                            <div class="feature-card">
                                <img src="https://learnitab.com/images/Learnitab_page-0003.jpg" alt="AI Assistance" class="feature-image">
                                <div class="feature-content">
                                    <h3>🤖 AI Assistance</h3>
                                    <p>Get instant help with research, writing, and problem-solving using integrated ChatGPT and Google Gemini.</p>
                                </div>
                            </div>
                            <div class="feature-card">
                                <img src="https://learnitab.com/images/Learnitab_page-0004.jpg" alt="Spotify Integration" class="feature-image">
                                <div class="feature-content">
                                    <h3>🎵 Spotify Integration</h3>
                                    <p>Access your favorite study playlists without leaving your dashboard, creating the perfect ambiance for productive work.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Third Scroll -->
                    <div class="features-page">
                        <div class="features-grid">
                            <div class="feature-card">
                                <img src="https://learnitab.com/images/Learnitab_page-0005.jpg" alt="Personalization" class="feature-image">
                                <div class="feature-content">
                                    <h3>🎨 Personalization</h3>
                                    <p>Set the perfect mood for your study sessions with customizable backgrounds and choose between Dark/Light Mode for comfort.</p>
                                </div>
                            </div>
                            <div class="feature-card">
                                <img src="https://learnitab.com/images/Learnitab_page-0006.jpg" alt="Dual-Mode Interface" class="feature-image">
                                <div class="feature-content">
                                    <h3>🔄 Dual-Mode Interface</h3>
                                    <p>Choose between Focus Mode for distraction-free work and Explore Opportunity Mode to discover new possibilities and resources.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section" id="about">
            <div class="content-section">
                <h2>About Learnitab</h2>
                <div class="about-container">
                    <!-- First Scroll - Vision & Mission Together -->
                    <div class="about-page">
                        <div class="about-text-container">
                            <div class="about-text">
                                <h3 class="purple-text">Our Vision</h3>
                                <p>To cultivate a generation of <span class="highlight">well-prepared</span>, <span class="highlight">highly skilled</span> graduates who are not just job-ready, but poised to become innovators and leaders in the global marketplace.</p>
                            </div>
                            <div class="about-text">
                                <h3 class="purple-text">Our Mission</h3>
                                <p>To <span class="highlight">empower global students</span> by providing a comprehensive platform that bridges the gap between academic learning and real-world skills. We aim to <span class="highlight">nurture personal growth</span>, enhance productivity, and create pathways to opportunities.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Second Scroll -->
                    <div class="about-page">
                        <div class="about-text">
                            <h3 class="purple-text">Why Learnitab?</h3>
                            <ul class="benefits-list">
                                <li>✓ Centralized study dashboard for enhanced productivity</li>
                                <li>✓ AI-powered tools for personalized learning assistance</li>
                                <li>✓ Career development resources and opportunities</li>
                                <li>✓ Seamless integration of academic and practical skills</li>
                                <li>✓ Community-driven platform for peer support and collaboration</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Third Scroll -->
                    <div class="about-page">
                        <div class="about-text final-message">
                            <div class="about-footer">
                                <div class="message-block">
                                    <span class="highlight-large">Join us in revolutionizing the way</span>
                                    <span class="highlight-large">students learn and grow</span>
                                    <span class="message-small">With Learnitab, you're not just studying;</span>
                                    <span class="highlight-large">you're building your future</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section" id="contact">
            <div class="content-section">
                <h2>Get in Touch</h2>
                <p>Have questions or want to collaborate? We'd love to hear from you!</p>
                
                <div class="about-wrapper">
                    <div class="about-text">
                        <h3 class="purple-text">Email</h3>
                        <a href="mailto:learnitab@gmail.com" style="text-decoration: none;">
                            <p>learnitab@gmail.com</p>
                        </a>
                    </div>
                    
                    <div class="about-text">
                        <h3 class="purple-text">Social Media</h3>
                        <div class="benefits-list">
                            <a href="https://instagram.com/learnitab" target="_blank" style="text-decoration: none;">
                                <li>
                                    <i class="fab fa-instagram" style="color: #9333EA"></i>
                                    @learnitab
                                </li>
                            </a>
                            <a href="https://www.linkedin.com/company/learnitab" target="_blank" style="text-decoration: none;">
                                <li>
                                    <i class="fab fa-linkedin-in" style="color: #9333EA"></i>
                                    Learnitab
                                </li>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="cta-section">
                    <h3>Ready to innovate with us?</h3>
                    <a href="mailto:learnitab@gmail.com" class="btn btn-primary">Start a Conversation</a>
                </div>
            </div>
        </section>

        <section class="section" id="footer">
            <div class="content-section">
                <h4>Transform Your Learning Experience</h4>
                <small>
                    <a href="#" target="_blank">Learn More About Learnitab</a>
                </small>
            </div>
        </section>
    </div>

    <div class="nav-dots">
        <button id="musicToggle" class="music-control">
            <i class="fas fa-pause"></i>
        </button>
        <div class="nav-dot active" data-section="hero"></div>
        <div class="nav-dot" data-section="features"></div>
        <div class="nav-dot" data-section="about"></div>
        <div class="nav-dot" data-section="contact"></div>
    </div>

    <script>
        // Three JS Template
        //----------------------------------------------------------------- BASIC parameters
        var renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setSize(window.innerWidth, window.innerHeight);

        if (window.innerWidth > 800) {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowMap.needsUpdate = true;
        }

        document.body.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        var camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 500);
        camera.position.set(0, 2, 14);

        var scene = new THREE.Scene();
        var city = new THREE.Object3D();
        var smoke = new THREE.Object3D();
        var town = new THREE.Object3D();

        var createCarPos = true;
        var uSpeed = 0.001;

        //----------------------------------------------------------------- FOG background
        var normalFogColor = 0x0A0A2A;
        var footerFogColor = 0x000000;
        var normalBuildingColor = 0x000000;
        var footerBuildingColor = 0x0A1A3F;  // Dark navy blue
        var isTransitioning = false;

        scene.background = new THREE.Color(normalFogColor);
        scene.fog = new THREE.Fog(normalFogColor, 10, 16);

        //----------------------------------------------------------------- RANDOM Function
        function mathRandom(num = 8) {
            return -Math.random() * num + Math.random() * num;
        }

        //----------------------------------------------------------------- CHANGE building colors
        var setTintNum = true;
        function setTintColor() {
            setTintNum = !setTintNum;
            return 0x000000;
        }

        //----------------------------------------------------------------- CREATE City
        function init() {
            var segments = 2;
            for (var i = 1; i < 100; i++) {
                var geometry = new THREE.CubeGeometry(1,0,0,segments,segments,segments);
                var material = new THREE.MeshStandardMaterial({
                    color: setTintColor(),
                    wireframe: false,
                    shading: THREE.SmoothShading,
                    side: THREE.DoubleSide
                });
                var wmaterial = new THREE.MeshLambertMaterial({
                    color: 0xFFFFFF,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.03,
                    side: THREE.DoubleSide
                });

                var cube = new THREE.Mesh(geometry, material);
                var wire = new THREE.Mesh(geometry, wmaterial);
                var floor = new THREE.Mesh(geometry, material);
                var wfloor = new THREE.Mesh(geometry, wmaterial);
                
                cube.add(wfloor);
                cube.castShadow = true;
                cube.receiveShadow = true;
                cube.rotationValue = 0.1 + Math.abs(mathRandom(8));
                
                floor.scale.y = 0.05;
                cube.scale.y = 0.1 + Math.abs(mathRandom(8));
                
                var cubeWidth = 0.9;
                cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1-cubeWidth);
                cube.position.x = Math.round(mathRandom());
                cube.position.z = Math.round(mathRandom());
                
                floor.position.set(cube.position.x, 0, cube.position.z);
                
                town.add(floor);
                town.add(cube);
            }

            // Particular
            var gmaterial = new THREE.MeshToonMaterial({color:0xFFFF00, side:THREE.DoubleSide});
            var gparticular = new THREE.CircleGeometry(0.01, 3);
            var aparticular = 5;
            
            for (var h = 1; h < 300; h++) {
                var particular = new THREE.Mesh(gparticular, gmaterial);
                particular.position.set(mathRandom(aparticular), mathRandom(aparticular), mathRandom(aparticular));
                particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
                smoke.add(particular);
            }
            
            var pmaterial = new THREE.MeshPhongMaterial({
                color: 0x000000,
                side: THREE.DoubleSide,
                roughness: 10,
                metalness: 0.6,
                opacity: 0.9,
                transparent: true
            });
            var pgeometry = new THREE.PlaneGeometry(60,60);
            var pelement = new THREE.Mesh(pgeometry, pmaterial);
            pelement.rotation.x = -90 * Math.PI / 180;
            pelement.position.y = -0.001;
            pelement.receiveShadow = true;

            city.add(pelement);
        }

        //----------------------------------------------------------------- MOUSE function
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2(), INTERSECTED;
        var intersected;

        function onMouseMove(event) {
            event.preventDefault();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }

        function onDocumentTouchStart(event) {
            if (event.touches.length == 1) {
                event.preventDefault();
                mouse.x = event.touches[0].pageX - window.innerWidth / 2;
                mouse.y = event.touches[0].pageY - window.innerHeight / 2;
            }
        }

        function onDocumentTouchMove(event) {
            if (event.touches.length == 1) {
                event.preventDefault();
                mouse.x = event.touches[0].pageX - window.innerWidth / 2;
                mouse.y = event.touches[0].pageY - window.innerHeight / 2;
            }
        }

        window.addEventListener('mousemove', onMouseMove, false);
        window.addEventListener('touchstart', onDocumentTouchStart, false);
        window.addEventListener('touchmove', onDocumentTouchMove, false);

        //----------------------------------------------------------------- Lights
        var ambientLight = new THREE.AmbientLight(0xFFFFFF, 4);
        var lightFront = new THREE.SpotLight(0xFFFFFF, 20, 50);  // Increased distance from 10 to 50
        var lightBack = new THREE.PointLight(0xFFFFFF, 0.5, 50);  // Added distance parameter

        lightFront.rotation.x = 45 * Math.PI / 180;
        lightFront.rotation.z = -45 * Math.PI / 180;
        lightFront.position.set(5, 5, 5);
        lightFront.castShadow = true;
        lightFront.shadow.mapSize.width = 6000;
        lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width;
        lightFront.penumbra = 0.1;
        lightBack.position.set(0,6,0);

        smoke.position.y = 2;

        scene.add(ambientLight);
        city.add(lightFront);
        scene.add(lightBack);
        scene.add(city);
        city.add(smoke);
        city.add(town);

        //----------------------------------------------------------------- GRID Helper
        var gridHelper = new THREE.GridHelper(60, 120, 0xFF0000, 0x000000);
        city.add(gridHelper);

        //----------------------------------------------------------------- LINES world
        function createCars(cScale = 2, cPos = 20, cColor = 0xFFFF00) {
            var cMat = new THREE.MeshToonMaterial({color:cColor, side:THREE.DoubleSide});
            var cGeo = new THREE.CubeGeometry(1, cScale/40, cScale/40);
            var cElem = new THREE.Mesh(cGeo, cMat);
            var cAmp = 3;
            
            if (createCarPos) {
                createCarPos = false;
                cElem.position.x = -cPos;
                cElem.position.z = (mathRandom(cAmp));
                // Store the tween in the element for later control
                cElem.tween = TweenMax.to(cElem.position, 3, {
                    x: cPos, 
                    repeat: -1, 
                    yoyo: true, 
                    delay: mathRandom(3)
                });
            } else {
                createCarPos = true;
                cElem.position.x = (mathRandom(cAmp));
                cElem.position.z = -cPos;
                cElem.rotation.y = 90 * Math.PI / 180;
                // Store the tween in the element for later control
                cElem.tween = TweenMax.to(cElem.position, 5, {
                    z: cPos, 
                    repeat: -1, 
                    yoyo: true, 
                    delay: mathRandom(3), 
                    ease: Power1.easeInOut
                });
            }
            
            cElem.receiveShadow = true;
            cElem.castShadow = true;
            cElem.position.y = Math.abs(mathRandom(5));
            city.add(cElem);
        }

        function generateLines() {
            for (var i = 0; i < 60; i++) {
                createCars(0.1, 20);
            }
        }

        //----------------------------------------------------------------- CAMERA position
        function cameraSet() {
            createCars(0.1, 20, 0xFFFFFF);
        }

        //----------------------------------------------------------------- ANIMATE
        function animate() {
            var time = Date.now() * 0.00005;
            requestAnimationFrame(animate);
            
            // Get current section
            const currentScrollSection = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
            const isInFooter = currentScrollSection.closest('#footer');
            
            // Pause/Resume car animations based on footer section
            city.children.forEach(child => {
                if (child.tween) {
                    if (isInFooter && !child.tween.paused()) {
                        child.tween.pause();
                    } else if (!isInFooter && child.tween.paused()) {
                        child.tween.resume();
                    }
                }
            });
            
            // Check if device is mobile
            const isMobile = window.innerWidth <= 768;
            
            if (isInFooter && !isTransitioning) {
                isTransitioning = true;
                
                // Remove fog completely in footer
                scene.fog.density = 0;
                TweenMax.to(scene.fog.color, 1, {
                    r: 0,
                    g: 0,
                    b: 0
                });
                TweenMax.to(scene.background, 1, {
                    r: 0,
                    g: 0,
                    b: 0
                });
                
                // Increase light intensity for footer section
                TweenMax.to(lightFront, 1, {
                    intensity: 30  // Increased from 20 to 30
                });
                TweenMax.to(lightBack, 1, {
                    intensity: 1.0  // Increased from 0.5 to 1.0
                });
                TweenMax.to(ambientLight, 1, {
                    intensity: 6  // Increased from 4 to 6
                });
                
                // Building color transition with brighter values
                town.children.forEach(building => {
                    if (building.material) {
                        TweenMax.to(building.material.color, 1, {
                            r: new THREE.Color(footerBuildingColor).r,
                            g: new THREE.Color(footerBuildingColor).g,
                            b: new THREE.Color(footerBuildingColor).b
                        });
                        // Make materials more responsive to light
                        building.material.metalness = 0.3;
                        building.material.roughness = 0.7;
                    }
                });
                
                // Initial camera position
                TweenMax.to(camera.position, 1, {
                    y: 3,
                    z: 16,
                    onComplete: function() {
                        // Start continuous zoom out animation
                        TweenMax.to(camera.position, 90, {
                            z: 30,
                            repeat: -1,
                            yoyo: true,
                            ease: Power1.easeInOut
                        });
                    }
                });
                
                TweenMax.to(city.position, 1, {
                    y: 1
                });
                
            } else if (!isInFooter && isTransitioning) {
                isTransitioning = false;
                
                // Kill any ongoing zoom animations
                TweenMax.killTweensOf(camera.position);
                
                // Restore normal fog when leaving footer
                scene.fog = new THREE.Fog(normalFogColor, 10, 16);
                TweenMax.to(scene.fog.color, 1, {
                    r: new THREE.Color(normalFogColor).r,
                    g: new THREE.Color(normalFogColor).g,
                    b: new THREE.Color(normalFogColor).b
                });
                TweenMax.to(scene.background, 1, {
                    r: new THREE.Color(normalFogColor).r,
                    g: new THREE.Color(normalFogColor).g,
                    b: new THREE.Color(normalFogColor).b
                });
                
                // Restore normal light intensities
                TweenMax.to(lightFront, 1, {
                    intensity: 20
                });
                TweenMax.to(lightBack, 1, {
                    intensity: 0.5
                });
                TweenMax.to(ambientLight, 1, {
                    intensity: 4
                });
                
                town.children.forEach(building => {
                    if (building.material) {
                        TweenMax.to(building.material.color, 1, {
                            r: new THREE.Color(normalBuildingColor).r,
                            g: new THREE.Color(normalBuildingColor).g,
                            b: new THREE.Color(normalBuildingColor).b
                        });
                        // Restore original material properties
                        building.material.metalness = 0.6;
                        building.material.roughness = 0.4;
                    }
                });
                
                TweenMax.to(camera.position, 1, {
                    y: 2,
                    z: 14
                });
                
                TweenMax.to(city.position, 1, {
                    y: 0
                });
            }
            
            // Only apply rotation on non-mobile devices
            if (!isMobile && !isInFooter) {
                // Only reverse horizontal rotation for About and Contact sections
                if (currentScrollSection.closest('#about') || currentScrollSection.closest('#contact')) {
                    city.rotation.y += ((mouse.x * 8) - camera.rotation.y) * uSpeed;
                } else {
                    city.rotation.y -= ((mouse.x * 8) - camera.rotation.y) * uSpeed;
                }
                // Keep vertical rotation consistent across all sections
                city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed;
                
                if (city.rotation.x < -0.05) city.rotation.x = -0.05;
                else if (city.rotation.x > 1) city.rotation.x = 1;
            }
            
            camera.lookAt(city.position);
            renderer.render(scene, camera);
        }

        //----------------------------------------------------------------- START functions
        generateLines();
        init();
        animate();

        document.addEventListener('DOMContentLoaded', function() {
            const sections = document.querySelectorAll('.section');
            const navDots = document.querySelectorAll('.nav-dot');
            const featuresSection = document.getElementById('features');
            const featuresContainer = document.querySelector('.features-container');
            let isScrolling = false;

            // Function to determine which section is most visible in the viewport
            function getCurrentSection() {
                let maxVisibility = 0;
                let currentSection = 0;
                
                sections.forEach((section, index) => {
                    const rect = section.getBoundingClientRect();
                    const viewHeight = Math.min(window.innerHeight, rect.height);
                    const visibility = Math.min(rect.bottom, viewHeight) - Math.max(rect.top, 0);
                    
                    if (visibility > maxVisibility) {
                        maxVisibility = visibility;
                        currentSection = index;
                    }
                });
                
                return currentSection;
            }

            function updateNavDots(index) {
                navDots.forEach(dot => dot.classList.remove('active'));
                navDots[index].classList.add('active');
            }

            // Function to force scroll to nearest section
            function snapToNearestSection() {
                const currentSection = getCurrentSection();
                sections[currentSection].scrollIntoView({ behavior: 'smooth' });
                updateNavDots(currentSection);
            }

            // Add periodic check for section alignment
            setInterval(() => {
                if (!isScrolling) {
                    const currentSection = getCurrentSection();
                    const activeNavIndex = Array.from(navDots).findIndex(dot => dot.classList.contains('active'));
                    
                    if (activeNavIndex !== currentSection) {
                        updateNavDots(currentSection);
                        snapToNearestSection();
                    }
                }
            }, 1000); // Check every second

            window.addEventListener('wheel', function(e) {
                const currentSection = getCurrentSection();
                const isInFeatures = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2).closest('#features');
                const isInAbout = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2).closest('#about');
                
                if (isInFeatures || isInAbout) {
                    e.preventDefault();
                    
                    const container = isInFeatures ? featuresContainer : document.querySelector('.about-container');
                    const pages = container.querySelectorAll(isInFeatures ? '.features-page' : '.about-page');
                    const scrollAmount = container.scrollTop;
                    const pageHeight = container.clientHeight;
                    const totalHeight = pageHeight * (pages.length - 1);
                    
                    if (e.deltaY > 0 && scrollAmount >= totalHeight) {
                        // Move to next main section
                        sections[currentSection + 1].scrollIntoView({ behavior: 'smooth' });
                        updateNavDots(currentSection + 1);
                    } else if (e.deltaY < 0 && scrollAmount <= 0) {
                        // Move to previous main section
                        sections[currentSection - 1].scrollIntoView({ behavior: 'smooth' });
                        updateNavDots(currentSection - 1);
                    } else {
                        container.scrollBy({
                            top: e.deltaY > 0 ? pageHeight : -pageHeight,
                            behavior: 'smooth'
                        });
                    }
                } else {
                    // Normal section scrolling
                    if (isScrolling) return;
                    
                    isScrolling = true;
                    setTimeout(() => isScrolling = false, 1000);

                    const nextSection = e.deltaY > 0 ? currentSection + 1 : currentSection - 1;
                    
                    if (nextSection >= 0 && nextSection < sections.length) {
                        sections[nextSection].scrollIntoView({ behavior: 'smooth' });
                        updateNavDots(nextSection);
                    }
                }
            }, { passive: false });

            // Update click handlers for nav dots
            navDots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    sections[index].scrollIntoView({ behavior: 'smooth' });
                    updateNavDots(index);
                });
            });
        });

        // Add this function to handle window resize
        function handleResize() {
            const isMobile = window.innerWidth <= 768;
            
            // Reset rotation when switching to mobile
            if (isMobile) {
                city.rotation.y = 0;
                city.rotation.x = 0;
            }
            
            // Update camera and renderer
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        
        // Update the window resize event listener
        window.removeEventListener('resize', onWindowResize);
        window.addEventListener('resize', handleResize);
        
        // Call handleResize initially to set correct state
        handleResize();

        document.addEventListener('DOMContentLoaded', function() {
            const audio = document.getElementById('backgroundMusic');
            const musicToggle = document.getElementById('musicToggle');
            const icon = musicToggle.querySelector('i');
            
            // Function to handle play/pause
            function toggleMusic() {
                if (audio.paused) {
                    audio.play();
                    icon.className = 'fas fa-pause';
                } else {
                    audio.pause();
                    icon.className = 'fas fa-play';
                }
            }

            // Add click event listener
            musicToggle.addEventListener('click', toggleMusic);

            // Force autoplay when page loads
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Autoplay started successfully
                    icon.className = 'fas fa-pause';
                })
                .catch(error => {
                    // Auto-play was prevented
                    icon.className = 'fas fa-play';
                    // Try playing on first user interaction with the page
                    document.addEventListener('click', function initPlay() {
                        audio.play();
                        icon.className = 'fas fa-pause';
                        document.removeEventListener('click', initPlay);
                    }, { once: true });
                });
            }

            // Update button state when audio plays/pauses
            audio.addEventListener('play', () => {
                icon.className = 'fas fa-pause';
            });

            audio.addEventListener('pause', () => {
                icon.className = 'fas fa-play';
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
            const sectionsContainer = document.querySelector('.sections-container');
            
            // Function to check if we're in the first or last section
            function checkCinemaBars() {
                const currentSection = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
                const isInHero = currentSection.closest('#hero');
                const isInFooter = currentSection.closest('#footer');
                
                if (isInHero || isInFooter) {
                    document.body.classList.add('show-cinema-bars');
                } else {
                    document.body.classList.remove('show-cinema-bars');
                }
            }

            // Check on scroll
            sectionsContainer.addEventListener('scroll', checkCinemaBars);
            
            // Initial check
            checkCinemaBars();
        });

        document.addEventListener('DOMContentLoaded', function() {
            const phrases = [
                "Productivity",
                "Study",
                "Career"
            ];
            
            const rotatingText = document.getElementById('rotating-text');
            let currentIndex = 0;
            
            function updateText() {
                // Fade out
                rotatingText.style.opacity = 0;
                
                setTimeout(() => {
                    // Update text
                    currentIndex = (currentIndex + 1) % phrases.length;
                    rotatingText.textContent = phrases[currentIndex];
                    
                    // Fade in
                    rotatingText.style.opacity = 1;
                }, 200); // Half of the transition time
            }
            
            // Add CSS transition
            rotatingText.style.transition = 'opacity 0.4s ease';
            
            // Start rotation with 2 second interval
            setInterval(updateText, 2000);
        });
    </script>
</body>
</html>
      `
    }} />
  )
}
