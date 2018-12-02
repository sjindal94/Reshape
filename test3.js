
    const distances=[300,400,500];
    let dragItem = document.querySelector("#item");
    let container = document.querySelector("#container");
    let bar = document.querySelector("#bar");
    let shadow = document.querySelector("#shadow");
    let count=0;
    let direction=1;
    let active = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    let start;
    let total=0;
    let delta=[];

    container.addEventListener("touchstart", dragStart, false);
    container.addEventListener("touchend", dragEnd, false);
    container.addEventListener("touchmove", drag, false);

    container.addEventListener("mousedown", dragStart, false);
    container.addEventListener("mouseup", dragEnd, false);
    container.addEventListener("mousemove", drag, false);
    init(direction);
    function init(n){
      bar.style.backgroundColor = "#89b4c7"
      setTranslate(n*-distances[0]/2,0,dragItem);
      
      xOffset=n*-distances[0]/2;
      yOffset=0;
      
      setTranslate(n*distances[0]/2,0,bar);
    }
    function dragStart(e) {
      if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
      }
      start=Date.now();

      if (e.target === dragItem) {
        active = true;
      }
    }

    function dragEnd(e) {
      initialX=0;
      initialY=0;
      yOffset=0;
      xOffset=-distances[count]/2*direction;
      setTranslate(-distances[count]/2*direction,0,dragItem);
      active = false;
      if(direction*(currentX+-15-direction*distances[count]/2)>-15){
          direction=-1*direction;
          total+=(Date.now-start)
           console.log(Date.now-start);
          count++;
          document.getElementById("text").innerText="Average Time: "+total/count;
          init(direction);
      }
      
    }

    function drag(e) {
      if (active) {
      
        e.preventDefault();
      
        if (e.type === "touchmove") {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, dragItem);
        
        if(direction*(currentX-15-direction*distances[count]/2)>-15){
          bar.style.backgroundColor = "#60C8EB";
        }
        else{
          bar.style.backgroundColor = "#89b4c7";
        }
      }
    }

    function setTranslate(xPos, yPos, el) {
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }
