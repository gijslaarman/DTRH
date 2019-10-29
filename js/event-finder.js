const sortBtns = document.querySelectorAll('.sorting button')
const filterBtns = document.querySelectorAll('input[name=category]')
let data = []

function onPageLand() {
    if (window.location.query) {
        let query = window.location.search.split('=')[1].split('+')
        filterBtns.forEach(btn => {
            if ( !query.includes(btn.value) ) {
                btn.parentNode.classList.remove('active')
                btn.checked = false
            }
        })
    }

    loadEvents()
}

sortBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        // Filters out the other sort button and removes active class elements, so the sorting only returns one sort method.
        let sibling

        sortBtns.forEach(el => {
            if (el !== this) {
                return sibling = el
            }
        })

        sibling.classList.remove('active')
        sibling.classList.remove('reverse')

        // Three step sorting, Sort by this category, reverse it and remove the sorting.
        if (!this.getAttribute('class').includes('active')) {
            this.classList.add('active');
        } else if (!this.getAttribute('class').includes('reverse')) {
            this.classList.add('reverse');
        } else {
            this.classList.remove('active')
            this.classList.remove('reverse')
        }

        loadEvents()
    })
})

filterBtns.forEach(btn => {
    btn.addEventListener('change', function () {
        this.parentNode.classList.toggle('active')

        loadEvents()
    })
})

document.getElementById('search').addEventListener('click', function () {
    const searchInput = document.getElementById('search-form')
    searchInput.classList.toggle('active');

    if (searchInput.getAttribute('class').includes('active')) {
        searchInput.focus()
    }

    loadEvents()
})

document.getElementById('search-form').addEventListener('keyup', loadEvents)


function createElements(json) {
    // Create date array, [d, m, y]
    dateArray = json.acf.date.split('/')

    // Date Element
    let date = document.createElement('div')
    date.setAttribute('class', 'date')
    let dateInner = document.createElement('p')
    dateInner.innerText = dateArray[0]
    let span = document.createElement('span')
    span.innerText = dateArray[1].slice(0,3) + ` '${dateArray[2]}`
    dateInner.appendChild(span)

    date.appendChild(dateInner)

    // Event element
    let event = document.createElement('div')
    event.setAttribute('class', 'event')
    let title = document.createElement('h5')
    title.innerText = json.title.rendered
    let subtitle = document.createElement('p')
    subtitle.innerText = json.acf.subtitle

    event.appendChild(title)
    event.appendChild(subtitle)

    // Tips element
    let tips = document.createElement('div')
    tips.setAttribute('class', 'tips')
    let p = document.createElement('p')
    p.innerText = `Tips: ${json.acf.tips}`

    tips.appendChild(p)

    return [date, tips, event]
}

function renderEvents(json) {
    // Load in the json that is formatted in the right order
    const eventWrapper = document.getElementById('events')
    eventWrapper.innerHTML = ''
    
    json.forEach(event => {
        const a = document.createElement('a')
        a.setAttribute('href', window.location.href + `/events/${event.slug}`)
        a.setAttribute('class', 'flex align-center white-block')
        
        createElements(event).forEach(div => a.appendChild(div))
        eventWrapper.appendChild(a)
    })
}

function getFilters() {
    // Returns array of the active filters' values
    return [...filterBtns].map(filter => {
        if (filter.checked) {
            return filter.value
        }
    }).filter(filter => filter !== undefined)
}

function getSorting() {
    let activeSort

    sortBtns.forEach(btn => {
        if (btn.getAttribute('class').includes('active')) {
            activeSort = btn
        }
    })

    if (activeSort) {
        return {
            category: activeSort.getAttribute('data'),
            direction: activeSort.getAttribute('class').includes('reverse') ? 'reverse' : 'normal'
        }
    } else {
        return undefined
    }
}

function loadEvents() {
    const searchInput = document.getElementById('search-form')
    let searchValue = searchInput.value
    if (!searchInput.getAttribute('class').includes('active')) {
        // If direct search field is not active, reset the value without removing the text in the field.
        searchValue = undefined
    }

    // Filter out items by category, and name
    let filtered = [...data]
        .filter(item => getFilters().includes(item.acf.category))

    if (searchValue && searchValue.length > 2) {
        filtered = filtered.filter(item => item.title.rendered.toLowerCase().includes(searchValue.toLowerCase()))
    }

    if (!getSorting()) {
        // end here and load 
        return renderEvents(filtered)
    }

    // else sort the data
    let sorted

    if (getSorting().category === 'tips') {
        // Sort by amount of tips
        sorted = filtered.sort((a, b) => (parseFloat(a.acf[getSorting().category]) > parseFloat(b.acf[getSorting().category])) ? 1 : -1)
    } else {
        // Sort by date
        sorted = filtered.sort((a, b) => new Date(b.acf.date) - new Date(a.acf.date)).reverse()
    }

    getSorting().direction === 'reverse' ? sorted : sorted.reverse()

    return renderEvents(sorted)
}

fetch('https://api.gijslaarman.nl/wp-json/wp/v2/events')
    .then(result => result.json())
    .then(json => data = json)
    .then(onPageLand)