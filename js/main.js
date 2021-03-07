(function ($) {
    /*--document ready functions--*/
    jQuery(document).ready(function ($) {

        /*--window load functions--*/
        $(window).on('load', function () {
            var preLoder = $(".preloader");
            preLoder.fadeOut(1000);
        });


        //typed activate
        $('.header-inner h6').typed({
            strings: ["Designer", "UI/UX  Designer", "Designer"],
            loop: true,
            startDelay: 1000,
            backDelay: 1000,
            typeSpeed: 30,
            showCursor: true,
            cursorChar: '|',
            autoInsertCss: true
        });

        $('#home').click(function () {
            $('html,body').animate({
                scrollTop: $('#about').offset().top - 40
            }, 900);
        });

        $('a.page-scroll').click(function () {
            event.preventDefault();
            var anchor = $(this).attr('href');
            var length = $('#nav').hasClass('affix') ? 50 : 0;
            $('html, body').animate({
                scrollTop: $(anchor).offset().top + length
            }, 1000);
        });

        $('#nav').affix({
            offset: {
                top: $('header').height()
            }
        });


        // var $container = $('.portfolio-items');
        // $container.isotope({
        //     filter: '*',
        //     animationOptions: {
        //         duration: 750,
        //         easing: 'linear',
        //         queue: false
        //     }
        // });
        // $('.cat a').click(function () {
        //     $('.cat .active').removeClass('active');
        //     $(this).addClass('active');
        //     var selector = $(this).attr('data-filter');
        //     $container.isotope({
        //         filter: selector,
        //         animationOptions: {
        //             duration: 750,
        //             easing: 'linear',
        //             queue: false
        //         }
        //     });
        //     return false;
        // });

        /*bottom to top*/
        $(document).on('click', '.go-top', function () {
            $("html,body").animate({
                scrollTop: 0
            }, 1000);
        });

        $(window).on('scroll', function () {
            /*--show and hide scroll to top --*/
            var ScrollTop = $('.go-top');
            if ($(window).scrollTop() > 1000) {
                ScrollTop.show(1000);
            } else {
                ScrollTop.fadeOut(100);
            }


        });


        $('.year li span').click(function () {
            $('.year li span').removeClass('active');
            $(this).addClass('active');
            getPlist();
        })
        $('.type li span').click(function () {
            $('.type li span').removeClass('active');
            $(this).addClass('active');
            getPlist();
        })
        $('.p-page').on('click','a',function(){
            var pId = $(this).attr('href');
            if(pId){
                $('#pPage').val(pId);
                getPlist();
            }
            return false;
        })

        var getPlist = function () {
            var year = $('.year li span.active').attr('yearId');
            var type = $('.type li span.active').attr('typeId');
            var page = $('#pPage').val();
            $.post("portfolio/getPortfolioList", {'year':year,'type':type,'page':page}, function (data, status) {
                if (status == "success") {
                    var cont = '';
                    var info = data.list;
                    //data.list.forEach(item => {
                    for(var i=0;i<info.length;i++){
                        cont += '<div class="col-sm-6 col-md-3 col-lg-3 graphic">\
                                    <div class="portfolio-item">\
                                        <div class="hover-bg">\
											<a class="lightbox preview" pid="'+info[i].id+'">\
                                            <div class="hover-text">\
                                            </div>\
											</a>\
                                            <img src="'+info[i].img_url+'" class="img-responsive" alt="Project Title">\
                                        </div>\
                                    </div>\
                                </div>';
                    };
                    $('.portfolio-items').html(cont);
                    $('.p-page').html(data.pages);
                }
            }, "json");
        }

        $('.portfolio-items').on('click','.lightbox',function () {
            var pId = $(this).attr('pid');
            $.post("portfolio/getPortfolio", {'id':pId}, function (data, status) {
                if (status == "success") {
                    $('.p-box .p-date').html(data.addDate);
                    $('.p-box .p-title').html(data.title);
                    $('.p-box .p-cont').html(data.cont);
                    $('.p-box').modal('show');
                }
            }, "json");
        })
    });


}(jQuery));