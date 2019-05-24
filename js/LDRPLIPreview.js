/*
  Icon: {x, y, width, height, mult, key, part, colorID, desc}
 */
LDR.PliPreviewer = function(modelID) {
    this.modelID = modelID;
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000000);
    this.resetCameraPosition();
    this.subjectSize = 1;
    
    this.scene = new THREE.Scene(); // To add stuff to
    this.scene.background = new THREE.Color( 0xffffff );

    this.canvas;
    this.controls;
}

LDR.PliPreviewer.prototype.attachRenderer = function(canvas) { 
    this.renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.canvas = canvas;
    this.controls = new THREE.OrbitControls(this.camera, this.canvas);
    var self = this;
    this.controls.addEventListener('change',function(){self.render();});
}

LDR.PliPreviewer.prototype.render = function() {
    if(this.renderer)
	this.renderer.render(this.scene, this.camera);
}

LDR.PliPreviewer.prototype.onResize = function() {
    if(!this.canvas)
	return;
    var w = this.canvas.parentNode.clientWidth;
    var h = this.canvas.parentNode.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.left   = -w;
    this.camera.right  =  w;
    this.camera.top    =  h;
    this.camera.bottom = -h;

    this.resetCameraZoom();
    this.render();
}

LDR.PliPreviewer.prototype.resetCameraZoom = function() {
    if(this.canvas) {
        var sizeMin = Math.min(this.canvas.clientWidth, this.canvas.clientHeight);
	this.camera.zoom = sizeMin / this.subjectSize;
	this.camera.updateProjectionMatrix();
    }
}

LDR.PliPreviewer.prototype.resetCameraPosition = function() {
    this.camera.position.x = 10000;
    this.camera.position.y = 7000;
    this.camera.position.z = 10000;
    this.camera.lookAt(new THREE.Vector3());
    if(this.canvas) {
	this.resetCameraZoom();
	this.render();
    }
}

LDR.PliPreviewer.prototype.zoomIn = function() {
    if(!this.controls)
	return;
    this.controls.dollyIn(1.2);
    this.render();
}

LDR.PliPreviewer.prototype.zoomOut = function() {
    if(!this.controls)
	return;
    this.controls.dollyOut(1.2);
    this.render();    
}
 
LDR.PliPreviewer.prototype.showPliPreview = function(icon) {
    var colorID = icon.colorID;
    var color = LDR.Colors[colorID];

    // Update description:
    var nameEle = document.getElementById('preview_info_name');
    var partIdNoDat = icon.partID.slice(0, -4);
    var desc = icon.desc || partIdNoDat;
    nameEle.innerHTML = desc + " (" + partIdNoDat + ")";
    var blA = document.getElementById('preview_info_bl_link');
    if(color.bricklink_name)
	blA.setAttribute('href', 'https://www.bricklink.com/catalogItemIn.asp?P=' + partIdNoDat + '&colorID=' + color.bricklink_id + '&in=A');
    else
	blA.setAttribute('href', 'https://www.bricklink.com/catalogItem.asp?P=' + partIdNoDat);

    var bhA = document.getElementById('preview_info_bh_link');

    if(icon.inlined && !isNaN(icon.inlined)) {
	bhA.setAttribute('href', "../p/part.php?user_id=" + icon.inlined + "&id=" + encodeURI(partIdNoDat));
	blA.style.visibility = "hidden";
    }
    else if(icon.inlined === undefined || icon.inlined === 'undefined') {
	bhA.setAttribute('href', "../p/part.php?from=" + this.modelID + "&id=" + encodeURI(partIdNoDat));
	blA.style.visibility = "hidden";
    }
    else {
	bhA.setAttribute('href', '../p/' + partIdNoDat);
	blA.style.visibility = "visible";
    }

    document.getElementById('preview_info_color_ldraw').innerHTML = color.name + " (" + colorID + ")";
    document.getElementById('preview_info_color_lego').innerHTML = color.lego_name ? (color.lego_name + " (" + color.lego_id + ")") : 'Unknown official LEGO color';
    document.getElementById('preview_info_color_bricklink').innerHTML = color.bricklink_name ? (color.bricklink_name + " (" + color.bricklink_id + ")") : 'Unknown Bricklink color';
    
    var fadeInTime = 400;
    $('#preview_holder, #preview_background, #preview').fadeIn(fadeInTime);
}

LDR.PliPreviewer.prototype.hidePliPreview = function() {
    var fadeOutTime = 400;
    $('#preview_holder, #preview_background, #preview').fadeOut(fadeOutTime);
}
