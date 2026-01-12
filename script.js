* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    /* Cyberpunk Dark Theme */
    --bg-primary: #0a0e27;
    --bg-secondary: #0f1729;
    --bg-card: #151b2e;

    /* Neon Colors - BRIGHTER for readability */
    --neon-cyan: #00f0ff;
    --neon-purple: #b026ff;
    --neon-pink: #ff006e;
    --neon-green: #39ff14;
    --neon-blue: #0066ff;
    --neon-yellow: #ffed4e;

    /* Text - IMPROVED CONTRAST */
    --text-primary: #ffffff;
    --text-secondary: #cbd5e0;
    --text-muted: #a0aec0;
    --text-bright: #f7fafc;

    /* Borders & Effects */
    --border-neon: 2px;
    --glow-cyan: 0 0 10px var(--neon-cyan), 0 0 20px var(--neon-cyan), 0 0 30px var(--neon-cyan);
    --glow-purple: 0 0 10px var(--neon-purple), 0 0 20px var(--neon-purple);
    --glow-pink: 0 0 10px var(--neon-pink), 0 0 20px var(--neon-pink);
}

body {
    font-family: 'Rajdhani', 'Orbitron', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow-x: hidden;
    position: relative;
}

/* Animated Grid Background */
body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
        linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
    z-index: 0;
    animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
    0% {
        transform: translate(0, 0);
    }

    100% {
        transform: translate(50px, 50px);
    }
}

/* Glowing Particles */
body::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 20% 30%, rgba(0, 240, 255, 0.05) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(176, 38, 255, 0.05) 0%, transparent 40%);
    pointer-events: none;
    z-index: 0;
}

.page {
    min-height: 100vh;
    padding: 20px;
    display: none;
    position: relative;
    z-index: 1;
    animation: glitchIn 0.3s ease-out;
}

.page.active {
    display: block;
}

@keyframes glitchIn {
    0% {
        opacity: 0;
        transform: translateX(-10px);
    }

    50% {
        transform: translateX(5px);
    }

    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Hero Section */
.hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    position: relative;
}

.logo {
    margin-bottom: 40px;
    position: relative;
}

.logo-icon {
    font-size: 120px;
    filter: drop-shadow(var(--glow-cyan));
    animation: iconPulse 3s ease-in-out infinite;
}

@keyframes iconPulse {

    0%,
    100% {
        transform: scale(1);
        filter: drop-shadow(var(--glow-cyan));
    }

    50% {
        transform: scale(1.05);
        filter: drop-shadow(0 0 15px var(--neon-cyan), 0 0 30px var(--neon-cyan), 0 0 45px var(--neon-cyan));
    }
}

.hero h1 {
    font-size: 72px;
    font-weight: 900;
    letter-spacing: 8px;
    margin-bottom: 20px;
    text-transform: uppercase;
    position: relative;
    background: linear-gradient(90deg, var(--neon-cyan), var(--neon-purple), var(--neon-pink));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: textGlow 3s ease-in-out infinite;
}

@keyframes textGlow {

    0%,
    100% {
        filter: drop-shadow(0 0 5px var(--neon-cyan));
    }

    50% {
        filter: drop-shadow(0 0 15px var(--neon-purple));
    }
}

.tagline {
    font-size: 18px;
    color: var(--text-secondary);
    margin-bottom: 60px;
    font-weight: 300;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.cta-button {
    background: transparent;
    color: var(--neon-cyan);
    border: var(--border-neon) solid var(--neon-cyan);
    padding: 16px 48px;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
}

.cta-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: var(--neon-cyan);
    transition: left 0.3s ease;
    z-index: -1;
}

.cta-button:hover::before {
    left: 0;
}

.cta-button:hover {
    color: var(--bg-primary);
    box-shadow: var(--glow-cyan);
    transform: translateY(-2px);
}

.arrow {
    font-size: 18px;
    transition: transform 0.3s ease;
}

.cta-button:hover .arrow {
    transform: translateX(5px);
}

/* Back Button */
.back-button {
    background: transparent;
    color: var(--neon-cyan);
    border: 1px solid var(--neon-cyan);
    padding: 8px 20px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    margin-bottom: 30px;
    transition: all 0.3s ease;
    clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
}

