console.log();
IONOS = typeof IONOS === 'undefined' ? {} : IONOS;
IONOS.plugin = typeof IONOS.plugin === 'undefined' ? {} : IONOS.plugin;

let init = function () {


    console.log('get url parameter');
    IONOS.plugin.journey.urlParam = IONOS.plugin.journey.core.helper.getUrlParam(window.location.href);

    console.log('add navigation');
    IONOS.plugin.journey.navigation = new IONOS.plugin.journey.core.navigation();
    IONOS.plugin.journey.navigation.add(document.body.querySelector('#wp-admin-bar-top-secondary'));
    IONOS.plugin.journey.navigation.key();
    IONOS.plugin.journey.navigation.click();

    console.log('add overlay');
    IONOS.plugin.journey.overlay = new IONOS.plugin.journey.core.elements.overlay();
    IONOS.plugin.journey.overlay.add(document.body);

    console.log('add focus');
    IONOS.plugin.journey.focus = new IONOS.plugin.journey.core.elements.focus();
    IONOS.plugin.journey.focus.add(document.documentElement, IONOS.plugin.journey.overlay.get());
    IONOS.plugin.journey.focus.click();

    console.log('add guide');
    IONOS.plugin.journey.guide = new IONOS.plugin.journey.core.elements.guide();
    IONOS.plugin.journey.guide.add(IONOS.plugin.journey.overlay.get());

    console.log('init bubble');
    IONOS.plugin.journey.bubble = new IONOS.plugin.journey.core.elements.bubble();

    console.log('init history');
    IONOS.plugin.journey.history = new IONOS.plugin.journey.core.history();
    IONOS.plugin.journey.history.init();

    console.log('start journey');
    IONOS.plugin.journey.movement = new IONOS.plugin.journey.core.movement();
    IONOS.plugin.journey.navigation.start();
};

IONOS.plugin.journey = {
    configCollection: JSON.parse('%s'),
    pageName: window.location.pathname.split("/").pop() || 'index.php',
    html: document.documentElement,
    htmlRect: document.documentElement.getBoundingClientRect(),
    body: document.body,
    bodyRect: document.body.getBoundingClientRect(),
};

