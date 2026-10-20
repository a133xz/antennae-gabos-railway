/** Match CSS home mobile / Tailwind max-md (767px). */
const CURTAIN_MOBILE_MAX_PX = 767;

document.addEventListener("DOMContentLoaded", function () {
    const mobileCurtain = document.querySelector(".mobileCurtain");
    const curtainLeft = document.querySelector(".curtainLeft");
    const curtainRight = document.querySelector(".curtainRight");
    const fixedCurtainLeft = document.querySelector(".fixedCurtainLeft");
    const fixedCurtainRight = document.querySelector(".fixedCurtainRight");
    const navWrapper = document.querySelector(".navWrapper");

    // Function to animate mobile curtain (rising up)
    function animateMobileCurtain() {
        if (mobileCurtain) {
            mobileCurtain.style.display = "block";
            mobileCurtain.style.position = "absolute";
            mobileCurtain.style.top = "0";
            mobileCurtain.style.left = "0";
            mobileCurtain.style.width = "100%";
            mobileCurtain.style.transition = "transform 1.5s ease-in-out";

            // Start animation
            setTimeout(() => {
                mobileCurtain.style.transform = "translateY(-100%)";
            }, 500);

            // After animation completes
            setTimeout(() => {
                navWrapper.style.zIndex = "4"; // Bring nav forward for interaction
                mobileCurtain.style.display = "none"; // Hide mobile curtain
                fixedCurtainLeft.style.pointerEvents = "none"; // Allow clicks through
                fixedCurtainRight.style.pointerEvents = "none";
            }, 2000);
        }
    }

    // Function to animate desktop curtains (sliding open)
    function animateDesktopCurtains() {
        if (curtainLeft && curtainRight) {
            curtainLeft.style.display = "block";
            curtainRight.style.display = "block";

            curtainLeft.style.position = "absolute";
            curtainRight.style.position = "absolute";

            curtainLeft.style.top = "0";
            curtainRight.style.top = "0";

            curtainLeft.style.left = "0";
            curtainRight.style.right = "0";

            curtainLeft.style.width = "51%"; // Overlapping by 5%
            curtainRight.style.width = "51%";

            curtainLeft.style.transition = "transform 1.5s ease-in-out";
            curtainRight.style.transition = "transform 1.5s ease-in-out";

            // Start animation
            setTimeout(() => {
                curtainLeft.style.transform = "translateX(-100%)";
                curtainRight.style.transform = "translateX(100%)";
            }, 500);

            // After animation completes
            setTimeout(() => {
                curtainLeft.style.display = "none";
                curtainRight.style.display = "none";
                navWrapper.style.zIndex = "4"; // Make navWrapper clickable
                fixedCurtainLeft.style.pointerEvents = "none"; // Allow clicks through
                fixedCurtainRight.style.pointerEvents = "none";
            }, 2000);
        }
    }

    // Detect screen size and run the appropriate animation
    function runAnimations() {
        navWrapper.style.zIndex = "1"; // Start behind the curtains
        fixedCurtainLeft.style.pointerEvents = "auto"; // Reset on page load
        fixedCurtainRight.style.pointerEvents = "auto";

        if (window.innerWidth <= CURTAIN_MOBILE_MAX_PX) {
            animateMobileCurtain();
        } else {
            animateDesktopCurtains();
        }
    }

    runAnimations(); // Run on page load
});
