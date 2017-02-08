$(function(){
    var events = {
        "h1" : {
            click : function(){
                alert("click! on " + this.tagName)        
            },
            mouseenter : function(){
                console.log("mouseenter! on " + this.tagName);
            },
            mousedown : function(){
                console.log("mousedown! on " + this.tagName);
            }
        },
        "h2" : {
            click : function(){
                alert("click! on " + this.tagName)       
            },
            mouseenter : function(){
                console.log("mouseenter! on " + this.tagName);
            },
            mouseup : function(){
                console.log("mouseup! on " + this.tagName);
            }
        },
    }
    
    function hookEvent(selector, events) {
        for (var eventName in events) {
            var callback = events[eventName];
            $(document).on(eventName, selector, callback);
        }
    }
    
    function hookEvents(events) {
        for (var selectorName in events) {
            hookEvent(selectorName, events[selectorName])
        }
    }
    
    hookEvents(events);
})