.back-button:hover {
    background: var(--neon-cyan);
    color: var(--bg-primary);
    box-shadow: var(--glow-cyan);
    transform: translateX(-3px);
}

/* About Section */
.about-section {
    max-width: 800px;
    margin: 0 auto 50px;
    background: var(--bg-card);
    padding: 40px;
    position: relative;
    border: 2px solid var(--neon-cyan);
    clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
}

.about-section::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, var(--neon-cyan), var(--neon-purple), var(--neon-pink), var(--neon-cyan));
    background-size: 300% 300%;
    animation: borderGlow 4s ease infinite;
    z-index: -1;
    opacity: 0.3;
    clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
}

@keyframes borderGlow {

    0%,
    100% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }
}

.about-section h2 {
    font-size: 32px;
    font-weight: 900;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 20px;
    color: var(--neon-cyan);
    text-shadow: var(--glow-cyan);
}

.about-description {
    font-size: 16px;
    line-height: 1.8;
    color: var(--text-secondary);
    text-align: center;
}

/* Services */
.services-container {
    max-width: 900px;
    margin: 0 auto;
}

.service-category {
    margin-bottom: 50px;
}

.category-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 2px solid var(--neon-cyan);
}

.category-icon {
    font-size: 36px;
    filter: drop-shadow(var(--glow-cyan));
}

.category-header h3 {
    font-size: 24px;
    font-weight: 900;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--neon-cyan);
}

.service-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}

/* Service Card - Cyberpunk Style */
.service-card {
    background: var(--bg-card);
    padding: 20px;
    border: 2px solid rgba(0, 240, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    position: relative;
    min-height: 140px;
    text-align: center;
    clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);
}

.service-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--neon-cyan);
    transform: scaleY(0);
    transition: transform 0.3s ease;
}

.service-card:hover::before {
    transform: scaleY(1);
}

.service-card:hover {
    border-color: var(--neon-cyan);
    box-shadow: var(--glow-cyan);
    transform: translateX(5px);
}

/* Icon - Square with Neon Border */
.card-icon {
    font-size: 24px;
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-primary);
    border: 2px solid var(--neon-cyan);
    position: relative;
    align-self: center;
    clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
}

.card-icon::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: var(--neon-cyan);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
    clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
}

.service-card:hover .card-icon::after {
    opacity: 0.2;
}

/* Different neon colors for categories */
.service-category:nth-child(1) .service-card:nth-child(1) .card-icon {
    border-color: var(--neon-cyan);
    box-shadow: var(--glow-cyan);
}

.service-category:nth-child(1) .service-card:nth-child(2) .card-icon {
    border-color: var(--neon-purple);
    box-shadow: var(--glow-purple);
}

.service-category:nth-child(2) .service-card:nth-child(1) .card-icon {
    border-color: var(--neon-green);
    box-shadow: 0 0 10px var(--neon-green);
}

.service-category:nth-child(2) .service-card:nth-child(2) .card-icon {
    border-color: var(--neon-pink);
    box-shadow: var(--glow-pink);
}

.service-category:nth-child(2) .service-card:nth-child(3) .card-icon {
    border-color: var(--neon-blue);
    box-shadow: 0 0 10px var(--neon-blue);
}

.service-card h4 {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #ffffff;
    margin-bottom: 6px;
    text-transform: uppercase;
    line-height: 1.3;
}

.service-card p {
    font-size: 12px;
    color: #ffffff;
    line-height: 1.5;
    opacity: 0.8;
}

/* Pricing Section */
.pricing-section {
    max-width: 800px;
    margin: 50px auto;
}

.pricing-card {
    background: var(--bg-card);
    padding: 40px;
    border: 2px solid var(--neon-purple);
    clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
    position: relative;
}

.pricing-card::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, var(--neon-purple), var(--neon-pink), var(--neon-purple));
    background-size: 300% 300%;
    animation: borderGlow 4s ease infinite;
    z-index: -1;
    opacity: 0.2;
    clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
}

.pricing-card h3 {
    font-size: 28px;
    font-weight: 900;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 30px;
    color: var(--neon-purple);
    text-shadow: var(--glow-purple);
}

.price-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 0;
    border-bottom: 1px solid rgba(0, 240, 255, 0.2);
}

.price-item:last-child {
    border-bottom: none;
}

