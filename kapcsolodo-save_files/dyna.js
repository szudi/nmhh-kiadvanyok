//Focustrap
var focusTrap = function(elem) {

    var tabbable = elem.find('select, input, textarea, button, a').filter(':visible');

    var firstTabbable = tabbable.first();
    var lastTabbable = tabbable.last();
    /*set focus on first input*/
    firstTabbable.focus();

    /*redirect last tab to first input*/
    lastTabbable.on('keydown', function (e) {
       if ((e.which === 9 && !e.shiftKey)) {
           e.preventDefault();
           firstTabbable.focus();
       }
    });

    /*redirect first shift+tab to last input*/
    firstTabbable.on('keydown', function (e) {
        if ((e.which === 9 && e.shiftKey)) {
            e.preventDefault();
            lastTabbable.focus();
        }
    });

    /* allow escape key to close insiders div */
    elem.on('keyup', function(e){
      if (e.keyCode === 27 ) {
		  $('body').removeClass('popped');
        elem.hide();
		$('.return-focus').focus().removeClass('return-focus');
      };
    });
};

function AddHideClass(strBoxId, intCountInTabletView, intCountInMobileView ) {
	if ( $('#'+strBoxId).length ) {
		intCountInTabletView--;
		intCountInMobileView--;

		$('#'+strBoxId+' .box-content>div.card:gt('+intCountInTabletView+')').addClass('hide-in-tablet-view');
		$('#'+strBoxId+' .box-content>div.card:gt('+intCountInMobileView+'):lt('+intCountInTabletView+')').addClass('hide-in-mobile-view');
	}
}

function resizeColDivs() {
	// minden doboznál szedjük le a magasság értéket, ha állítottunk rajta
	$('.cols:not(.exculde-adjust-size) > .box').height('auto');
	// összes cols-on végigmegyünk
	$('.cols:not(.exculde-adjust-size)').each(function() {

		var arrDivs = [];
		var intCurTop = -1;
		// adott cols összes box-án
		$('> .box',this).each(function() {
			//alert($(this).height());
			if ( $(this).position().top != intCurTop && arrDivs.length > 0) {
				var intMaxHeight = -1;
				if ( arrDivs.length > 1 ) {
					$.each(arrDivs, function(index, value) {
						 intMaxHeight = intMaxHeight > value.height() ? intMaxHeight : value.height();
					});
					$.each(arrDivs, function(index, value) {
						 value.height(intMaxHeight);
					});
				}
				arrDivs = [];
				//alert(intMaxHeight);
			}
			intCurTop = $(this).position().top;
			arrDivs[arrDivs.length] = $(this);
		});
		var intMaxHeight = -1;
		if ( arrDivs.length > 1 ) {
			$.each(arrDivs, function(index, value) {
				 intMaxHeight = intMaxHeight > value.height() ? intMaxHeight : value.height();
			});
			$.each(arrDivs, function(index, value) {
				 value.height(intMaxHeight);
			});
		}
	});
}

function resizeBoxDivs() {
	// minden cardnál szedjük le a magasság értéket, ha állítottunk rajta
	$('.cols.card2 .box .card a, .cols.card3 .box .card a').height('auto');
	// összes cols-on végigmegyünk
	$('.cols.card2 .box, .cols.card3 .box ').each(function() {

		var arrDivs = [];
		var intCurTop = -1;
		// adott cols összes box-án
		$('.card:visible a',this).each(function() {
			//alert($(this).height());
			//console.log($(this).position().top);
			if ( $(this).position().top != intCurTop && arrDivs.length > 0) {
				var intMaxHeight = -1;
				if ( arrDivs.length > 1 ) {
					$.each(arrDivs, function(index, value) {
						 intMaxHeight = intMaxHeight > value.height() ? intMaxHeight : value.height();
					});
					$.each(arrDivs, function(index, value) {
						 value.height(intMaxHeight);
					});
				}
				arrDivs = [];
				//alert(intMaxHeight);
			}
			intCurTop = $(this).position().top;
			arrDivs[arrDivs.length] = $(this);
		});
		var intMaxHeight = -1;
		if ( arrDivs.length > 1 ) {
			$.each(arrDivs, function(index, value) {
				 intMaxHeight = intMaxHeight > value.height() ? intMaxHeight : value.height();
			});
			$.each(arrDivs, function(index, value) {
				 value.height(intMaxHeight);
			});
		}
	});
}

