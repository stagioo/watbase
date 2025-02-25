document.addEventListener('DOMContentLoaded', () => {
    const phrases = document.querySelectorAll('.container-phrase');
    const totalPhrases = phrases.length;
    let isScrolling = false;
    let wheelTimeout = null;
    let touchpadDelta = 0;

    
    document.body.style.height = `${totalPhrases * 100}vh`;

    
    const updatePhrases = () => {
        const scrollPos = window.scrollY;
        const windowHeight = window.innerHeight;

        phrases.forEach((phrase, index) => {
            const progress = (scrollPos - index * windowHeight) / windowHeight;
            
            if (Math.abs(progress) <= 1) {
                const opacity = 1 - Math.abs(progress);
                const scale = 1 - Math.abs(progress) * 0.3;
                const y = -progress * windowHeight * 0.5;
                
                phrase.style.opacity = opacity;
                phrase.style.transform = `translateY(${y}px) scale(${scale})`;
            } else {
                phrase.style.opacity = 0;
            }
        });
    };

    
    const handleScroll = (delta) => {
        const currentIndex = Math.round(window.scrollY / window.innerHeight);
        const targetIndex = Math.max(0, Math.min(currentIndex + Math.sign(delta), totalPhrases - 1));
        
        window.scrollTo({
            top: targetIndex * window.innerHeight,
            behavior: 'smooth'
        });
    };

    
    const isTouchpad = (event) => {
        if (event.wheelDeltaY) {
            return Math.abs(event.wheelDeltaY) !== 120;
        }
        return Math.abs(event.deltaY) < 50;
    };

    
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        if (isScrolling) return;
        
        
        if (isTouchpad(e)) {
            touchpadDelta += e.deltaY;
            
            if (Math.abs(touchpadDelta) > 100) {
                handleScroll(touchpadDelta);
                touchpadDelta = 0;
                isScrolling = true;
                
                setTimeout(() => {
                    isScrolling = false;
                }, 600);
            }
        } else { 
            handleScroll(e.deltaY);
            isScrolling = true;
            
            setTimeout(() => {
                isScrolling = false;
            }, 600);
        }
    }, { passive: false });

    
    let touchStartY = 0;
    
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
        if (isScrolling) {
            e.preventDefault();
            return;
        }
        
        const touchY = e.touches[0].clientY;
        const delta = touchStartY - touchY;
        
        if (Math.abs(delta) > 30) {
            handleScroll(delta);
            touchStartY = touchY;
            isScrolling = true;
            
            setTimeout(() => {
                isScrolling = false;
            }, 60);
        }
        
        e.preventDefault();
    }, { passive: false });

    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.key)) {
            e.preventDefault();
            handleScroll(e.key === 'ArrowDown' ? 1 : -1);
        }
    });

    window.addEventListener('scroll', updatePhrases);
    updatePhrases();
});


const button = document.getElementById('btn');

button.addEventListener('click', () => {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth' 
    });
});



const input = document.getElementById('emailInput');
const btnSend = document.getElementById('sendButton');

let dataI;


input.addEventListener('input', () => {
    dataI = input.value.trim(); 
});


const isValidEmail = (email) => {
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


btnSend.addEventListener('click', async () => {
    if (!dataI) {
        btnSend.textContent = 'Empty field';
        return;
    }

    if (!isValidEmail(dataI)) {
        btnSend.textContent = 'Invalid email';
        return;
    }

    try {
        const response = await fetch('/api/waitlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({ email: dataI }), 
        });

        if (!response.ok) {
            throw new Error('Error sending email.');
        }

        const result = await response.json();
        console.log('Backend response:', result);
        btnSend.textContent = result.message; 
    } catch (error) {
        console.error('Error:', error);
        btnSend.textContent = 'Error, please try again'; 
    }
});