.price-label {
    font-size: 15px;
    color: var(--text-bright);
    letter-spacing: 1px;
}

.price-value {
    font-size: 20px;
    font-weight: 900;
    color: var(--neon-yellow);
    letter-spacing: 1px;
    text-shadow: 0 0 10px var(--neon-yellow);
}

/* Contact Button */
.contact-cta-section {
    max-width: 800px;
    margin: 50px auto;
    text-align: center;
}

.contact-button {
    background: transparent;
    color: var(--neon-pink);
    border: var(--border-neon) solid var(--neon-pink);
    padding: 18px 60px;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);
}

.contact-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: var(--neon-pink);
    transition: left 0.3s ease;
    z-index: -1;
}

.contact-button:hover::before {
    left: 0;
}

.contact-button:hover {
    color: var(--bg-primary);
    box-shadow: var(--glow-pink);
    transform: translateY(-3px);
}

.telegram-icon {
    font-size: 22px;
}

/* Contact Page */
.contact-container {
    max-width: 800px;
    margin: 0 auto;
}

.contact-info {
    background: var(--bg-card);
    padding: 50px;
    border: 2px solid var(--neon-cyan);
    text-align: center;
    margin-bottom: 30px;
    clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
}

.contact-avatar {
    margin-bottom: 25px;
}

.avatar-circle {
    width: 120px;
    height: 120px;
    background: var(--bg-primary);
    border: 3px solid var(--neon-cyan);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    margin: 0 auto;
    box-shadow: var(--glow-cyan);
    clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);
}

.contact-info h3 {
    font-size: 32px;
    font-weight: 900;
    letter-spacing: 3px;
    margin-bottom: 10px;
    text-transform: uppercase;
}

.contact-role {
    font-size: 16px;
    color: var(--text-secondary);
    margin-bottom: 30px;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.telegram-link {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: transparent;
    color: var(--neon-cyan);
    border: 2px solid var(--neon-cyan);
    padding: 14px 36px;
    text-decoration: none;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    transition: all 0.3s ease;
    clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
}

.telegram-link:hover {
    background: var(--neon-cyan);
    color: var(--bg-primary);
    box-shadow: var(--glow-cyan);
    transform: translateY(-2px);
}

.tg-icon {
    font-size: 22px;
}

/* Contact Form */
.contact-form {
    background: var(--bg-card);
    padding: 40px;
    border: 2px solid var(--neon-purple);
    clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
}

.contact-form h4 {
    font-size: 24px;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 30px;
    color: var(--neon-purple);
}

.form-group {
    margin-bottom: 25px;
}

.form-group label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin-bottom: 10px;
}

.form-group select,
.form-group textarea {
    width: 100%;
    padding: 16px;
    border: 2px solid rgba(0, 240, 255, 0.3);
    font-size: 15px;
    font-family: inherit;
    transition: all 0.3s ease;
    background: var(--bg-primary);
    color: var(--text-primary);
    clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
}

.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--neon-cyan);
    box-shadow: var(--glow-cyan);
}

.form-group select option {
    background: var(--bg-primary);
    color: var(--text-primary);
}

.form-group textarea {
    resize: vertical;
    min-height: 140px;
}

.submit-button {
    background: transparent;
    color: var(--neon-purple);
    border: var(--border-neon) solid var(--neon-purple);
    padding: 16px 40px;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    position: relative;
    overflow: hidden;
    clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);
}

.submit-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: var(--neon-purple);
    transition: left 0.3s ease;
    z-index: -1;
}

.submit-button:hover::before {
    left: 0;
}

.submit-button:hover {
    color: var(--bg-primary);
    box-shadow: var(--glow-purple);
}

.send-icon {
    font-size: 20px;
}

/* Responsive */
@media (max-width: 480px) {
    .hero h1 {
        font-size: 48px;
        letter-spacing: 4px;
    }

    .logo-icon {
        font-size: 90px;
    }

    .tagline {
        font-size: 14px;
    }

    .category-header h3 {
        font-size: 18px;
    }

    .service-card {
        padding: 20px;
    }

    .card-icon {
        width: 56px;
        height: 56px;
        font-size: 28px;
    }

    .contact-info,
    .contact-form,
    .pricing-card {
        padding: 30px;
    }
}
