const data = fetch('https://api.gijslaarman.nl/wp-json/wp/v2/events').then(result => result.json())

function setupElement(json) {
    // Create date array, [d, m, y]
    dateArray = json.acf.date.split('/')

    // Date Element
    let date = document.createElement('div')
    date.setAttribute('class', 'date')
    let dateInner = document.createElement('p')
    dateInner.innerText = dateArray[0]
    let span = document.createElement('span')
    span.innerText = dateArray[1].slice(0,3)
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

    return [date, event]
}

async function loadinevents() {
    const json = await data;
    const showcase = document.getElementById('showcase-events')

    console.log(json)
    for (let i = 0; i < 3; i++) {
        // Maximum of 3 sorted by coming up next.
        const a = document.createElement('a');
        a.setAttribute('href', window.location.href + `/events/${json[i].slug}`)
        a.setAttribute('class', 'flex align-center no-wrap')

        setupElement(json[i]).forEach(div => a.appendChild(div))
        showcase.appendChild(a)
    }
}

loadinevents()