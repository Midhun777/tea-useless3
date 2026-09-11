gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    // ── Reveal all .gsap-reveal elements on scroll ──────────────
    gsap.utils.toArray('.gsap-reveal').forEach((el, i) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none none"
            },
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            delay: (i % 3) * 0.05   // slight stagger within groups
        });
    });

    // ── Cover title: draw in with slight rotation ───────────────
    gsap.from('.cover-title', {
        opacity: 0,
        y: 40,
        rotation: -5,
        duration: 1,
        ease: "back.out(1.2)",
        delay: 0.2
    });

    gsap.from('.cover-subtitle-wrapper, .model-trail, .cover-timestamp, .cover-doodles', {
        opacity: 0,
        y: 20,
        stagger: 0.18,
        duration: 0.7,
        ease: "power2.out",
        delay: 0.5
    });

    // ── Pivot block: slam in from bottom ───────────────────────
    const pivotBlock = document.querySelector('.pivot-block');
    if (pivotBlock) {
        gsap.from(pivotBlock, {
            scrollTrigger: {
                trigger: pivotBlock,
                start: "top 85%"
            },
            y: 60,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out"
        });
        gsap.from('.pivot-dest', {
            scrollTrigger: {
                trigger: pivotBlock,
                start: "top 80%"
            },
            scale: 0.5,
            opacity: 0,
            duration: 0.7,
            ease: "back.out(2)",
            delay: 0.3
        });
    }

    // ── Biriyani block: bounce in ──────────────────────────────
    const biriyaniBlock = document.querySelector('.biriyani-block');
    if (biriyaniBlock) {
        gsap.from(biriyaniBlock, {
            scrollTrigger: {
                trigger: biriyaniBlock,
                start: "top 85%"
            },
            scale: 0.85,
            opacity: 0,
            rotation: -2,
            duration: 0.8,
            ease: "back.out(1.5)"
        });
        gsap.from('.biriyani-title', {
            scrollTrigger: {
                trigger: biriyaniBlock,
                start: "top 80%"
            },
            opacity: 0,
            y: -20,
            duration: 0.6,
            ease: "bounce.out",
            delay: 0.3
        });
    }

    // ── Midnight block: flash in ───────────────────────────────
    const midnight = document.querySelector('.midnight-block');
    if (midnight) {
        gsap.from(midnight, {
            scrollTrigger: {
                trigger: midnight,
                start: "top 85%"
            },
            opacity: 0,
            duration: 1,
            ease: "power2.inOut"
        });
        gsap.from('.midnight-title', {
            scrollTrigger: {
                trigger: midnight,
                start: "top 80%"
            },
            opacity: 0,
            scale: 0.7,
            duration: 0.9,
            ease: "back.out(1.7)",
            delay: 0.35
        });
    }

    // ── Comic rows: stagger reveal ─────────────────────────────
    const comicBoard = document.querySelector('.comic-board');
    if (comicBoard) {
        gsap.utils.toArray('.cb-row').forEach((row, i) => {
            gsap.from(row, {
                scrollTrigger: {
                    trigger: comicBoard,
                    start: "top 80%"
                },
                opacity: 0,
                x: i % 2 === 0 ? -30 : 30,
                duration: 0.5,
                ease: "power2.out",
                delay: i * 0.12
            });
        });
    }

    // ── Chaos block: shake in ──────────────────────────────────
    const chaos = document.querySelector('.chaos-block');
    if (chaos) {
        gsap.from(chaos, {
            scrollTrigger: {
                trigger: chaos,
                start: "top 85%"
            },
            opacity: 0,
            x: 10,
            duration: 0.7,
            ease: "power2.out"
        });
        gsap.from('.chaos-title', {
            scrollTrigger: {
                trigger: chaos,
                start: "top 80%"
            },
            opacity: 0,
            scale: 1.1,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.2
        });
    }

    // ── Final page: dramatic reveal ────────────────────────────
    const finalPage = document.querySelector('.final-spread');
    if (finalPage) {
        gsap.from('.final-title', {
            scrollTrigger: {
                trigger: finalPage,
                start: "top 80%"
            },
            opacity: 0,
            y: 50,
            rotation: -5,
            duration: 1.2,
            ease: "back.out(1.4)"
        });
        gsap.from('.final-but-ours', {
            scrollTrigger: {
                trigger: finalPage,
                start: "top 70%"
            },
            opacity: 0,
            y: 30,
            duration: 0.9,
            ease: "power2.out",
            delay: 0.4
        });
    }

    // ── Sticky notes: wiggle on hover ──────────────────────────
    document.querySelectorAll('.sticky-scrap, .learn-card, .big-sticky-note').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(el, { rotation: "+=2", scale: 1.03, duration: 0.2, ease: "power1.inOut" });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { rotation: "-=2", scale: 1, duration: 0.2, ease: "power1.inOut" });
        });
    });

    // ── Polaroid hover ─────────────────────────────────────────
    document.querySelectorAll('.polaroid-card, .pinboard-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(el, { scale: 1.04, boxShadow: "6px 8px 20px rgba(0,0,0,0.2)", duration: 0.2 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { scale: 1, boxShadow: "", duration: 0.2 });
        });
    });

    // ── desperation meter fill animation ──────────────────────
    const dmFill = document.querySelector('.dm-fill');
    if (dmFill) {
        const w = dmFill.style.width;
        dmFill.style.width = '0%';
        gsap.to(dmFill, {
            scrollTrigger: {
                trigger: dmFill,
                start: "top 85%"
            },
            width: w,
            duration: 1.2,
            ease: "power2.out",
            delay: 0.3
        });
    }
});
