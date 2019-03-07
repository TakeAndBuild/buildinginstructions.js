'use strict';

LDR.Buttons = function(element, addTopButtons, homeLink, mainImage) {
    var self = this;
    // Add buttons to element:
    
    // Lower buttons:
    this.backButton = this.createDiv('prev_button', 'prevStep();');
    this.backButton.appendChild(LDR.SVG.makeLeftArrow(!addTopButtons));
    if(!addTopButtons) {
        element.appendChild(this.backButton); // Add back button to row with camera buttons.
    }

    this.cameraButtons = this.createDiv('camera_buttons');
    this.zoomOutButtonLarge = this.createDiv('zoom_out_button_large', 'zoomOut();');
    this.zoomOutButtonLarge.appendChild(LDR.SVG.makeZoom(false, 2));
    this.cameraButtons.appendChild(this.zoomOutButtonLarge);
    this.resetCameraButton = this.createDiv('reset_camera_button', 'resetCameraPosition();');
    this.resetCameraButton.appendChild(LDR.SVG.makeCamera(50, 45, 80));
    this.cameraButtons.appendChild(this.resetCameraButton);
    this.zoomInButton = this.createDiv('zoom_in_button', 'zoomIn();');
    this.zoomInButton.appendChild(LDR.SVG.makeZoom(true, 1));
    this.cameraButtons.appendChild(this.zoomInButton);
    this.zoomOutButton = this.createDiv('zoom_out_button', 'zoomOut();');
    this.zoomOutButton.appendChild(LDR.SVG.makeZoom(false, 1));
    this.cameraButtons.appendChild(this.zoomOutButton);
    this.zoomInButtonLarge = this.createDiv('zoom_in_button_large', 'zoomIn();');
    this.zoomInButtonLarge.appendChild(LDR.SVG.makeZoom(true, 2));
    this.cameraButtons.appendChild(this.zoomInButtonLarge);
    element.appendChild(this.cameraButtons);

    var lowerRightButtons = this.createDiv('lower_right_buttons');

    this.nextButton = this.createDiv('next_button', 'nextStep();');
    lowerRightButtons.append(this.nextButton);

    this.rightArrowLarge = LDR.SVG.makeRightArrowLarge();
    this.rightArrowNormal = LDR.SVG.makeRightArrow();
    this.nextButton.appendChild(this.rightArrowLarge);
    this.nextButton.appendChild(this.rightArrowNormal);

    element.appendChild(lowerRightButtons);

    this.doneButton = this.createDiv('done_button', 'clickDone();');
    this.doneButton.append(LDR.SVG.makeCheckMark());
    lowerRightButtons.appendChild(this.doneButton);

    if(addTopButtons) {
	this.addTopButtonElements(element, homeLink, mainImage);
    }
    this.hideElementsAccordingToOptions();

    this.fadeOutHandle;
    this.fadingIn = false;
    var fadeOut = function() {
	self.fadeOutHandle = undefined;
	$('#camera_buttons').fadeTo(1000, 0);
    }
    var onFadeInComplete = function() {
	self.fadingIn = false;
        self.fadeOutHandle = setTimeout(fadeOut, 1000);
    }

    var runCameraFading = function() {
	if(ldrOptions.showCameraButtons == 2)
	    return; // Do not show anything.
	if(self.fadingIn)
	    return; // Currently fading in. Do nothing.

        $('#camera_buttons').stop(); // Stop fade out.
	if(self.fadeOutHandle)
	    clearTimeout(self.fadeOutHandle);
	self.fadingIn = true;
	$('#camera_buttons').fadeTo(1000, 1, onFadeInComplete);
    };
    $("canvas, #camera_buttons").mousemove(runCameraFading);
    $("#camera_buttons").click(runCameraFading);
    onFadeInComplete();
}

LDR.Buttons.prototype.addTopButtonElements = function(element, homeLink, mainImage) {
    // Upper row of buttons (added last due to their absolute position):    
    this.topButtons = this.createDiv('top_buttons');

    this.topButtons.appendChild(this.backButton);

    this.homeButton = this.createDiv('homeButton');
    if(mainImage) {
	this.homeButton.setAttribute('class', 'image');
    }

    this.stepToButton = this.createDiv('stepToContainer');
    this.stepToButton.appendChild(this.makeStepTo());
    this.topButtons.appendChild(this.stepToButton);

    var homeA = document.createElement('a');
    homeA.setAttribute('href', homeLink);
    homeA.setAttribute('class', 'homeAnchor');
    homeA.appendChild(this.homeButton);
    if(mainImage) {
	var img = document.createElement('img');
	img.setAttribute('src', mainImage);
	this.homeButton.appendChild(img);
    }
    else {
	this.homeButton.appendChild(LDR.SVG.makeHome());
    }
    this.topButtons.appendChild(homeA);

    this.optionsButton = this.createDiv('optionsButton');
    this.optionsButton.appendChild(LDR.SVG.makeOptions());
    this.topButtons.appendChild(this.optionsButton);

    element.appendChild(this.topButtons);
}

LDR.Buttons.prototype.hideElementsAccordingToOptions = function() {
    // LR Buttons:
    if(ldrOptions.showLRButtons === 2) {
	this.backButton.style.display = this.nextButton.style.display = 'none';
    }
    else if(ldrOptions.showLRButtons === 0) {
	this.rightArrowNormal.style.display = 'none';
    }
    else {
	this.rightArrowLarge.style.display = 'none';
    }
    // Camera Buttons:
    if(ldrOptions.showCameraButtons === 2) {
	this.zoomInButtonLarge.style.display = 'none';
	this.zoomOutButtonLarge.style.display = 'none';
	this.zoomInButton.style.display = 'none';
	this.zoomOutButton.style.display = 'none';
	this.resetCameraButton.style.visibility = 'hidden';
    }
    else if(ldrOptions.showCameraButtons === 0) {
	this.zoomInButtonLarge.style.display = 'none';
	this.zoomOutButtonLarge.style.display = 'none';
    }
    else {
	this.zoomInButton.style.display = 'none';
	this.zoomOutButton.style.display = 'none';
    }
}

// Step to input field:
LDR.Buttons.prototype.makeStepTo = function() {
    this.stepInput = document.createElement("input");
    this.stepInput.setAttribute("id", "pageNumber");
    this.stepInput.setAttribute("onClick", "this.select();");
    return this.stepInput;
}

// Primitive helper methods for creating elements for buttons:
LDR.Buttons.prototype.createDiv = function(id, onclick) {
    var ret = document.createElement('div');
    ret.setAttribute('id', id);
    if(onclick)
	ret.setAttribute('onclick', onclick);
    return ret;
}

// Functions for hiding next/prev buttons:
LDR.Buttons.prototype.atFirstStep = function() {
    this.backButton.style.visibility = 'hidden';
    this.nextButton.style.visibility = 'visible';
    this.doneButton.style.visibility = 'hidden';
}
LDR.Buttons.prototype.atLastStep = function() {
    this.backButton.style.visibility = 'visible';
    this.nextButton.style.visibility = 'hidden';
    this.doneButton.style.visibility = 'visible';
}
LDR.Buttons.prototype.atAnyOtherStep = function() {
    this.backButton.style.visibility = this.nextButton.style.visibility = 'visible';
    this.doneButton.style.visibility = 'hidden';
}
LDR.Buttons.prototype.setShownStep = function(step) {
    this.stepInput.value = ""+step;
}
