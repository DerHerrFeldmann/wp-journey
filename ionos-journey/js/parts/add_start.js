
let toolbar = document.body.querySelector('#wp-admin-bar-top-secondary')

let create_button = function (id, name, containerClass) {
    let container = document.createElement('LI');
    container.classList.add(containerClass);
    let button = document.createElement('A');
    button.id = id;
    button.classList.add('ab-item');
    button.href = '#';
    toolbar.appendChild(container);
    container.appendChild(button);
    button.appendChild(add_span('', 'ab-icon'));
    button.appendChild(add_span(name, 'ab-label'));
}

let add_span = function (name, className) {
    let span = document.createElement('SPAN')
    span.classList.add(className);
    span.innerText = name;
    return span;
}


create_button('journeyStart', 'IONOS Journey', 'ionos_journey_container');

let start = document.body.querySelector('#wp-admin-bar-top-secondary #journeyStart')
.addEventListener('click', function () {
    document.location.href = document.location.href + '?wp_tour=started';
});