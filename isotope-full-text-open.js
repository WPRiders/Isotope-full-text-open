jQuery(document).ready(function ($) {
    var $container = $('#wpr-display-articles');
    $container.imagesLoaded(function () {
        $container.isotope({
            getSortData: {
                sorting: function (elem) {
                    var sortnum = $(elem).find('.wpr-sorting').text();
                    var parse = parseInt(sortnum, 10);
                    return parse;
                }
            },
            transitionDuration: '0.4s',
            sortBy: 'sorting',
            transformsEnabled: false,
            animationEngine: 'best-available',
            itemPositionDataEnabled: true,
            layoutMode: 'fitRows',
            itemSelector: '.wpr-post-article',
            percentPosition: true
        });
    });

    var $optionSets = $('#filters'), $optionLinks = $optionSets.find('a');

    $optionLinks.click(function () {
        var $this = $(this);
        // don't proceed if already selected
        if ($this.hasClass('selected')) {
            return false;
        }
        $optionSets.find('.selected').removeClass('selected');
        $this.addClass('selected');

        wpr_remove_modal(false);

        if ($('#wpr-toggle').length && $('#wpr-toggle').hasClass('on')) {
            $('#wpr-toggle').removeClass('on');
        }

        var selector = $(this).attr('data-filter');
        $container.isotope({
            filter: selector
        });
        return false;
    });

    $container.on('touch click', '.show-full', function () {
        open_modal($(this).attr('id'));
    });

    $('body').on('touch click', '.wpr-close-modal', function () {
        wpr_remove_modal(false);
        return false;
    });

    function open_modal(id) {
        var elem_bollino = $('#wpr-baloon');
        var isOpen = false;

        if (elem_bollino.length) {
            isOpen = true;
            var activeItem = elem_bollino.data('item-id');
            wpr_remove_modal(isOpen);

            if (activeItem == id) {
                return;
            }
        }

        var elem = $('#' + id);

        var main_width = $('#wpr-display-articles').width();
        var num = (main_width < 641) ? 2 : 7;
        var item_width = Math.floor(main_width / num);

        calculate_dimensions(item_width, num);

        var htmlcontents = elem.find('.wpr-full-content').html();
        var modalHtml = '<div class="wpr-modal-content">' + htmlcontents + '</div>';
        modalHtml += '<div class="clearfix"></div> <a href class="wpr-close-modal"></a>';

        if (htmlcontents != '') {
            var sorting = 9999;
            var isoElems = $container.isotope('getItemElements');

            var hunt = false;
            for (var i = 0; i < isoElems.length; i++) {
                if (id == isoElems[i].id) {
                    hunt = true;
                    continue;
                }

                if (hunt == true && isoElems[i].offsetLeft <= 15) {
                    sorting = $('#' + isoElems[i].id).find('.wpr-sorting').text() - 0.5;
                    break;
                }
            }

            var elementCSS = elem.attr('class');
            elementCSS = elementCSS.replace("show-full", "");
            elementCSS = elementCSS.replace("format", "");
            var newItem = $('<div id="wpr-baloon" data-item-id="' + id + '" class="' + elementCSS + ' ballon">' + modalHtml + '<p class="wpr-sorting">' + sorting + '</p></div>');

            $container.imagesLoaded(function () {
                $container.append(newItem).isotope('appended', newItem);
                $container.isotope({sortBy: 'sorting'});

                if ($('#wpr-baloon').length) {
                    if (isOpen == true) {
                        setTimeout(function () {
                            var childof = $('#wpr-baloon').attr('data-item-id');
                            var destination = $('#' + childof).offset().top + $('#' + childof).outerHeight() - 50;
                            $('body,html').scrollTo(destination, 400);
                        }, 500);
                    } else {
                        var childof = $('#wpr-baloon').attr('data-item-id');
                        var destination = $('#' + childof).offset().top + $('#' + childof).outerHeight() - 50;
                        $('body,html').scrollTo(destination, 400);
                    }
                }

                $("#wpr-baloon .boxscroll-active").niceScroll({
                    cursorcolor: "#000000",
                    cursoropacitymin: 1,
                    cursoropacitymax: 1,
                    cursorwidth: 8,
                    cursorborder: '0'
                });
                $("#wpr-baloon .boxscroll-active").getNiceScroll().resize();
            });
        }
    }

    function wpr_remove_modal(isOpen) {
        var elem_bollino = $('#wpr-baloon');
        if (elem_bollino.length) {
            if (isOpen == true) {
                $('#wpr-display-articles').isotope('remove', elem_bollino).isotope();
            } else {
                $('#wpr-display-articles').isotope('remove', elem_bollino).isotope();
                var scrollto = $('#wpr-baloon').attr('data-item-id');
                var dest = $('#' + scrollto).offset().top - 50;
                $('body,html').scrollTo(dest, 400);
            }
        }
    }

    function calculate_dimensions(item_width, num) {
        var item_height = (item_width);
        setTimeout(function () {
            $('.ballon').width(num * item_width);
            $('.ballon').css('min-height', 2 * item_height);
            $('.ballon').css('height', 'auto');
        }, 100);

    }

    $('.wpr-display-articles-filter').on('click', '#wpr-toggle', function (e) {
        e.preventDefault();
        $(this).toggleClass('on');
    });
});