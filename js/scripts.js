const menuTogglers = document.querySelectorAll('.toggle-menu')

menuTogglers.forEach(toggle => {
    toggle.addEventListener('click', () => {
        document.getElementById('header-menu').classList.toggle('open')
        document.querySelector('.menu-bg').classList.toggle('open')
    })
})