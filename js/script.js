window.addEventListener('DOMContentLoaded', () => {
    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');    

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(tab => {
            tab.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadline = '2023-01-20';

    function addZero(n) {
        if (n >= 0 && n < 10) {
            return `0${n}`;
        } else return n;
    }
    
    function getRemainingTime (limitTime) {
        const currentTime = new Date(),
              remainingTime = Date.parse(limitTime) - Date.parse(currentTime),
              seconds = Math.floor((remainingTime / 1000) % 60),   
              minutes = Math.floor((remainingTime / 1000 / 60) % 60),
              hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24),
              days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));

        return {
            'remainingTime': remainingTime,
            'seconds': seconds,
            'minutes': minutes,
            'hours': hours,
            'days': days
        };      
    }

    function setTime () {
        let time = getRemainingTime(deadline);
        const days = document.querySelector('#days'),
              hours = document.querySelector('#hours'),
              minutes = document.querySelector('#minutes'),
              seconds = document.querySelector('#seconds');
              updateTime = setInterval(updateClock, 1000);

        updateClock();
        
        function updateClock() {
            time = getRemainingTime(deadline);
            
            if (time.remainingTime <= 0) {
                clearInterval(updateTime);
                days.innerHTML = '00';
                hours.innerHTML = '00';
                minutes.innerHTML = '00';
                seconds.innerHTML = '00';
            } else {
                days.innerHTML = addZero(time.days);
                hours.innerHTML = addZero(time.hours);
                minutes.innerHTML = addZero(time.minutes);
                seconds.innerHTML = addZero(time.seconds); 
            }
        }    
    }

    setTime();

    const modalBtns = document.querySelectorAll('button[data-modal]'),
          modalWindow = document.querySelector('.modal'),
          closeModalBtn = document.querySelector('.modal__close[data-close]'),
          outsideModal = document.querySelector('body');

    function showModalWindow() {
        modalWindow.classList.add('show');
        modalWindow.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(showModalAfter10Sec);
        document.removeEventListener('scroll', showModalWindowByScroll);
    }    
    
    function hideModalWindow() {
        modalWindow.classList.remove('show');
        modalWindow.classList.add('hide');
        document.body.style.overflow = '';
    }

    modalBtns.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            showModalWindow();
        });
    });

    closeModalBtn.addEventListener('click', (event) => {
        event.preventDefault();
        hideModalWindow();
    });

    outsideModal.addEventListener('click', (event) => {
        if (event.target == modalWindow) {
            hideModalWindow();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' && modalWindow.classList.contains('show')) {
            hideModalWindow();
        }
    });

    const showModalAfter10Sec = setTimeout(() => {
        showModalWindow();
    }, 10000);

    function showModalWindowByScroll() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            showModalWindow();
            document.removeEventListener('scroll', showModalWindowByScroll);
        }
    }
    
    document.addEventListener('scroll', showModalWindowByScroll);

    class MenuItem {
        constructor(imageSrc, alt, title, content, price) {
            this.imageSrc = imageSrc;
            this.alt = alt;
            this.title = title;
            this.content = content;
            this.price = price;
        }

        render(parentElement) {
            const newElement = document.createElement('div');
            newElement.innerHTML = `
                <div class="menu__item">
                    <img src=${this.imageSrc} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.content}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                </div>
            `;
            parentElement.append(newElement);
        }
    }

    const menuContainer = document.querySelector('.menu__field .container');

    new MenuItem(
        'img/tabs/vegy.jpg',
        'vegy',
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        229
    ).render(menuContainer);

    new MenuItem(
        'img/tabs/elite.jpg',
        'elite',
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        550
    ).render(menuContainer);

    new MenuItem(
        'img/tabs/post.jpg',
        'post',
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        430
    ).render(menuContainer);
    
     
});