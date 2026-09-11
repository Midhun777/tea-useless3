// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // Fade in sections as they enter viewport
    gsap.utils.toArray('.gsap-fade-in').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Slide timeline events from left/right
    gsap.utils.toArray('.gsap-slide-right').forEach(event => {
        gsap.from(event, {
            scrollTrigger: {
                trigger: event,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            x: 50,
            rotation: 2,
            duration: 0.8,
            ease: "back.out(1.2)"
        });
    });

    gsap.utils.toArray('.gsap-slide-left').forEach(event => {
        gsap.from(event, {
            scrollTrigger: {
                trigger: event,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            x: -50,
            rotation: -2,
            duration: 0.8,
            ease: "back.out(1.2)"
        });
    });

    // Animate the timeline line drawing down
    const timelineLine = document.querySelector('.timeline-line');
    if (timelineLine) {
        gsap.from(timelineLine, {
            scrollTrigger: {
                trigger: "#main-timeline",
                start: "top center",
                end: "bottom center",
                scrub: true
            },
            scaleY: 0,
            transformOrigin: "top center",
            ease: "none"
        });
    }

    // Add a slight random wiggle to sticky notes on hover to make them feel tactile
    const stickyNotes = document.querySelectorAll('.sticky-note, .polaroid');
    stickyNotes.forEach(note => {
        note.addEventListener('mouseenter', () => {
            gsap.to(note, {
                rotation: "+=2",
                scale: 1.02,
                duration: 0.2,
                ease: "power1.inOut"
            });
        });
        
        note.addEventListener('mouseleave', () => {
            gsap.to(note, {
                rotation: "-=2",
                scale: 1,
                duration: 0.2,
                ease: "power1.inOut"
            });
        });
    });
});