IONOS.plugin.journey.core = {
    navigation: function () {
        this.add = function (position) {
            if (position instanceof HTMLElement) {
                let create_button = function (id, containerClass) {
                    let container = document.createElement('LI');
                    container.classList.add(containerClass);

                    let button = document.createElement('A');
                    button.id = id;
                    button.classList.add('ab-item');
                    button.href = '#';
                    position.appendChild(container);
                    container.appendChild(button);
                    button.appendChild(add_span('', 'ab-icon'));
                    button.appendChild(add_span('', 'ab-label'));
                }

                let add_span = function (name, className) {
                    let span = document.createElement('SPAN')
                    span.classList.add(className);
                    span.innerText = name;
                    return span;
                }
                create_button('journeyNext', 'ionos_journey_container');
                create_button('journeyStop', 'ionos_journey_container');
                create_button('journeyBack', 'ionos_journey_container');
            }
        };
        this.click = function () {
            document.body.querySelector('#journeyNext')
                .addEventListener('click', function (e) {
                    e.target.classList.add('wait');
                    if( IONOS.plugin.journey.focus instanceof Object
                        && IONOS.plugin.journey.configItem instanceof Object
                        && IONOS.plugin.journey.configItem['type'] == "guide"
                        && IONOS.plugin.journey.guide.guideIndex != (Object.keys(IONOS.plugin.journey.configItem['elements']).length - 1)
                    ) {
                        IONOS.plugin.journey.guide.next(IONOS.plugin.journey.configItem, IONOS.plugin.journey.focus.get());
                    } else {
                        IONOS.plugin.journey.navigation.forward();
                    }
                    setTimeout(function () {
                        e.target.classList.remove('wait');
                    }, 400);
                });

            document.body.querySelector('#journeyStop')
                .addEventListener('click', function () {
                    IONOS.plugin.journey.navigation.stop();
                });

            document.body.querySelector('#journeyBack')
                .addEventListener('click', function (e) {
                    e.target.classList.add('wait');
                    IONOS.plugin.journey.navigation.backwards();
                    setTimeout(function () {
                        e.target.classList.remove('wait');
                    }, 400);
                });
        };
        this.key = function() {
            window.onkeyup = function (event) {
                if (event.defaultPrevented) {
                    return; // Should do nothing if the default action has been cancelled
                }

                if (event.key == 'ArrowRight') {
                    event.preventDefault();
                    if(!document.body.querySelector('#journeyNext').classList.contains('wait')) {
                        document.body.querySelector('#journeyNext').click();
                    }
                } else if (event.key == 'ArrowLeft') {
                    event.preventDefault();
                    if(!document.body.querySelector('#journeyBack').classList.contains('wait')) {
                        document.body.querySelector('#journeyBack').click();
                    }
                } else if (event.key == 'Escape') {
                    event.preventDefault();
                    document.body.querySelector('#journeyStop').click();
                } else if (event.key == 'Enter') {
                    event.preventDefault();
                    IONOS.plugin.journey.navigation.enter();
                }
            };
        };
        this.start = function () {
            if( IONOS.plugin.journey.configCollection instanceof Object
                && IONOS.plugin.journey.urlParam instanceof Object
                && Object.keys(IONOS.plugin.journey.configCollection).length >= 1
            ) {
                IONOS.plugin.journey.index = (IONOS.plugin.journey.urlParam['wp_tour'] && IONOS.plugin.journey.configCollection[IONOS.plugin.journey.urlParam['wp_tour']])
                    ? IONOS.plugin.journey.urlParam['wp_tour']
                    : Object.keys(IONOS.plugin.journey.configCollection)[0];
                IONOS.plugin.journey.nextConfigItem = IONOS.plugin.journey.index ? IONOS.plugin.journey.configCollection[IONOS.plugin.journey.index] : undefined;
                IONOS.plugin.journey.target = IONOS.plugin.journey.nextConfigItem ? document.body.querySelector(IONOS.plugin.journey.nextConfigItem['selector']) : undefined;

                if( IONOS.plugin.journey.focus instanceof Object
                    && IONOS.plugin.journey.target instanceof HTMLElement
                    && IONOS.plugin.journey.nextConfigItem instanceof Object
                    && IONOS.plugin.journey.index
                ) {
                    let focus = IONOS.plugin.journey.focus.get();
                    IONOS.plugin.journey.movement.step(
                        focus,
                        IONOS.plugin.journey.target,
                        IONOS.plugin.journey.nextConfigItem,
                        IONOS.plugin.journey.index
                    );

                    IONOS.plugin.journey.configItem = IONOS.plugin.journey.configCollection[IONOS.plugin.journey.index];
                    IONOS.plugin.journey.nextConfigItem = IONOS.plugin.journey.configItem
                        ? IONOS.plugin.journey.configCollection[IONOS.plugin.journey.configItem['next']]
                        : undefined;
                    IONOS.plugin.journey.target = IONOS.plugin.journey.nextConfigItem
                        ? document.body.querySelector(IONOS.plugin.journey.nextConfigItem['selector'])
                        : undefined;

                    IONOS.plugin.journey.configItem['behavior'] == 'click' ?
                        focus.classList.add('clickable') :
                        focus.classList.remove('clickable');
                } else if( IONOS.plugin.journey.urlParam instanceof Object && IONOS.plugin.journey.urlParam['wp_tour_return_index'] !== undefined ) {
                    window.location.href = decodeURIComponent(IONOS.plugin.journey.urlParam['wp_tour_last_page']) +
                        '?wp_tour=' + IONOS.plugin.journey.urlParam['wp_tour_return_index'] +
                        '&wp_tour_last_page=' + IONOS.plugin.journey.pageName +
                        '&wp_tour_last_index=' + IONOS.plugin.journey.index +
                        '&wp_tour_return_index=' + IONOS.plugin.journey.configItem['next'] || 'none';
                } else {
                    console.log('finished');
                    document.body.querySelector('#journeyStop').click();
                }
            };
        };
        this.enter = function() {
            if( IONOS.plugin.journey.configItem instanceof Object
                && IONOS.plugin.journey.configItem instanceof Object
                && IONOS.plugin.journey.configItem['behavior'] == 'click'
            ) {
                let source = document.body.querySelector(IONOS.plugin.journey.configItem['selector']);
                if(source) {
                    let url = source.querySelector('a').href;
                    let char = '&';
                    if (url.search(/[?]/) == -1) {
                        char = '?';
                    }
                    IONOS.plugin.journey.history.set();
                    window.location.href = source.querySelector('a').href + char + 'wp_tour=0&wp_tour_last_page=' + IONOS.plugin.journey.pageName + '&wp_tour_last_index=' + IONOS.plugin.journey.index + '&wp_tour_return_index=' + IONOS.plugin.journey.configItem['next'] || 'none';
                }
            }
        };
        this.stop = function () {
            console.log('Navigation: stop');
            window.location = IONOS.plugin.journey.pageName;
        };
        this.forward = function () {
            console.log('Navigation: next');

            if( IONOS.plugin.journey.focus instanceof Object
                && IONOS.plugin.journey.target instanceof HTMLElement
                && IONOS.plugin.journey.nextConfigItem instanceof Object
                && IONOS.plugin.journey.index
            ) {
                IONOS.plugin.journey.history.set();
                let focus = IONOS.plugin.journey.focus.get();
                IONOS.plugin.journey.movement.step(
                    focus,
                    IONOS.plugin.journey.target,
                    IONOS.plugin.journey.nextConfigItem,
                    IONOS.plugin.journey.index
                );

                IONOS.plugin.journey.index = IONOS.plugin.journey.configItem['next'];
                IONOS.plugin.journey.configItem = IONOS.plugin.journey.configCollection[IONOS.plugin.journey.index];
                IONOS.plugin.journey.nextConfigItem = IONOS.plugin.journey.configItem
                    ? IONOS.plugin.journey.configCollection[IONOS.plugin.journey.configItem['next']]
                    : undefined;
                IONOS.plugin.journey.target = IONOS.plugin.journey.nextConfigItem
                    ? document.body.querySelector(IONOS.plugin.journey.nextConfigItem['selector'])
                    : undefined;

                IONOS.plugin.journey.configItem['behavior'] == 'click' ?
                    focus.classList.add('clickable') :
                    focus.classList.remove('clickable');
            } else if( IONOS.plugin.journey.urlParam instanceof Object
                && IONOS.plugin.journey.urlParam['wp_tour_return_index'] != "null"
                && IONOS.plugin.journey.urlParam['wp_tour_return_index'] != undefined
            ) {

                IONOS.plugin.journey.history.set();
                window.location.href = decodeURIComponent(IONOS.plugin.journey.urlParam['wp_tour_last_page']) +
                    '?wp_tour=' + IONOS.plugin.journey.urlParam['wp_tour_return_index'] +
                    '&wp_tour_last_page=' + IONOS.plugin.journey.pageName +
                    '&wp_tour_last_index=' + IONOS.plugin.journey.index +
                    '&wp_tour_return_index=' + IONOS.plugin.journey.configItem['next'] || 'none';
            } else {
                console.log('finished');
                document.body.querySelector('#journeyStop').click();
            }
        };
        this.backwards = function () {
            let story = IONOS.plugin.journey.history.get();
            if( IONOS.plugin.journey.guide.guideIndex > 0
                && IONOS.plugin.journey.configItem instanceof Object
                && IONOS.plugin.journey.configItem['type'] == 'guide'
                && IONOS.plugin.journey.focus instanceof Object
            ) {
                IONOS.plugin.journey.guide.back(IONOS.plugin.journey.configItem, IONOS.plugin.journey.focus.get());
            }
            else if (Array.isArray(story) && story.length > 0) {
                let last_config = story.pop();
                if (last_config['page'] == window.location.pathname.split("/").pop()) {


                    if( IONOS.plugin.journey.focus instanceof Object
                        && IONOS.plugin.journey.configCollection instanceof Object
                        && IONOS.plugin.journey.index
                    ) {
                        let focus = IONOS.plugin.journey.focus.get();
                        let next = IONOS.plugin.journey.configCollection[last_config['index']]

                        IONOS.plugin.journey.focus.removeChildren(focus);
                        IONOS.plugin.journey.movement.step(
                            focus,
                            document.body.querySelector(next['selector']),
                            next,
                            IONOS.plugin.journey.index
                        );

                        IONOS.plugin.journey.index = last_config['index'];
                        IONOS.plugin.journey.configItem = IONOS.plugin.journey.configCollection[last_config['index']];
                        IONOS.plugin.journey.nextConfigItem = IONOS.plugin.journey.configItem
                            ? IONOS.plugin.journey.configCollection[IONOS.plugin.journey.configItem['next']]
                            : undefined;
                        IONOS.plugin.journey.target = IONOS.plugin.journey.nextConfigItem
                            ? document.body.querySelector(IONOS.plugin.journey.nextConfigItem['selector'])
                            : undefined;


                        IONOS.plugin.journey.configItem['behavior'] == 'click' ?
                            focus.classList.add('clickable') :
                            focus.classList.remove('clickable');

                        window.sessionStorage.setItem('ionos_journey_history', JSON.stringify(story));
                    }
                } else {
                    window.sessionStorage.setItem('ionos_journey_history',JSON.stringify(story));
                    window.location.href = last_config['page'] + '?' +
                        IONOS.plugin.journey.core.helper.changeQueryParameter(
                            '?wp_tour=0&wp_tour_last_page=index.php&wp_tour_last_index=3rd&wp_tour_return_index=4th',
                            'wp_tour',
                            last_config['index']
                        );

                }
            }
        };
    },
    elements: {
        overlay: function () {
            this.get = function () {
                return document.body.querySelector('#ionos-journey-overlay');
            };
            this.add = function (position) {
                if (position instanceof HTMLElement) {
                    let elem = document.createElement('DIV');
                    elem.id = 'ionos-journey-overlay';
                    position.prepend(elem);
                }
            };
        },
        focus: function () {
            this.get = function () {
                return document.body.querySelector('#ionos-journey-focus');
            };
            this.add = function (target, position) {
                if (target instanceof HTMLElement && position instanceof HTMLElement) {
                    let targetRect = target.getBoundingClientRect();
                    let elem = document.createElement('DIV');
                    elem.id = 'ionos-journey-focus';
                    elem.style.top = targetRect.top + 'px';
                    elem.style.left = targetRect.left + 'px';
                    elem.style.width = targetRect.width - 8 + 'px';
                    elem.style.height = targetRect.height - 8 + 'px';
                    elem.style.borderColor = 'transparent';
                    position.prepend(elem);
                }
            };
            this.click = function () {
                let focus = IONOS.plugin.journey.focus.get();
                focus.addEventListener('click', function (e) {
                    if( IONOS.plugin.journey.focus instanceof Object
                        && IONOS.plugin.journey.configItem instanceof Object
                        && IONOS.plugin.journey.configItem['behavior'] == 'click'
                        && e.target == focus
                    ) {
                        IONOS.plugin.journey.navigation.enter();
                    }
                });
            };
            this.removeChildren = function (focus) {
                if (focus instanceof HTMLElement && focus.childNodes) {
                    while (focus.childNodes[0]) {
                        focus.childNodes[0].remove();
                    }
                }
            }
        },
        bubble: function () {
            this.add = function(configItem, focus) {
                if (configItem instanceof Object && focus instanceof HTMLElement) {
                    let sourceRect = focus.getBoundingClientRect();
                    let stop = document.createElement('a');
                    stop.id = 'ionos-journey-bubble-stop';

                    let element = document.createElement('DIV');
                    element.id = 'ionos-journey-bubble';
                    element.innerHTML = configItem['text'];
                    element.style.opacity = 0;

                    if ((IONOS.plugin.journey.bodyRect.width - sourceRect.right) > 350) {
                        element.classList.add('bubble-left');
                        element.style.left = (sourceRect.width + 30) + 'px';
                        element.style.top = (-60 + sourceRect.height / 2) + 'px'
                    } else if (sourceRect.left > 350) {
                        element.classList.add('bubble-right');
                        element.style.left = (0 - sourceRect.width - 60 ) + 'px';
                        element.style.top = (-60 + sourceRect.height / 2) + 'px'
                    } else if (sourceRect.top > 350) {
                        element.classList.add('bubble-bot');
                        element.style.left = (IONOS.plugin.journey.bodyRect.width / 2 - 125) + 'px';
                        element.style.bottom = (IONOS.plugin.journey.bodyRect.height + IONOS.plugin.journey.bodyRect.top - sourceRect.top + 30) + 'px'
                        element.style.position = 'fixed';
                    } else if ((IONOS.plugin.journey.bodyRect.height - sourceRect.bottom) > 350) {
                        element.classList.add('bubble-top');
                        element.style.left = (sourceRect.width / 2 - 125) + 'px';
                        element.style.top = (sourceRect.height + 30 ) + 'px'
                    } else {
                        element.style.margin = 'auto';
                        element.style.left = (IONOS.plugin.journey.bodyRect.width / 2 - 125) + 'px';
                        element.style.top = ((IONOS.plugin.journey.bodyRect.height / 2) - 125) + 'px'
                        element.style.position = 'fixed'
                    }

                    setTimeout(function() {
                        let fadeIn = setInterval(function() {
                            if (element.style.opacity >= 1) {
                                clearTimeout(fadeIn);
                            }
                            element.style.opacity = parseFloat(element.style.opacity) + 0.1;
                        }, 20);
                    }, 50)

                    if(configItem['navigation'] == "true") {
                        let navigation = document.createElement('DIV');
                        navigation.id = 'ionos-journey-bubble-navigation';
                        let next = document.createElement('a');
                        next.id = 'ionos-journey-bubble-next';
                        let back = document.createElement('a');
                        back.id = 'ionos-journey-bubble-back';

                        navigation.prepend(next);
                        navigation.prepend(back);
                        element.append(navigation);

                        back.addEventListener('click', function (e) {
                            if(e.target === back) {
                                IONOS.plugin.journey.navigation.backwards();
                            }
                        });
                        next.addEventListener('click', function (e) {
                            if(e.target === next) {
                                IONOS.plugin.journey.navigation.forward();
                            }
                        });
                    }

                    stop.addEventListener('click', function (e) {
                        if(e.target === stop) {
                            IONOS.plugin.journey.navigation.stop();
                        }
                    });

                    element.append(stop)
                    focus.prepend(element);

                }
            };
            this.get = function () {
                return document.body.querySelector('#ionos-journey-bubble');
            };
            this.remove = function() {
                while (document.body.querySelectorAll('#ionos-journey-overlay #ionos-journey-bubble')[0]) {
                    document.body.querySelectorAll('#ionos-journey-overlay #ionos-journey-bubble')[0].remove();
                }
            }
        },
        guide: function () {
            this.guideFadeCount = 0;
            this.guideIndex = 0;
            this.add = function (position) {
                if (position instanceof HTMLElement) {
                    let elem = document.createElement('DIV');
                    elem.id = 'ionos-journey-guide';
                    position.prepend(elem);
                }
            };
            this.update = function (configItem, focus, hideFirst) {
                console.log('pups');
                console.log(focus);
                if(configItem['type'] == 'guide' && focus instanceof HTMLElement) {
                    let guide = {}
                    focus.innerHTML =
                        '<img class="ionos-journey-guide-image" />' +
                        '<ul class="ionos-journey-guide-progress"></ul>' +
                        '<h1 class="ionos-journey-guide-headline"></h1>' +
                        '<p class="ionos-journey-guide-text"></p>' +
                        '<div class="ionos-journey-guide-footer"></div>';

                    guide.image = focus.querySelector('.ionos-journey-guide-image');
                    guide.image.src = configItem['elements'][IONOS.plugin.journey.guide.guideIndex]["image-url"];
                    guide.image.style.backgroundColor = configItem['elements'][IONOS.plugin.journey.guide.guideIndex]["image-background"];

                    guide.headline = focus.querySelector('.ionos-journey-guide-headline');
                    guide.headline.innerText = configItem['elements'][IONOS.plugin.journey.guide.guideIndex]["headline"];

                    if ( Object.keys(configItem['elements']).length > 1) {
                        guide.position = focus.querySelector('.ionos-journey-guide-progress');
                        let length = Object.keys(configItem['elements']).length;
                        let li = '';
                        configItem['elements'].forEach(function (item, key) {
                            li += '<li><button type="button" index = ' + key + ' aria-label="Seite ' + (parseInt(key) + 1) + ' von ' + length + '" class="ionos-journey-guide-targeted components-button has-icon">' +
                                '<svg width="8" height="8" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" focusable="false">' +
                                '<circle cx="4" cy="4" r="4" fill=' + (key == IONOS.plugin.journey.guide.guideIndex ? '#003d8f' : 'lightgray') + '></circle>' +
                                '</svg>' +
                                '</button></li>';
                        });
                        guide.position.innerHTML = "<ul>" + li + "</ul>";
                    }

                    guide.text = focus.querySelector('.ionos-journey-guide-text');
                    guide.text.innerHTML = configItem['elements'][IONOS.plugin.journey.guide.guideIndex]["text"];

                    guide.footer = focus.querySelector('.ionos-journey-guide-footer');


                    guide.stop = document.createElement('a');
                    guide.stop.id = 'ionos-journey-bubble-stop';
                    focus.prepend(guide.stop);

                    if(configItem['navigation'] == "true") {
                        let navigation = document.createElement('DIV');
                        navigation.id = 'ionos-journey-bubble-navigation';
                        let next = document.createElement('a');
                        next.id = 'ionos-journey-bubble-next';
                        let back = document.createElement('a');
                        back.id = 'ionos-journey-bubble-back';

                        navigation.prepend(next);
                        navigation.prepend(back);
                        guide.footer.prepend(navigation);

                        focus.append(guide.footer);

                        back.addEventListener('click', function (e) {
                            if(e.target === back) {
                                if(!document.body.querySelector('#journeyBack').classList.contains('wait')) {
                                    document.body.querySelector('#journeyBack').click();
                                }
                            }
                        });
                        next.addEventListener('click', function (e) {
                            if(e.target === next) {
                                if(!document.body.querySelector('#journeyNext').classList.contains('wait')) {
                                    document.body.querySelector('#journeyNext').click();
                                }
                            }
                        });
                    }


                    guide.stop.addEventListener('click', function (e) {
                        if(e.target === guide.stop) {
                            if(!document.body.querySelector('#journeyStop').classList.contains('wait')) {
                                document.body.querySelector('#journeyStop').click();
                            }
                        }
                    });

                    focus.querySelectorAll('.ionos-journey-guide-targeted').forEach(function (item, index) {
                        item.addEventListener('click', function () {
                            IONOS.plugin.journey.guide.targeted(configItem, focus, item.getAttribute('index'));
                        });
                    });



                    if(IONOS.plugin.journey.guide.guideIndex == 0 && hideFirst !== false) {
                        guide.image.style.opacity = 0;
                        guide.position.style.opacity = 0;
                        guide.headline.style.opacity = 0;
                        guide.text.style.opacity = 0;
                        guide.footer.style.opacity = 0;
                        guide.stop.style.opacity = 0;
                    };


                }
            };
            this.next = function (configItem, focus) {
                if(configItem['type'] == 'guide' && configItem['elements'][IONOS.plugin.journey.guide.guideIndex + 1]) {
                    IONOS.plugin.journey.guide.guideIndex += 1;
                    IONOS.plugin.journey.guide.update(configItem, focus, false);
                }
            };
            this.back = function (configItem, focus) {
                if(configItem['type'] == 'guide' && configItem['elements'][IONOS.plugin.journey.guide.guideIndex - 1]) {
                    IONOS.plugin.journey.guide.guideIndex -= 1;
                    IONOS.plugin.journey.guide.update(configItem, focus, false);
                }
            };
            this.targeted = function (configItem, focus, index) {
                if(configItem['type'] == 'guide' && configItem['elements'][index]) {
                    IONOS.plugin.journey.guide.guideIndex = parseInt(index);
                    IONOS.plugin.journey.guide.update(configItem, focus, false);
                }

            };
            this.fadeIn = function (configItem, focus) {
                if(configItem['type'] == 'guide') {
                    let fadeIn = setInterval(function () {
                        if (focus.childNodes && focus.childNodes[0] && focus.childNodes[0].style.opacity >= 1) {
                            focus.childNodes.forEach(function (item, key) {
                                item.style.opacity = 1;
                            });
                            clearTimeout(fadeIn);
                        } else {
                            focus.childNodes.forEach(function (item, key) {
                                item.style.opacity = parseFloat(item.style.opacity) + 0.1;
                            });
                        }
                    }, 40);
                }
            };
            this.remove = function(focus) {
                if (focus instanceof HTMLElement && focus.childNodes) {
                    while (focus.childNodes[0]) {
                        focus.childNodes[0].remove();
                    }
                }
            };
        }

    },
    movement: function () {
        this.jumpCount = 40;
        this.arrived = false;
        this.step = function (focus, target, nextConfigItem, index) {
            if( focus instanceof HTMLElement
                && target instanceof HTMLElement
                && nextConfigItem instanceof Object
                && index) {
                IONOS.plugin.journey.focus.removeChildren(focus);
                focus.style.background = 'transparent';

                this.move(
                    nextConfigItem,
                    target,
                    focus,
                    this.jumpCount
                );

                if (nextConfigItem['type'] == 'guide') {
                    IONOS.plugin.journey.guide.guideIndex = 0;
                    IONOS.plugin.journey.guide.update( nextConfigItem, focus );
                    focus.style.borderColor = 'transparent';
                    let fading = setInterval( function () {
                        if(IONOS.plugin.journey.movement.arrived === true) {
                            focus.style.background = 'white';
                            IONOS.plugin.journey.guide.fadeIn(nextConfigItem, focus);
                            clearTimeout(fading);
                        }
                    }, 100);
                } else {
                    focus.style.backgroundColor = 'unset';
                    focus.style.background = 'transparent';
                    focus.style.borderColor = nextConfigItem['border-color'];
                    let fading = setInterval( function () {
                        if(IONOS.plugin.journey.movement.arrived === true) {
                            IONOS.plugin.journey.bubble.add(nextConfigItem, focus);
                            clearTimeout(fading);
                        }
                    }, 100);

                }
            }
        };
        this.move = function (configItem, target, focus, jumps) {
            if (target instanceof HTMLElement && focus instanceof Object) {
                let focusRect = focus.getBoundingClientRect();
                let targetRect = target.getBoundingClientRect();
                IONOS.plugin.journey.movement.arrived = false;

                let x = { route: targetRect.x - focusRect.x, spacing: (targetRect.x - focusRect.x) / jumps },
                    y = { route: targetRect.y - focusRect.y, spacing: (targetRect.y - focusRect.y) / jumps },
                    height = { route: targetRect.height - focusRect.height, spacing: (targetRect.height - focusRect.height) / jumps },
                    width = { route: targetRect.width - focusRect.width, spacing: (targetRect.width - focusRect.width) / jumps };

                let move = setInterval(function () {
                    if (jumps == 0) {
                        focus.style.left = targetRect.left + 'px';
                        focus.style.top = targetRect.top + 'px'
                        focus.style.height = (targetRect.height - 8) + 'px';
                        focus.style.width = (targetRect.width - 8) + 'px'
                        IONOS.plugin.journey.movement.arrived = true;
                        clearTimeout(move);
                    } else {
                        //Positioning
                        focus.style.left = (focusRect.left + x.spacing) + 'px';
                        focus.style.top = (focusRect.top + y.spacing) + 'px';
                        focus.style.height = (focusRect.height - 8 + height.spacing) + 'px';
                        focus.style.width = (focusRect.width - 8 + width.spacing) + 'px';

                        //cache new element parameters
                        focusRect = focus.getBoundingClientRect();
                    }
                    jumps--;
                }, 5);

            }
        };
    },
    history: function() {
        this.init = function () {
            if( IONOS.plugin.journey.urlParam instanceof Object
                && IONOS.plugin.journey.urlParam['wp_tour'] == 'started'
            ) {
                IONOS.plugin.journey.history.remove();
            };
        };
        this.get = function () {
            let value = JSON.parse(window.sessionStorage.getItem('ionos_journey_history'));
            if (value) {
                return value;
            } else {
                return [];
            }
        };
        this.set = function (object) {
            object = object ? object : {
                type: "ionos_journey",
                identifier: Math.random(),
                index: IONOS.plugin.journey.index,
                first: "false",
                latest: "false",
                page: IONOS.plugin.journey.pageName,
                parameter: window.location.search
            }
            let story = JSON.parse(sessionStorage.getItem('ionos_journey_history')) || [];
            story.push(object);
            window.sessionStorage.setItem('ionos_journey_history', JSON.stringify(story));
        };
        this.remove = function () {
            sessionStorage.removeItem('ionos_journey_history');
            console.log('history removed');
        };
        this.length = function () {
            let length = 0;
            if (JSON.parse(window.sessionStorage.getItem('ionos_journey_history')) instanceof Array) {
                length = JSON.parse(window.sessionStorage.getItem('ionos_journey_history')).length
            }
            return length;
        };
    },
    helper: {
        getUrlParam: function (url) {
            var vars = {};
            url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                vars[key] = value;
            });
            return vars;
        },
        changeQueryParameter: function (query, index, param) {
            let queryParams = new URLSearchParams(query);
            queryParams.delete(index);
            queryParams.set(index, param);
            return queryParams.toString();
        }
    }

};


init();


