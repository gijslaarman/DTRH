const menuTogglers = document.querySelectorAll('.toggle-menu')

menuTogglers.forEach(toggle => {
    toggle.addEventListener('click', () => {
        document.getElementById('header-menu').classList.toggle('open')
        document.querySelector('.menu-bg').classList.toggle('open')
    })
})

const sortBtns = document.querySelectorAll('.sorting button')
sortBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        if (!this.getAttribute('class').includes('active') ) {
            this.classList.add('active');
        } else if (!this.getAttribute('class').includes('reverse')) {
            this.classList.add('reverse');
        } else {
            this.classList.remove('active')
            this.classList.remove('reverse')
        }
    })
})

// document.getElementById('search').addEventListener('click', function() {
//     document.getElementById('search-form').classList.toggle('active');
// })

// document.getElementById('filter-btn').addEventListener('click', function() {
//     document.querySelector('.filter').classList.toggle('active')
// })