$( window ).load(function() {
	resizeColDivs();
	resizeBoxDivs();
});


$(document).ready(function() {
	resizeColDivs();
	resizeBoxDivs();

	//role=button
	$("a").filter('[role="button"]').on('keydown', function(e) {
			 if (e.which === 32) {
				   e.preventDefault();
					 window.location = e.target.href;
			 }
	 });

//calendar box
$('.calendar td:has(li)').addClass('event');
$('.calendar ul:not(:has(li))').remove();
$('.calendar td:empty').append('&nbsp;');

//Felső keresés zoom focus
//mobilmenüre is ráteszi/leveszi 
$('#quick_search input.search_text').on( "focus", function(){
    $('#quick_search').addClass('focused');
    $('#mobil-menu').addClass('focused');
}).on( "blur", function(){
    $('#quick_search').removeClass('focused');
    $('#mobil-menu').removeClass('focused');
});

$('body.tudastar #sidebar .box-content ul li a, body.allashirdetes #sidebar .box-content ul li a').each(function() {
	if ( $(this).attr('href') == window.location.pathname ) {
		$(this).addClass('active');
	}
});

$('#sidebar nav a.active, #page_header nav.menu a.active, #submenu nav.menu a.active, #l_menu a.active').each(function() {
	if ( $(this).attr('href') == window.location.pathname ) {
		$(this).attr('aria-current','page');
	} else {
		$(this).attr('aria-current','true');
	}
});


//kezdő bannerdoboz message box középre, #bannerhome 550px magas, almenü 80px magas

bannerheight = $('#banner_home').height();
menuheight = $('#submenu').height();
$('#banner_home .cols').css('top', ( (bannerheight-menuheight) - $('#banner_home .cols').height()) / 2 + menuheight + 'px' );

//Zoomable,gallery és picsub

$(function(){
    $('img.zoomable').each(function() {
        if( !$(this).attr('title') ) {$(this).attr('title','');}
        $(this).wrap("<a class='zoomable_container' href='"+$(this).attr('src')+"'></a>").after('<p class="picsub">'+ $(this).attr('title') +'</p>');
    });
    $("a.zoomable_container").nivoLightbox({
    });
});

$(function(){
    if ($('#gallery').length) {
        $('#gallery a').each(function() {
            $(this).attr('title',$(this).children('sub').html());
        });
        $('#gallery a').nivoLightbox();

        $('img.gallerytrigger').each(function(){
			//alert($('#gallery li').length)
            if( !$(this).attr('title') ) {$(this).attr('title','');}
            $(this).wrap("<a class='gallerytrigger_container' href='javascript:;'></a>").after('<p class="picnum">' + $('#gallery li').length +'</p>');
			//$(this).wrap("<a class='gallerytrigger_container' href='javascript:;'></a>").after('<p class="picsub">'+ $(this).attr('title') +'</p>');
        });

    }

    $('a.gallerytrigger_container').click(function(){
        link = $(this).children('img').attr('src');

        if ($('#gallery a[href="'+link+'"]').length) {
            $('#gallery a[href="'+link+'"]').trigger('click');
        } else {
            $('#gallery a').eq(0).trigger('click');
        }

        return false;
    });

});

//picsub
$(function(){
    $('article img[title]:not(.zoomable,.gallerytrigger)').each(function(){
        $(this).wrap('<div class="imagewrapper ' + $(this).css('float') + '"></div>').after('<p class="picsub">' + $(this).attr('title') + '</p>');
    });
});

//


if ( $('#filter').length ) {

        kijelzo_szeles = $('#where_f').width()+68;

        filter_szeles = $('#filter').width();
        input_szeles = filter_szeles - kijelzo_szeles;
        $('#filter .filter_text').width(input_szeles);
}


//keresés lenyitó

$('#where a.opener').click(function(){
	$('#where ul.menu').toggle();

	if ($('#where ul.menu').is(":visible")) {
		$('#where a.opener').addClass('opened');
	} else {
		$('#where a.opener').removeClass('opened');
	}

	return false;
});

$('#where ul.menu a').click(function(){
	$('#search_where').val( $(this).attr('data-xclass') );
	$('#where .info b').text( $(this).text() );
	$('#where ul.menu').hide();
	$('#where a.opener').removeClass('opened');
	return false;
});

//keresés lenyitó filter + 1 apró szépségtapasz

$('#main').has('#filter').css('top','-.545455rem');

$('#where_f a.opener').click(function(){
    $('#where_f ul.menu').toggle();

    if ($('#where_f ul.menu').is(":visible")) {
        $('#where_f a.opener').addClass('opened');
    } else {
        $('#where_f a.opener').removeClass('opened');
    }

    return false;
});

$('#where_f ul.menu a').click(function(){
    $('#filter_where').val( $(this).attr('data-xclass') );
    $('#where_f .info b').text( $(this).text() );

    kijelzo_szeles = $('#where_f').width()+68;

    filter_szeles = $('#filter').width();
    input_szeles = filter_szeles - kijelzo_szeles;

    $('#filter .filter_text').width(input_szeles);

    $('#where_f ul.menu').hide();
    $('#where_f a.opener').removeClass('opened');
    return false;
});

//szűrőfeltételek eltüntetése

/*
$('#facet_list a.off').click(function(){
    $(this).parent().remove();

    //stb...//

    return false;
});
*/
//facetinputok kinyitogatása, ha már aktív, akkor kinyitjuk

$('#facet legend button.opened').parents('fieldset').children().show();


//facetinputok kinyitogatása

$('#facet legend button').click(function(){

	$(this).attr('aria-expanded', function(i,attr){
		return attr == "true" ? "false" : "true";
	});
    if( $(this).hasClass('opened') ) {
        $(this).removeClass('opened');
        $(this).parents('fieldset').children('div').hide();
    } else {
        $(this).addClass('opened');
        $(this).parents('fieldset').children().show();
    }

});

//túl sok facet eltünteése plusz jel kipakolása stb...
//a mégtöbb gombra a label szövegt rakja --> még több/kevesebb ##labelszöveg##
//XX2SA1793786

/*
$('#facet fieldset').each(function(){
    labelek = $(this).find('label');
    if ( labelek.length > 5 ) {
        $(this).children('div').append('<a class="opener" href="#">még több ' + $(this).children('legend').text() + '</a>')
        $(labelek).slice(5).addClass('hidden');
    }
});

$('#facet a.opener').click(function(){
    if ( $(this).parents('div').find('label.nothidden').length) {
        $(this).parents('div').find('label.nothidden').removeClass('nothidden').addClass('hidden');
        $(this).removeClass("opened");
        $(this).text($(this).text().replace('kevesebb','még több'));
          return false;
    } else {
       $(this).parents('div').find('label.hidden').removeClass('hidden').addClass('nothidden');
       $(this).addClass("opened");
       $(this).text($(this).text().replace('még több','kevesebb'));
         return false;
    }

});

*/



//onresize

$(window).resize(function() {

	resizeColDivs();
	resizeBoxDivs();

    if ( $('#filter').length ) {

        kijelzo_szeles = $('#where_f').width()+68;

        filter_szeles = $('#filter').width();
        input_szeles = filter_szeles - kijelzo_szeles;
        $('#filter .filter_text').width(input_szeles);
    }


});

$(function(){
	
	const strAllFilterClass = $("body.publications").length ? 'publcard' : 'card';
	const strAllFilter = '.'+strAllFilterClass;
	const strAllFilterElement = $("body.publications").length ? 'a' : 'div';
	
	
	  $('#card-filter button').each(function () {
		  var strType = $(this).attr('data-filter');
		  if ( strType.startsWith('.')) {
			strType = strType.substring(1);
			if ( ! $('#filter-card ' + strAllFilter).hasClass(strType) ) {
				$(this).remove();
			}
		  }
	  });


	function addAriaCodeMixItIp() {
		$('#card-filter button').attr('aria-pressed', 'false');
		$('#card-filter button.active').attr('aria-pressed', 'true');
		if ( $('#card-filter button.active').attr('data-filter')  == 'all' ) {
			$('h1.card-result').html( $('#card-filter button.active').text() + ' ' + $('h1.card-result').attr('data-alltxt') )
		} else {
			$('h1.card-result').html( $('#card-filter button.active').text() + ' ' + $('h1.card-result').attr('data-txt') )
		}
	}

	function showResultMixItIp(intResult) {
		$('p.hit-info span').html( intResult );
	}
	/*
	$('#card-filter button.pgroup').click(function() {
		//var strNorFilter = $('#card-filter .filter').attr('data-filter');
		//if ( strNorFilter == "all" ) { strNorFilter = "" }
		$('#filter-card').mixItUp('filter', $(this).attr('data-filter') + strNorFilter);
		//$('#filter-card .card').hide();
		//$('#filter-card '+$(this).attr('data-filter')).show();
		$("#card-filter button").removeClass("active");
		$(this).addClass("active");
	})*/
	
	var mixer = $('#filter-card').mixItUp({
		load: {
			filter: window.location.hash ? '.'+(window.location.hash).replace('#','') : 'all',
		},
		layout: {
			display: strAllFilterClass == 'card' ? 'inline-block' : 'grid'
		},
		selectors: {
			target: strAllFilter
		},
		callbacks: {
/*			onMixLoad: function(state){
				//resizeColDivs();
				resizeBoxDivs();
				console.log('onMixLoad STOP');
			},*/
			onMixStart: function(state, futureState){
				//
				addAriaCodeMixItIp();
				if ( futureState.activeFilter == strAllFilter ) {
					$('#card-filter button.pgroup').show();
				} else if ( $("#card-filter button.active").hasClass('ptype') ) {
					$('#card-filter button.pgroup').each(function () {
						var strType = $(this).attr('data-filter');
						if ( $('#filter-card '+strAllFilter+strType+futureState.activeFilter).length ) {
							$(this).show();
						} else {
							$(this).hide();
						}
					});
					
				}
				if ( futureState.activeFilter == strAllFilter ) {
					history.replaceState("", document.title, window.location.pathname + window.location.search);
					$("#cat-description .inner").html("");
				} else {
					history.replaceState("", document.title, window.location.pathname + '#' + futureState.activeFilter.substring(1));
					if ( $(futureState.activeFilter).hasClass("pgroup") ) {
						if ( $(futureState.activeFilter).attr('data-description') == undefined ) {
							$("#cat-description .inner").html("");
						} else {
							$("#cat-description .inner").html($(futureState.activeFilter).attr('data-description'));
						}
					} else {
						$("#cat-description .inner").html("");
					}
				}
			},
			onMixEnd: function(state){
				//resizeColDivs();
				resizeBoxDivs();
				showResultMixItIp(state.totalShow);
			}
		}
	});

});

//popup

$('.popup-opener').click(function(){
    $('body').addClass('popped');
    $('#popup').show();
	$(this).addClass('return-focus').blur();
	focusTrap($('#popup'));
	$('#popup .close-popup').focus();
    //return false;
});
$('.close-popup').click(function(){
   $('body').removeClass('popped');
    $('.popup').hide();
	$('.return-focus').focus().removeClass('return-focus');
	//window.history.back();
    //return false;
});

//alkalmazás popup
$('.freewriting.alkalmazas a').click(function(){
	$.ajax({
		url: window.location.protocol + '//' + window.location.hostname + '/tart/alkalmazas' + $(this).attr('href'),
		success: function (data) {
			$('#app-popup-content').html(data);
			$('body').addClass('popped');
			$('#app-popup').show();
			$(this).addClass('return-focus').blur();
			focusTrap($('#app-popup'));
		}
	});
	//alert($(this).attr('href'));
	//alert(window.location.protocol + '//' + window.location.hostname + '/alkalmazas' + $(this).attr('href'));
	var arrClasses = $(this).parent().attr('class').split(" ");
	$('#app-popup').removeClass();
	$('#app-popup').addClass("popup");
	for (var i = 0; i < arrClasses.length; i++ ) {
		if ( arrClasses[i].substring(0,4) != 'card' && arrClasses[i] != 'freewriting' && arrClasses[i] != 'alkalmazas' ) {
			$('#app-popup').addClass(arrClasses[i]);
		}
	}
	//$('#app-popup .close-popup').focus();
	//window.history.pushState({}, "", '/?a=/alkalmazas'+$(this).attr('href'));
    return false;
});

//alkalmazás popup

$( ".freewriting" ).on( "click", ".table-opener", function() {
	$('#table-popup-content').html($(this).closest("table").wrap('<span/>').parent().html());
	$(this).closest("table").unwrap('<span/>');
	$('#table-popup-content table caption button').remove();
	$('#table-popup-content table .footnote').unwrap();
	$('#table-popup-content table .anchor').remove();
	
	$('body').addClass('popped');
	$('#table-popup').show();
	$(this).addClass('return-focus').blur();
	focusTrap($('#table-popup'));
	
});

$(function(){
    if ($('#submenu a.active').length) {
		$("body").addClass($('#submenu a.active').parent().attr('class'));
    }
});

// ha a kinyitó az utolsó elem, akkor üres a sidebar ne jelenítsük meg mobil és tablet nézetben
$(function(){
	if ($('#sidebar').length ) {
		if ( $('#sidebar').children().last().attr('id') == 'sidebar-mobil-opener')  {
			//$('#sidebar').remove();
			$('#sidebar').addClass('hide-in-tablet-view');
		}
	}
});


//mobimenube cancel buttony
var cancelbuttontext = 'cancel';
if( $('html').attr('lang') == 'hu' ) {
	cancelbuttontext = 'mégsem';
}
	var cancelbutton = '<button type="cancel" id="qs-cancel">'+cancelbuttontext+'</button>'

//mobilmenü - mobilegyéb
$('#mobil-menu-opener').click(function(){

   $('body').addClass('popped');
   $('#mobil-menu-content').append($('#quick_search')).append(cancelbutton).append($('#page_header nav.menu')).append($('nav.lang'));
   $('#mobil-menu-content nav.menu li:contains("Fogyasztóknak")').append($('#submenu ul'));
   $('#mobil-menu').show();
   $(this).addClass('return-focus').blur();
   focusTrap($('#mobil-menu'));
   $('#close-mobil-menu').focus();

   return false;
});
/*
$('#close-mobil-menu').click(function(){
   $('body').removeClass('popped');
   $('#submenu nav').append($('#mobil-menu-content nav.menu li:contains("Fogyasztóknak") ul'));
   $('#page_header').append($('#mobil-menu-content nav.menu')).append($('#quick_search')).append($('nav.lang'));
   $('#mobil-menu').hide();
   $('#mobil-menu-opener').focus().removeClass('return-focus');
   return false;
});
*/
$('#close-mobil-menu').click(function(){
    $('body').removeClass('popped');
    $('#submenu nav').append($('#mobil-menu-content nav.menu li:contains("Fogyasztóknak") ul'));
    if( $('#l_menu').length ) {
        $('#l_menu').append($('#mobil-menu-content nav.menu')).append($('#quick_search')).append($('nav.lang'));
    } else {
        $('#page_header').append($('#mobil-menu-content nav.menu')).append($('#quick_search')).append($('nav.lang'));
    }
    $('#mobil-menu-content').empty();
    $('#mobil-menu').hide();
    $('#mobil-menu-opener').focus().removeClass('return-focus');
    return false;
});

$('.overlay').click(function (event)
{
   if(!$(event.target).closest('#popup-box').length && !$(event.target).is('#popup-box')) {
	   $('.close-popup').trigger("click");
   }
});


//respo scripts

function respo() {

	if($(window).width() > 980){
		//lábléc toggle nem kell, ha 980+
		/* régi
		$('#page_footer .box').find('nav, div').css('display', '');
		$('#page_footer .box-title').removeClass('close').off();
		*/
		//accessible upsize remove
		$('#page_footer .box-title button').contents().unwrap();
		$('#page_footer .box-title').removeClass('opened');
	}

	if($(window).width() < 981){
		/*
		$('#page_footer .box-title a').attr('href','javascript:void(0);')
		$('#page_footer .box-title').off();
		//lábléc toggle
		$('#page_footer .box-title').click(function(){
			$(this).toggleClass('close');
			$(this).parent().find('nav, div').toggle();
			//event.preventDefault();
			return false;
		});
		*/
		if ( !$('#page_footer .box-title').has('button').length ) {

			$('#page_footer .box-title').wrapInner('<button type="button" role="switch" aria-checked="false"></button>');
			$('#page_footer button').click(function(){
				$(this).attr('aria-checked', function(i,attr){
					return attr == "true" ? "false" : "true";
				});
				$(this).parent().toggleClass('opened');
			});//click

		}

		//sidebar oldalról régi
		/*
		$('#sidebar-mobil-opener').off();
		$('#sidebar-mobil-opener').click(function(){
			$('#sidebar').toggleClass('opened');
			$(this).blur();
		});
		*/
		//új accessible
		$('#sidebar-mobil-opener').off();
		$('#sidebar-mobil-opener').click(function(){
			$(this).attr('aria-checked', function(i,attr){
				return attr == "true" ? "false" : "true";
			});
			$('#sidebar').toggleClass('opened');
		});

		//kinti klikk bezár
		$('#main').off();
		$('#main').click(function(e){
			if ($(e.target).closest("#sidebar").length === 0) {
				$("#sidebar").removeClass('opened');
			}
		});

	}


	if($(window).width() < 586){


		//Mobil táblázat tyutyu

$('article table tbody td, article table tbody th').each(function(){
	if (
		!$(this).find('span.mobile-table-head').length
		) {

		$(this).prepend(
		'<span class="mobile-table-head">' + $(this).parents('table').find('thead tr *').eq($(this).index()).text() + ': </span>'
		);
	}
});


	} //586

//sidebar magasság próba, anchor bug végütt megy respoba is

/*
$('head').find('style:conains("#sidebar")').remove();
$('<style>#sidebar::before{height:'+ $('#main').height() +'px;}</style>').appendTo('head');
*/

$('head style:contains(#sidebar)').remove();
$('<style>#sidebar::before{height:'+ (Number($('#main').height())+ 32) +'px; height: calc('+ $('#main').height() +'px + 2em);}</style>').appendTo('head');

}//respo()

respo();
$(window).resize(function() {respo();});



//On focus csík cucc

$('#page_header a').mouseup(function(){
	$(this).blur();
});


//#tender-timeline gyerektelen szülőinek elkapása kariakfehérítés céljából

$('#tender-timeline li:not(:has(ul))').addClass('childless');

// külső linkekre stílus
//$('a').filter(function() {
//   return this.hostname && this.hostname !== location.hostname;
//}).addClass("external");





// INTERNET HOTLINE
// INTERNET HOTLINE
// INTERNET HOTLINE
// INTERNET HOTLINE
//InternetHOTLINE Microsite - L


//Felső NMHH menü nyitogató cuccok
$('nav.menu.nmhh .menu_toggler').click(function(){
	$(this).toggleClass('close');
	$(this).attr('aria-expanded', function(i,attr){
	 return attr == "true" ? "false" : "true";
	});
	$('nav.menu.nmhh .nmhh-menu').toggle();
});


//Felső flekkben szöveg középre
//átdolgozni
//régi var felsoeltartas = (($('#l-top .box .box-content').height() - $('#l-top .message_text').height()) / 2) -12;
var felsoeltartas = (($('#l-top .box:nth-child(2)').height() - ($('#l-top .box:nth-child(2) .box-content').height() + $('#l-top .box:nth-child(2) .button').height() )) / 2) -12;
//$('#l-top .box:nth-child(2)').css('background','pink');
$('.internethotline-logo.full').css('margin-top',felsoeltartas + 'px');

//Scrollra felugró menü

//var eccer = false;
//var $ltop = $('#l-top');
//var bottom = $ltop.position().top + $ltop.outerHeight(true); /* megöli a kutatásokat ???????????*/
//var bottom = $ltop.outerHeight(true);

//$(window).scroll(function () {

 //  if ($(window).scrollTop() >= $ltop.outerHeight(true)) {
 //  	if (!eccer) { $('#l_menu').addClass('sticky');}
 //  	eccer = true;
 //  } else {
 //  	if (!eccer) { $('#l_menu').removeClass('sticky');}
 //  	eccer = false;
 //  }
//});

//alert('sticky');
//$('#l_menu').addClass('sticky');

//Új sticky menü 2021 május
//fix 55px magas felső nmhh sáv van
//felülről jön, 55×2 után
$(window).scroll(function () {
    if ($(window).scrollTop() > 110) {
      $('#l_menu').addClass('sticky');
    } else {
      $('#l_menu').removeClass();
    }
});


//Fejlécre classt, ha van benne video vagy kép

$(function(){
	if (
		$('#bgvid').length || $('#bgimg').length || $('.bgimg').length || $('#carousel').length
		) {
		$('#l-top').addClass('with-bg');
	} //endif
});

//IH menü lemásolása a hamburgerbe reszponzivitás megoldása végütt, #l-top .box.menu nav.menu

$(function(){
	$('nav.menu.microsite ul').clone().addClass('mobil').prependTo('nav.menu.nmhh');
	$('#page_header h1 a').clone().addClass('home').prependTo('nav.menu.nmhh ul.mobil').wrap('<li></li>');
	$('body.index #l_menu h1 a').clone().addClass('home').prependTo('nav.menu.nmhh ul.mobil').wrap('<li></li>');
});


//HC tester
  $('body').append('<div id="testdiv"></div>');
  testcolor = $('#testdiv').css( "background-color").toLowerCase();
  if  (testcolor !== "#f9f9f9" && testcolor !== "rgb(249, 249, 249)") {
    $('body').addClass('hc');
  };
  $('#testdiv').remove();

$('div.box.wrilist div.box-content, div.box.staticlist div.box-content').each(function () {
	if ($.trim($(this).html()) == ''){
		$(this).parent().remove();
	}
})
$('.rwep').each(function () {
	if ( ($(this).find('.rwec').length && $.trim($(this).find('.rwec').html()) == '' ) || $.trim($(this).html()) == '' ){
		$(this).remove();
	}
})

  $('div.box.wrilist div.box-content, div.box.staticlist div.box-content, div.box.rss div.box-content').attr('role','list');
  $('div.box.wrilist div.box-content div.card, div.box.staticlist div.box-content div.card, div.box.rss div.box-content div.card').attr('role','listitem');
  
//Táblázatok körbevétele görgetés lehetősége végett
	$('article table').wrap('<div class="table-wrap"></div>');

	$('div.accordion details').click(function(){
		$(this).siblings().removeAttr('open');
	});
	
	
	$('#publication-footnotes').each(function () {
		
		var article = $('article');
		var i = 0;
		$(this).find('ol li').each(function () {
			i++;
			const id=$(this).attr("data-id");			
			var footnote = '\\*'+id+'\\*';
			//console.log(footnote);
			var footnoteRgx = new RegExp(footnote,"g")
			
			article.html(article.html().replace(footnoteRgx, "<a href='#pub-fn-"+id+"'>"+i+". lábjegyzet</a>"));
		});
		
		
	});
	
	$('a.publgroup').attr('href', $("header nav.menu a.active").attr('href') + $('a.publgroup').attr('href'));
	
	$("a[href^='#pub-fn']").on('click', function(e) {
		if ( $(this).next(".publication-footnoote").length ) {
			$('article .publication-footnoote').remove();		
		} else {
			$('article .publication-footnoote').remove();
			const strId = $(this).attr('href');
			const content = $(strId).html();
			//console.log(content);
			var clone = $($("#publication-footnote-template").html().trim());  
			clone.find('.content').html(content);
			clone.find('.close').on('click', function(e) {
				$('article .publication-footnoote').remove();
				e.preventDefault();
			});
			$(this).after(clone);
		}
		e.preventDefault();
	 });
	 

}); //docready

/*
var id;
$(window).resize(function() {
    clearTimeout(id);
    id = setTimeout(doneResizing, 500);

});

function doneResizing(){
  $("body").append("<br/>done!");
}
*/
