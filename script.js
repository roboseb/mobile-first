//Drop down hamburger menu logic.
const Menu = (() => {
    const menuButton = document.getElementById('menubtn');
    const menu = document.getElementById('menu');

    //Get menu height so that it can animate properly, then hide it.
    const menuHeight = `${menu.offsetHeight}px`;
    menu.style.maxHeight = '0';

    let menuOpen = false;
    

    //Open menu if it is closed, otherwise open it.
    menuButton.addEventListener('click', () => {
        spin();

        if (!menuOpen) {
            menu.style.maxHeight = '500px';
            menuOpen = true;
        } else {
            menu.style.maxHeight = '0';
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

    //Change scrolling style on button click.
    const scrollButton = document.querySelector('.smoothscrollbtn');
    let smoothScrolling = true;

    scrollButton.addEventListener('click', () => {
        const viewerBox = document.getElementById('viewerbox');
        if (smoothScrolling) {
            viewerBox.style.scrollBehavior = 'initial';
            smoothScrolling = false;
            scrollButton.classList.add('menubtndown');
        } else {
            viewerBox.style.scrollBehavior = 'smooth';
            smoothScrolling = true;
            scrollButton.classList.remove('menubtndown');
        }
    });

    //Toggle dark mode on and off on button press.
    const darkButton = document.querySelector('#darkmodebtn');
    let darkMode = false;
    const root = document.documentElement;


    darkButton.addEventListener('click', () => {
        if (darkMode) {
            //Reset all colors to their defaults.
            darkMode = false;
            darkButton.classList.remove('menubtndown');
            
            root.style.setProperty('--backdrop', '#f7fff6');
            root.style.setProperty('--primary', '#87D68D');
            root.style.setProperty('--secondary', '#BCEBCB');
            root.style.setProperty('--accent', '#b948b3');
            root.style.setProperty('--accentlight', '#e4a5e1');

            root.style.setProperty('--base-shadow', '0 5px 5px rgb(146, 146, 146)');
            root.style.setProperty('--menu-shadow', '0 5px 5px rgb(85, 85, 85)');
            root.style.setProperty('--text-color', 'black');

        } else {
            //Set all colors to dark mode colors.
            darkMode = true;
            darkButton.classList.add('menubtndown');

            root.style.setProperty('--backdrop', '#6b6a6a');
            root.style.setProperty('--primary', '#295633');
            root.style.setProperty('--secondary', '#49994f');
            root.style.setProperty('--accent', '#b948b3');
            root.style.setProperty('--accentlight', '#bf75bc');

            root.style.setProperty('--base-shadow', '0 5px 5px #000000');
            root.style.setProperty('--menu-shadow', '0 5px 5px #000000');
            root.style.setProperty('--text-color', 'white');
        }
    });


})();

//Image viewer logic.
const Viewer = (() => {
    const viewerBox = document.getElementById('viewerbox');

    let imageList = {};

    //Add all mocchan images to the dom and then those elements to an array.
    for (let i = 0; i < 6; i++) {
        const newImg = document.createElement('img');
        newImg.src = `images/mocchan${i + 1}.png`;
        imageList[`moc${i + 1}`] = newImg; 
        viewerBox.appendChild(imageList[`moc${i + 1}`]);
    }

    let timer = null;
    let offsetList = {};

    const centerImage = () => {

        //Set the image that is closest to the center to center.
        Object.keys(imageList).forEach(key => {
            const rect = imageList[key].getBoundingClientRect();
            const offset = rect.left + rect.right;
            offsetList[key] = offset;
        });

        //Used to compare each image's offset to find one closer to 360.
        let goal = 360;

        //Assign closest to the image that is most centered.
        const offsetArray  = Object.values(offsetList);
        const closest = offsetArray.reduce(function(prev, curr) {
            return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
        });

        //Get an object's key from its value.
        function getKeyByValue(object, value) {
            return Object.keys(object).find(key => object[key] === value);
        }
        
        const centerImage = getKeyByValue(offsetList, closest);

        //Get index of the most centered image.
        const index = Object.keys(offsetList).indexOf(centerImage);

        //Get width of images and the padding of the viewerbox.
        const imageWidth = imageList['moc1'].offsetWidth;  
        viewerStyles = window.getComputedStyle(viewerBox);
        const padding = viewerStyles.getPropertyValue('padding');
        const paddingLeft = parseInt(padding.slice(0, -2));

        //Set scroll position based on index of most centered pic.
        if (index === 0) {
            viewerBox.scrollTo((imageWidth * index) + index, 0);
        } else {
            viewerBox.scrollTo((imageWidth * index) + (paddingLeft * index), 0);
        }
    }


    viewerBox.addEventListener('scroll', () => {
        //Check for when the user has stopped scrolling.
        if(timer !== null) {
            clearTimeout(timer);        
        }

        //After timeout, center the image closest to center.
        timer = setTimeout(function() {
            centerImage();
        }, 50);
    }, false);
})();

//Object for image scrolling buttons.
const ImageButtons = (() => {
    const viewerBox = document.getElementById('viewerbox');
    const imgButtonBox = document.getElementById('imgbtnbox');

    const lastButton = document.getElementById('lastimagebtn');
    const nextButton = document.getElementById('nextimagebtn');

    let timer = null;

    imgButtonBox.addEventListener('click', () => {
        lastButton.classList.add('btnshown');
        nextButton.classList.add('btnshown');

        if (timer !== null) {
            clearTimeout(timer);        
        }

        //After timeout, center the image closest to center.
        timer = setTimeout(function() {
            lastButton.classList.remove('btnshown');
            nextButton.classList.remove('btnshown');
        }, 1000);

    });

    //Event listeners to scroll through images on button click.
    lastButton.addEventListener('click', () => {
        rotateImages('left');
    });
    nextButton.addEventListener('click', () => {
        rotateImages('right');
    });

    //Event listener for scrolling images with keydown.
    document.addEventListener('keydown', (key) => {
        //Prevent using arrow keys for default browser scrolling.
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(key.code) > -1) {
            key.preventDefault();
        }
    
        if (key.code === 'ArrowLeft') {
            rotateImages('left');
        } else if (key.code === 'ArrowRight') {
            rotateImages('right');
        }
    });
 

    const rotateImages = (direction) => {
        const scrollAmount  = viewerBox.offsetWidth;

        if (direction === 'right') {
            viewerBox.scrollTo(viewerBox.scrollLeft + scrollAmount - 10, 0);
        } else {
            viewerBox.scrollTo(viewerBox.scrollLeft - scrollAmount + 10, 0);
        }
        
    }


})();