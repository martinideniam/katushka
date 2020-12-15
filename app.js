let controller;
let scene;
let pageScene;
let detailScene;

const burger = document.querySelector(".burger");
burger.classList.remove('active-burger')

function animateSlides() {
    //init controller
    controller = new ScrollMagic.Controller()
    //gsap
    //select some things 
    const slides = document.querySelectorAll('.slide');
    const nav = document.querySelector('.nav-header');
    //loop over each slide
    slides.forEach((slide, index, slides) => {
        const revealImg = slide.querySelector('.reveal-img');
        const img = slide.querySelector('img');
        const revealText = slide.querySelector('.reveal-text');
        //gsap 
        const tl = gsap.timeline({defaults: {duration: 1, ease: 'power4.inOut'}})
        tl.fromTo(revealImg, {x: '0%'}, {x: '100%'});
        tl.fromTo(img, {scale: 2}, {scale: 1}, '-=0.5');
        tl.fromTo(revealText, {x: '0%'}, {x: '100%'}, '-=0.75');
        //create Scene 
        slideScene = new ScrollMagic.Scene({
            triggerElement: slide, 
            triggerHook: 0.25,
            reverse: false
        })
        .setTween(tl)
        .addIndicators({colorStart: 'white', colorTrigger: 'white'})
        .addTo(controller)
        //new animation 
        const pageTl = gsap.timeline();
        let nextSlide = slides.length - 1 === index ? 'end' : slides[index+1]
        pageTl.fromTo(nextSlide, {y: '0%'}, {y: '50%'})
        pageTl.fromTo(slide, {opacity: 1, scale: 1}, {opacity: 0, scale: 0.8})
        pageTl.fromTo(nextSlide, {y: '50%'}, {y: '0%'}, '-=0.5')
        //create new scene
        pageScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%', 
            triggerHook: 0,
        })
        .setTween(pageTl)
        .setPin(slide, {pushFollowers: false})
        .addIndicators({colorStart: 'red', colorTrigger: 'red', name: 'page', indent: 200})
        .addTo(controller)
    })
}

const mouse = document.querySelector('.cursor');
const cursorText = document.querySelector('.cursor-text');

function cursor(e) {
    if (mouse.classList.contains('hide-mouse')) {
        mouse.classList.remove('hide-mouse');
    }
    mouse.style.top = e.pageY+'px';
    mouse.style.left = e.pageX+'px';
}



function activeCursor(e) {
    const item = e.target; 
    if (item.id === 'logo' || item.classList.contains('burger')) {
        mouse.classList.add('nav-active');
    } else {
        mouse.classList.remove('nav-active');
    }
    if (item.classList.contains('explore')) {
        gsap.to('.title-swipe', 1, {y: '0%'})
        mouse.classList.add('explore-active');
        cursorText.innerText = 'Tap';
    } else {
        mouse.classList.remove('explore-active');
        gsap.to('.title-swipe', 1, {y: '100%'})
        cursorText.innerText = '';
    }
}

function navToggle(e) {
    const burgerTl = gsap.timeline({defaults: {duration: 1, ease: 'power4.inOut'}})
    if (burger.classList.contains('active-burger')){
        burgerTl.to('.line1', 0.3, {translateY: '0rem', rotate: '0deg'})
        burgerTl.to('.line2', 0.3, {translateY: '0rem', rotate: '0deg'})
        burgerTl.to('.nav-bar', 0.7, {clipPath: 'circle(20px at 100% -10%)', ease: 'power1.outEase'}, '-=0.6')
        burgerTl.to('.line1', {background: 'white', ease: 'power2.inEase'}, '-=1')
        burgerTl.to('.line2', {background: 'white', ease: 'power2.inEase'}, '-=2')
        burgerTl.to('#logo', {display: 'block', ease: 'power1.inEase'}, '-=2');
        burgerTl.to(mouse, 0.3, {border: 'solid 2px white'}, '-=0.6')
        document.body.classList.remove('hide')
        burger.classList.remove('active-burger')
    } else {
        burgerTl.to('.line1', 0.3, {translateY: '0.3rem', rotate: '225deg'})
        burgerTl.to('.line2', 0.3, {translateY: '-0.3rem', rotate: '135deg'})
        burgerTl.to('.nav-bar', 0.7, {clipPath: 'circle(4000px at 100% -10%)', ease: 'power1.inEase'}, '-=0.6')
        burgerTl.to('.line1', {background: 'black', ease: 'power2.inEase'}, '-=1')
        burgerTl.to('.line2', {background: 'rgb(255, 139, 93)', ease: 'power2.inEase'}, '-=2')
        burgerTl.to('#logo', {display: 'none', ease: 'power1.inEase'}, '-=2');
        burgerTl.to(mouse, 0.3, {border: 'solid 2px #17181a'}, '-=0.6')
        document.body.classList.add('hide')
        burger.classList.add('active-burger')
    }
}

function detailAnimation() {
    detailController = new ScrollMagic.Controller()
    const slides = document.querySelectorAll('.detail-slide');
    slides.forEach((slide, index, slides) => {
        const slideTl = gsap.timeline({defaults: {duration: 1}})
        let nextSlideDet = slides.length - 1 === index ? 'end' : slides[index+1]
        const nextImg = nextSlideDet.querySelector('img')
        slideTl.fromTo(slide, {opacity: 1}, {opacity: 0})
        slideTl.fromTo(nextImg, {x: '50%', scale: 0.5}, {x: '0%', scale: 1})
        slideTl.fromTo(nextSlideDet, {opacity: 0}, {opacity: 1}, "-=1")
        detailScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%', 
            triggerHook: 0,
        })
        .setTween(slideTl)
        .setPin(slide, {pushFollowers: false})
        .addIndicators({colorStart: 'red', colorTrigger: 'red', name: 'detail', indent: 100})
        .addTo(detailController)
    }) 
}

//barbajs transitions 
const logo = document.querySelector('#logo');
barba.init({
    views: [
    {
        namespace: 'home',
        beforeEnter() {
            logo.href = './index.html'
            animateSlides();
        }, 
        beforeLeave() {
            slideScene.destroy();
            pageScene.destroy();
            controller.destroy();
        }
    }, 
    {
        namespace: 'fashion',
        beforeEnter() {
            logo.href = '../index.html'
            detailAnimation();
        },
        beforeLeave() {
            detailScene.destroy();
            detailController.destroy();
        }
    }
    ],
    transitions: [
    {
        leave({current, next}) {
            //an animation 
            let done = this.async();
            const tl = gsap.timeline({defaults: {ease:"power2.inOut"}});
            tl.fromTo(current.container, 1, {opacity: 1}, {opacity: 0});
            tl.fromTo('.swipe', 0.75, {x: '-100%'}, {x: '0%', stagger: 0.4, onComplete: done}, '-=0.5')
        },
        enter({current, next}) {
            window.scrollTo(0, 0)
            let done = this.async();
            const tl = gsap.timeline({defaults: {ease:"power2.inOut"}});
            tl.fromTo('.swipe', 0.75, {x: '0%'}, {x: '100%', stagger: 0.25, onComplete: done} )
            tl.fromTo(next.container, 1, {opacity: 0}, {opacity: 1});
            tl.fromTo('.nav-header', 1, {y: '-100%'}, {y: '0%'}, '-=1.5');
        }
    }
    ]
})

burger.addEventListener('click', navToggle)
window.addEventListener('mousemove', cursor)
window.addEventListener('mouseover', activeCursor)

animateSlides();
