//Drop down hamburger menu logic.
const Menu = (() => {
    const menuButton = document.getElementById('menubtn');
    const menu = document.getElementById('menu');

    //Get menu height so that it can animate properly, then hide it.
    const menuHeight = `${menu.offsetHeight}px`;
    menu.style.height = '0px';

    let menuOpen = false;
    

    //Open menu if it is closed, otherwise open it.
    menuButton.addEventListener('click', () => {
        spin();

        if (!menuOpen) {
            menu.style.height = menuHeight;
            menuOpen = true;
        } else {
            menu.style.height = '0px';
            menuOpen = false;
        }
    });

    let spinDegrees = 0;

    //Animate menu button on click.
    spin = () => {
        //Set the angle to spin to based on current angle.
        spinDegrees === 0 ? spinDegrees = 180 : spinDegrees = 0;
    
        menuButton.style.transform = `rotate(${spinDegrees}deg)`;
    }
})();

//Image viewer logic.
const Viewer = (() => {
    const viewerBox = document.getElementById('viewerbox');
    viewerBox.style.backgroundColor = 'pink';

    let imageList = {};

    //Add all mocchan images to the dom and then those elements to an array.
    for (let i = 0; i < 6; i++) {
        const newImg = document.createElement('img');
        newImg.src = `images/mocchan${i + 1}.png`;
        imageList[`moc${i + 1}`] = newImg; 
    }

    viewerBox.appendChild(imageList['moc1']);
    viewerBox.appendChild(imageList['moc2']);

    let lastScrollTop = 0;

    viewerBox.addEventListener('scroll', () => {
        
        const st = viewerBox.pageXOffset || viewerBox.scrollLeft;
        if (st > lastScrollTop){
            console.log('scrolling down');
        } else {
           console.log('scrolling up');
        }
        lastScrollTop = st <= 0 ? 0 : st;
    }, false);

})();