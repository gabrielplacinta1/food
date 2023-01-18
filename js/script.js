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

    outsideModal.addEventListener('click', (event) => {
        if (event.target == modalWindow || event.target.getAttribute('data-close') == '') {
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
        constructor(imageSrc, alt, title, content, price, ...classes) {
            this.imageSrc = imageSrc;
            this.alt = alt;
            this.title = title;
            this.content = content;
            this.price = price;
            this.classes = classes;
        }

        render(parentElement) {
            const newElement = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = 'menu__item';
                newElement.classList.add(this.classes);
            } else {
                this.classes.forEach(className => newElement.classList.add(className));
            }
            
            newElement.innerHTML = `
                <img src=${this.imageSrc} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.content}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            parentElement.append(newElement);
        }
    }

    const menuContainer = document.querySelector('.menu__field .container');

    const getData = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
     };

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                new MenuItem(img, altimg, title, descr, price).render(menuContainer);
            });
        });
    
     // Forms

     const forms = document.querySelectorAll('form');

     const message = {
        loading: 'img/spinner/spinner.svg',
        succes: 'Thanks! Soon you will be contacted',
        failure: 'Something is not working'
     };

     forms.forEach(item => {
        bindPostData(item);
     });

     const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
     };

     function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            form.insertAdjacentElement('afterend', statusMessage);
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showModalWithMsg(message.succes);
            }).catch(() => {
                showModalWithMsg(message.failure);
            }).finally(() => {
                form.reset();
                statusMessage.remove(); 
            });
        });
    }

    function showModalWithMsg(message) {
        const prevModalWindow = document.querySelector('.modal__dialog');

        prevModalWindow.classList.add('hide');
        prevModalWindow.classList.remove('show');
        showModalWindow();

        const messageModalWindow = document.createElement('div');

        messageModalWindow.classList.add('modal__dialog');

        messageModalWindow.innerHTML = `
            <div class="modal__content">
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(messageModalWindow);

        setTimeout(() => {
            messageModalWindow.remove();
            prevModalWindow.classList.add('show');
            prevModalWindow.classList.remove('hide');
            hideModalWindow();
        }, 3000);
    }

    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));
});