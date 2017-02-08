(function(){
    
    var rectsCounter = 1;
    var ovalsCounter = 1;
    var selectedShape = null;
    var previousSelectedShape = null;
    var x_pos = 0;
    var y_pos = 0;
    var x_elem = 0;
    var y_elem = 0;
    var startX = 0;
    var startY = 0;
    var startWidth = 0;
    var startHeight = 0;
    var shapeToResize = null
    var colors = ["rgb(255,0,0)", "rgb(0,255,0)", "rgb(0,0,255)", "rgb(200,150,25)", "rgb(255,0,150)", "rgb(30,120,155)","rgb(252,126,0)","rgb(70,150,16)"];
    var currentControllerClass;
    var shapesDataHolder;
    var saveKey = "";    
    
    var insertRect = document.querySelector('#insertRect');
    var insertOval = document.querySelector('#insertOval');
    var clearSketch = document.querySelector('#clearSketch');
    var saveSketch = document.querySelector('#saveSketch');
    var loadSketch = document.querySelector('#loadSketch');
    var canvas = document.querySelector('#canvas');
    
    insertRect.addEventListener("click", renderRect);    
    insertOval.addEventListener("click", renderOval);
    clearSketch.addEventListener("click", clearCanvas);
    saveSketch.addEventListener("click", savePopUp);
    loadSketch.addEventListener("click", loadPopUp);

    function clearCanvas(){
        var shapesCollection = canvas.querySelectorAll('div');
        
        for(var i=0 ; i < shapesCollection.length ; i++){
            shapesCollection[i].className.search("Rect") >= 0 || shapesCollection[i].className.search("Oval") >= 0 ? canvas.removeChild(shapesCollection[i]) : null;
        }
        rectsCounter = 1;
        ovalsCounter = 1;
    }
    
    function saveMySketch(){
        var dbSlotName = document.querySelector('#drawingName');
        removePopUp();
        shapesDataHolder = [];
        
        var shapesCollection = canvas.childNodes;
        
        for(var i=0 ; i < shapesCollection.length ; i++){
            shapesDataHolder[i] = convertToObj(shapesCollection[i]);
        }
        saveKey = dbSlotName.value;
        localStorage.setItem(saveKey, JSON.stringify(shapesDataHolder));
        
    }
    
    function loadMySketch(){
        var dbSlotName = document.querySelector('#drawingName');
        removePopUp();
        clearCanvas();
        
        var shapesCollection = JSON.parse(localStorage.getItem(dbSlotName.value));
        for(var i=0 ;  i < shapesCollection.length ; i++){
            renderFromLoad(shapesCollection[i]);
        }       
    }
    
    function convertToObj (shape){
        var obj = {
            "class":shape.className,
            "atrr":shape.getAttribute("style")
        };
        
        return obj;
    }
    
    function removePopUp (){
        var popUpBg = document.querySelector('#popUp');
        document.body.removeChild(popUpBg);
    }
    
    function savePopUp (){
        var popUpBg = document.createElement('div');
        popUpBg.id = "popUp";
        
        var saveForm = document.createElement('form');
        saveForm.classList.add('saveForm');
        
        var formLabel = document.createElement('label');
        formLabel.textContent = "Please enter drawing name: ";
        
        
        var nameInput = document.createElement('input');
        nameInput.setAttribute('type','text');
        nameInput.id = 'drawingName';
        
         var submitBtn = document.createElement('button');
        submitBtn.attributes.type = 'submit';
        submitBtn.textContent = 'Save';
        submitBtn.onclick = function(e){
            e.preventDefault();
            saveMySketch();
        }
        
        saveForm.appendChild(formLabel);
        saveForm.appendChild(nameInput);
        saveForm.appendChild(submitBtn);
        
        popUpBg.appendChild(saveForm);
        
        document.body.appendChild(popUpBg);
    }
    
    function loadPopUp (){
        var popUpBg = document.createElement('div');
        popUpBg.id = "popUp";
        
        var loadForm = document.createElement('form');
        loadForm.classList.add('saveForm');
        
        var formLabel = document.createElement('label');
        formLabel.textContent = "Please enter drawing name: ";
        
        
        var nameSelection = document.createElement('select');
        nameSelection.id = 'drawingName';        
        
        for(var i=0 ; i < localStorage.length ; i++){
            var option = document.createElement('option');
            option.setAttribute("value", localStorage.key(i));
            option.textContent = localStorage.key(i);
            nameSelection.appendChild(option);
        }

        var submitBtn = document.createElement('button');
        submitBtn.attributes.type = 'submit';
        submitBtn.textContent = 'Load';
        submitBtn.onclick = function(e){
            e.preventDefault();
            loadMySketch();
        }
    
        loadForm.appendChild(formLabel);
        loadForm.appendChild(nameSelection);
        loadForm.appendChild(submitBtn);
        
        popUpBg.appendChild(loadForm);
        
        document.body.appendChild(popUpBg);
    }
    
     function renderFromLoad(loadedShapes){
               
        var div = document.createElement('div');
        div.setAttribute('style', loadedShapes.atrr);
        div.className = loadedShapes.class;
        attachShapeEvents(div);
        canvas.appendChild(div);
       
    }
    
    function renderRect(){
        
            var div = document.createElement('div');
            var colorPickerIcon = document.createElement('div');
            var size = Math.floor(Math.random() * 30) + 10 + "%";
            div.style.position = 'absolute';
            div.style.left = Math.floor(Math.random() * 500) + "px";;
            div.style.top = Math.floor(Math.random() * 500) + "px";;
            div.style.width = size;
            div.style.height = size;
            div.style.background = colors[Math.floor(Math.random() * (colors.length))];
            div.className = "Rect_" + rectsCounter;        

            attachShapeEvents(div);

            canvas.appendChild(div);
            rectsCounter++;
            previousSelectedShape!== null && previousSelectedShape !== div ? removeShapeControllers() : null;
            addShapeResizeControllers(div);
            addColorPickerIcon(div);
    }
    
    function renderOval(){
         
            var div = document.createElement('div');
            var size = Math.floor(Math.random() * 50) + 30;
            div.style.position = 'absolute';
            div.style.left = Math.floor(Math.random() * 500) + "px";;
            div.style.top = Math.floor(Math.random() * 500) + "px";;
            div.style.width = size + "vw";
            div.style.height = size + "vh";
            div.style.background = colors[Math.floor(Math.random() * (colors.length))];
            div.style.borderRadius = size + "%";
            div.className = "Oval_" + ovalsCounter;

            attachShapeEvents(div);

            canvas.appendChild(div);
            ovalsCounter++;
            previousSelectedShape!== null && previousSelectedShape !== div ? removeShapeControllers() : null;
            addShapeResizeControllers(div);
            addColorPickerIcon(div);

    }
    
    
    function generateColorPicker(colorsToUse, shape){
        console.log(colorsToUse);
        var colorPicker = document.createElement('div');
        colorPicker.classList.add('colorPicker');
        for(var i=0 ; i < colorsToUse.length ; i++){
            var colorDiv = document.createElement('div');
            colorDiv.classList.add('colorPick');
            colorDiv.style.background = colorsToUse[i];
            colorDiv.onclick = function (e){
                assignSelectedColor(e);
            }
            colorPicker.appendChild(colorDiv);
        }
        shape.appendChild(colorPicker);
    }
    
    function assignSelectedColor(e){
        e.stopPropagation();
        shapeToResize = document.querySelector("." + e.target.parentNode.className);
        shapeToResize = document.querySelector("." + shapeToResize.parentNode.className);
        var selectedColor = e.target.style.background;
    
        shapeToResize.style.background = selectedColor;
        shapeToResize = document.querySelector("." + e.target.parentNode.className);
        previousSelectedShape.removeChild(shapeToResize);
    }
    
    function attachShapeEvents(shape){
        shape.onmousedown = function (e) {
            e.stopPropagation();
            moveShapeInit(shape);
        }
            
        shape.onmouseup = function (){
            clearMovedElement(shape);
        }
    }
    
    function addShapeResizeControllers(shape){
        
        if(shape.childElementCount === 0){
            var controllerTL = document.createElement('div');
            var controllerTR = document.createElement('div');
            var controllerBL = document.createElement('div');
            var controllerBR = document.createElement('div');
            
            controllerTL.classList.add('controller', 'tl');
            controllerTR.classList.add('controller', 'tr');
            controllerBL.classList.add('controller', 'bl');
            controllerBR.classList.add('controller', 'br');
            
            controllerTL.addEventListener("mousedown", initControllerEvent);
            controllerTR.addEventListener("mousedown", initControllerEvent);
            controllerBL.addEventListener("mousedown", initControllerEvent);
            controllerBR.addEventListener("mousedown", initControllerEvent);
            
            shape.appendChild(controllerTL);
            shape.appendChild(controllerTR);
            shape.appendChild(controllerBL); 
            shape.appendChild(controllerBR);
            
        }
    }
    
    function addColorPickerIcon(shape){
       
        var colorPickerIcon = document.querySelector('.colorPickerIcon');

        if(!colorPickerIcon){
            var colorPickerIcon = document.createElement('div');
            colorPickerIcon.classList.add('fa', 'fa-paint-brush', 'colorPickerIcon');
            colorPickerIcon.onmousedown = function (){
                generateColorPicker(colors, shape);
            }
            shape.appendChild(colorPickerIcon);
        }
    }
    
    
    function removeShapeControllers(){
        if(previousSelectedShape){
            var controllers = document.querySelectorAll('.controller');
            var colorPickerIcons = document.querySelectorAll('.colorPickerIcon');
            var colorPicker = document.querySelector('.colorPicker');
            for(var i=0 ; i < controllers.length ; i++){
                previousSelectedShape.removeChild(controllers[i]);
            }
            for(var i=0 ; i < colorPickerIcons.length ; i++){
                previousSelectedShape.removeChild(colorPickerIcons[i]);
            }
            colorPicker ? previousSelectedShape.removeChild(colorPicker) : null;
            previousSelectedShape = null;
        }
    }
    
    function moveShapeInit(shape){
        selectedShape = shape;
        x_elem = x_pos - selectedShape.offsetLeft;
        y_elem = y_pos - selectedShape.offsetTop;
       
        previousSelectedShape!== null && previousSelectedShape !== shape ? removeShapeControllers() : null;
        addShapeResizeControllers(selectedShape);
        addColorPickerIcon(selectedShape);
       
       
    }
    
    function moveShape(e) {
        x_pos = window.event.clientX;
        y_pos = window.event.clientY;
        
        if (selectedShape !== null) {
            selectedShape.style.left = (x_pos - x_elem) + 'px';
            selectedShape.style.top = (y_pos - y_elem) + 'px';
        }
    }
    
    function clearMovedElement(shape) {
        selectedShape = null;
        previousSelectedShape = shape;
    }
    
    function initControllerEvent(e){
        e.stopPropagation();
        currentControllerClass = e.target.className;
        shapeToResize = document.querySelector("." + e.target.parentNode.className);
        startX = e.clientX;
        startY = e.clientY;
        startWidth = shapeToResize.clientWidth;
        startHeight = shapeToResize.clientHeight;
        window.addEventListener("mousemove", resizeShape);
        window.addEventListener("mouseup", removeControllerEvent);
    }
    
    function removeControllerEvent(){
        window.removeEventListener("mousemove", resizeShape);
        window.removeEventListener("mouseup", removeControllerEvent);
        shapeToResize = null;
    }
    
    function resizeShape(e){
        e.stopPropagation();
        if(currentControllerClass.indexOf('br', currentControllerClass.length-3) > 0){
            shapeToResize.style.width = (startWidth + e.clientX - startX) + 'px';
            shapeToResize.style.height = (startHeight + e.clientY - startY) + 'px';

        }else if(currentControllerClass.indexOf('tl', currentControllerClass.length-3) > 0){            
            shapeToResize.style.width = startWidth + (startX - e.clientX) + 'px';
            shapeToResize.style.height = startHeight + (startY - e.clientY) + 'px';
            shapeToResize.style.left = e.clientX + 'px';
            shapeToResize.style.top = e.clientY + 'px';

        }else if(currentControllerClass.indexOf('tr', currentControllerClass.length-3) > 0){            
            shapeToResize.style.width = (startWidth + e.clientX - startX) + 'px';
            shapeToResize.style.height = startHeight + (startY - e.clientY) + 'px';
            shapeToResize.style.top = e.clientY + 'px';

        }else{
            shapeToResize.style.width = startWidth + (startX - e.clientX) + 'px';
            shapeToResize.style.height = (startHeight + e.clientY - startY) + 'px';
            shapeToResize.style.left = e.clientX + 'px';
            
        }

    }
    
    canvas.onmousemove = moveShape;
    canvas.onmousedown = removeShapeControllers;
    canvas.onmouseup = clearMovedElement(selectedShape);
}());