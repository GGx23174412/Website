// Moves to next carroussel image
function scrollCarroussel() {
    document.getElementById("carrouselButton").click();
}
   
setInterval(scrollCarroussel, 5000);

// Galery images click
// add click event listeners to all images in gallery
var galleryContainer = document.getElementById("galleryContainer");
var galleryImages = galleryContainer.getElementsByTagName("img");
for(i = 0; i < galleryImages.length; i++){
    galleryImages[i].addEventListener("click", toggleImageOverlay);
}

function toggleImageOverlay() {
    let imageOverlay = getImageOverlayElement(this);
    // Note: initial visibily cannot be set on external css file
    if(imageOverlay.style.visibility == "hidden"){
        imageOverlay.style.visibility = "visible";
    } else if (imageOverlay.style.visibility == "visible") {
        imageOverlay.style.visibility = "hidden";
    } else {
        // element will land here on first click if visibility is set in external CSS
        // which is not accessed by DOM
        imageOverlay.style.visibility = "visible";
    }
}

function getImageOverlayElement(imageElement){
    // Get image wrapper parent element - go back two nodes
    // Note: to get a parent div use parentNode property instead of getParent
    let parentImageWrapper = imageElement.parentNode.parentNode;
    // Get the imageOverlay Div
    let imageOverlay = parentImageWrapper.querySelector('.imageOverlay');
    return imageOverlay;
}