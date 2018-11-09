$(document).ready(function () {

    $(document.body).on('click', '.pay-tax', function () {
        api.distributeCredits();
    });

    $(document.body).on('click', '.donate-sc', function (e) {
        e.stopImmediatePropagation();
        api.donateSocialCredits(this);
    });

    $(document.body).on('click', '.buy-ticket', function (e) {
        e.stopImmediatePropagation();
        api.buyLotteryTicket(this)
    });

    $('.status-checkbox').click(function () {
        $(this).html('&#10004;');
    });

    $('.connect, .disconnect').click(function () {
        if ($(this).hasClass("disconnect")) {
            $(this).text("CONNECT");
            $(this).removeClass('disconnect');
        } else {
            $(this).text("DISCONNECT");
            $(this).addClass('disconnect');
        }
    });

    $('.sidebar ul li.treeview a').click(function (e) {
        /* there seems to be a small bug in this. Sometimes, when i click on an anchor, it doesn't open. However, it rarely occurrs??? */
        e.stopImmediatePropagation();
        var thisUL = $(this).next();
        var i = $(this).parent().find('i');

        if (thisUL.hasClass('open')) {
            thisUL.slideUp('fast');
            i.removeClass('rotate-angle');
            $('.sidebar').animate({
                'top': '0'
            }, 500);
            thisUL.removeClass('open');
        } else {
            $('.sidebar').find('i').removeClass('rotate-angle');
            $('ul.treeview-menu').not(thisUL).slideUp('fast');
            thisUL.slideDown('fast');
            var ulHeight = $(this).next()[0].scrollHeight;
            i.addClass('rotate-angle');
            $('.sidebar').animate({
                'top': '-' + ulHeight
            }, 500);
            thisUL.addClass('open');
        }
    });

    $('.top-nav ul li.has-dropdown a').click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $('.dropdown-content').fadeToggle('fast');
        close_dropdown(true);
    });

    function close_dropdown(is_dropdown_open) {
        $('body').click(function (e) {
            e.stopImmediatePropagation();
            if (is_dropdown_open) {
                $('.dropdown-content').fadeOut('slow');
            }
        });
    }

    $('a.toggle-menu').click(function (e) {
        $('.sidebar ul:first-child').slideToggle('fast');
        e.stopImmediatePropagation();
    });

    $('.post-update button').click(function () {
        api.updateStatus();
    });

    $('.flag').click(function () {
        if ($(this).hasClass("blurred")) {
            $(this).parent().parent().find('.post-desc').css("filter", "blur(0px)");
            $(this).removeClass('blurred');
            $(this).find('span').text('Flag'); //need to update this
        } else {
            $(this).parent().parent().find('.post-desc').css("filter", "blur(4px)");
            $(this).addClass('blurred');
            $(this).find('span').text('Show'); //need to update this
        }
    });
});
