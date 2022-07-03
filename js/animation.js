$( document ).ready(function() {

    $('a[href*="#"]').click(
        function(event) {
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
                location.hostname == this.hostname
            ) {
                var animatePoint = $(this.hash);
                animatePoint = animatePoint.length ? animatePoint : $('[name=' + this.hash.slice(1) + ']');

                if (animatePoint.length) {
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: animatePoint.offset().top
                    }, 800, function() {

                        var $target = $(animatePoint);
                        $target.focus();
                        if ($target.is(":focus")) {
                            return false;
                        }

                        $target.attr('tabindex', '-1');
                        $target.focus();
                    });
                }
            }
        }
    );
});