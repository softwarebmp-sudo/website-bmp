/***************************************************
==================== JS INDEX ======================
****************************************************
01. PreLoader Js
02. Sticky Header Js
03. HeaderHeight js
04. Add tag js
05. Common Js
06. Mobile Menu Js
07. Search js
08. Offcanvas Js
09. Body overlay Js
10. Back To Top Js
11. Mouse Custom js
12. Wow Js
13. Counter js
****************************************************/

(function ($) {
	"use strict";

	var windowOn = $(window);

	////////////////////////////////////////////////////
	// 01. PreLoader Js
	windowOn.on('load', function () {
		$("#loading").fadeOut(500);
	});

	
	////////////////////////////////////////////////////
	// 02. Sticky Header Js
	windowOn.on('scroll', function () {
		var scroll = $(window).scrollTop();	
		if (scroll < 200) {
			$("#header-sticky").removeClass("tp-header-sticky");
		} else {
			$("#header-sticky").addClass("tp-header-sticky");
		}
	});



	// 03. one page Header Js
	windowOn.on('scroll', function () {
		var scroll = $(window).scrollTop();	
		if (scroll < 200) {
			$("#header-sticky").removeClass("tp-header-onepage");
		} else {
			$("#header-sticky").addClass("tp-header-onepage");
		}

	});

	////////////////////////////////////////////////////
	// 03. sticky header
	function tp_pinned_header(){
		var lastScrollTop = 0;

		windowOn.on('scroll',function() {
				var currentScrollTop = $(this).scrollTop();

				if(currentScrollTop > lastScrollTop) {
						$('.tp-int-menu').removeClass('tp-header-pinned');
				}else if($(this).scrollTop() <= 500){
					$('.tp-int-menu').removeClass('tp-header-pinned');
				}else {
						// Scrolling up, remove the class
						$('.tp-int-menu').addClass('tp-header-pinned');
				}
				lastScrollTop = currentScrollTop;
		});
	}
	tp_pinned_header();
	

		////////////////////////////////////
		// 05. Add tag 
		$('.tp-main-menu ul li a').each(function(){
			$(this).wrapInner("<span></span>");
			});



		////////////////////////////////////////////////////
		// 06. Common Js
		$("[data-background").each(function () {
			$(this).css("background-image", "url( " + $(this).attr("data-background") + "  )");
		});

		$("[data-width]").each(function () {
			$(this).css("width", $(this).attr("data-width"));
		});

		$("[data-bg-color]").each(function () {
			$(this).css("background-color", $(this).attr("data-bg-color"));
		});

		$("[data-text-color]").each(function () {
			$(this).css("color", $(this).attr("data-text-color"));
		});

		$(".has-img").each(function () {
			var imgSrc = $(this).attr("data-menu-img");
			var img = `<img class="mega-menu-img" src="${imgSrc}" alt="img">`;
			$(this).append(img);

		});	

		
		////////////////////////////////////////////////////
		// 07. Mobile Menu Js
		if($('.tp-main-menu-content').length && $('.tp-main-menu-mobile').length){
			let navContent = document.querySelector(".tp-main-menu-content").outerHTML;
			let mobileNavContainer = document.querySelector(".tp-main-menu-mobile");
			mobileNavContainer.innerHTML = navContent;
		
		
			let arrow = $(".tp-main-menu-mobile .has-dropdown > a");
		
			arrow.each(function () {
				let self = $(this);
				let arrowBtn = document.createElement("BUTTON");
				arrowBtn.classList.add("dropdown-toggle-btn");
				arrowBtn.innerHTML = "<i class='fa-regular fa-angle-right'></i>";
		
				self.append(function () {
					return arrowBtn;
				});
		
				self.find("button").on("click", function (e) {
					e.preventDefault();
					let self = $(this);
					self.toggleClass("dropdown-opened");
					self.parent().toggleClass("expanded");
					self.parent().parent().addClass("dropdown-opened").siblings().removeClass("dropdown-opened");
					self.parent().parent().children(".submenu").slideToggle();
					
				});
		
				});
		}


		////////////////////////////////////////////////////
		// 08. Search Js
		$(".search-open-btn").on("click", function () {
			$(".search-area").addClass("search-opened");
			$(".search-overlay").addClass("opened");
		});
		$(".search-close-btn").on("click", function () {
			$(".search-area").removeClass("search-opened");
			$(".search-overlay").removeClass("opened");
		});


		////////////////////////////////////////////////////
		// 09. Offcanvas Js
		$(".offcanvas-open-btn").on("click", function () {
			$(".offcanvas__area").addClass("offcanvas-opened");
			$(".body-overlay").addClass("opened");
		});
		$(".offcanvas-close-btn ,.tp-main-menu-mobile .tp-onepage-menu li a  > *:not(button)").on("click", function () {
			$(".offcanvas__area").removeClass("offcanvas-opened");
			$(".body-overlay").removeClass("opened");
		});


		$(".cartmini-open-btn").on("click", function () {
			$(".cartmini__area").addClass("cartmini-opened");
			$(".body-overlay").addClass("opened");
		});
		$(".cartmini-close-btn").on("click", function () {
			$(".cartmini__area").removeClass("cartmini-opened");
			$(".body-overlay").removeClass("opened");
		});


		////////////////////////////////////////////////////
		// 10. Body overlay Js
		$(".body-overlay").on("click", function () {
			$(".offcanvas__area").removeClass("offcanvas-opened");
			$(".tp-search-area").removeClass("opened");
			$(".cartmini__area").removeClass("cartmini-opened");
			$(".body-overlay").removeClass("opened");
		});


		
		////////////////////////////////////////////////////
		// 11. Back To Top Js
		function back_to_top() {
			var btn = $('#back_to_top');
			var btn_wrapper = $('.back-to-top-wrapper');

			windowOn.scroll(function () {
				if (windowOn.scrollTop() > 300) {
					btn_wrapper.addClass('back-to-top-btn-show');
				} else {
					btn_wrapper.removeClass('back-to-top-btn-show');
				}
			});

			btn.on('click', function (e) {
				e.preventDefault();
				$('html, body').animate({ scrollTop: 0 }, '300');
			});
		}
		back_to_top();


	//////////////////////////////////
		// 12. Mouse Custom Cursor
		function itCursor() {
					var myCursor = jQuery(".mouseCursor");
					if (myCursor.length) {
							if ($("body")) {
								const e = document.querySelector(".cursor-inner"),
										t = document.querySelector(".cursor-outer");
								let n,
										i = 0,
										o = !1;
								(window.onmousemove = function(s) {
										o ||
												(t.style.transform =
														"translate(" + s.clientX + "px, " + s.clientY + "px)"),
												(e.style.transform =
														"translate(" + s.clientX + "px, " + s.clientY + "px)"),
												(n = s.clientY),
												(i = s.clientX);
								}),
								$("body").on("mouseenter", "button, a, .cursor-pointer", function() {
											e.classList.add("cursor-hover"), t.classList.add("cursor-hover");
									}),
									$("body").on("mouseleave", "button, a, .cursor-pointer", function() {
											($(this).is("a", "button") &&
													$(this).closest(".cursor-pointer").length) ||
											(e.classList.remove("cursor-hover"),
													t.classList.remove("cursor-hover"));
									}),
									(e.style.visibility = "visible"),
									(t.style.visibility = "visible");
							}
					}
		}
		itCursor();

		$(".tp-cursor-point-area").on("mouseenter", function () {
			$(".mouseCursor").addClass("cursor-big");
		});

		$(".tp-cursor-point-area").on("mouseleave", function () {
			$(".mouseCursor").removeClass("cursor-big");
		});
		$(".tp-cursor-point-area").on("mouseleave", function () {
			$(".mouseCursor").removeClass("cursor-big");
		});

				////////////////////////////////////////////////////
		// 13. One Page Scroll Js
		function scrollNav() {
			$('.tp-onepage-menu li a').click(function(){
				$(".tp-onepage-menu li a.active").removeClass("active");     
				$(this).addClass("active");
				
				$('html, body').stop().animate({
				scrollTop: $($(this).attr('href')).offset().top - 100
				}, 300);
				return false;
			});
		}
		scrollNav();

		////////////////////////////////////////////////////
		// Hero Active
		if ($('.tp-hero-active').length > 0){
		var swiper = new Swiper(".tp-hero-active", {
			modules: [SwiperGL],
			effect: "gl",
			gl: {
				// specify required shader effect
				shader: 'squares',
			},
			speed: 1200,
			loop:true,
			navigation: {
				prevEl: ".swiper-button-prev",
				nextEl: ".swiper-button-next",
			},
			autoplay: { enabled: true },
			delay: 3000,
		});
		}


		////////////////////////////////////////////////////
		// Hero 2 Active
		if ($('.tp-hero-2-active').length > 0) {
			var slider = new Swiper('.tp-hero-2-active', {
				slidesPerView: 2,
				spaceBetween: 30,
				loop: true,
				breakpoints: {
					'1700':{
						slidesPerView:2,
					},
					'1400':{
						slidesPerView:2,
					},
					'1200':{
						slidesPerView:2,
					},
					'992':{
						slidesPerView:2,
					},
					'766': {
						slidesPerView:1,
					},
					'576': {
						slidesPerView:1,
					},
					'0': {
						slidesPerView:1,
					},
					},
					// Navigation arrows
					navigation: {
						nextEl: ".hero-2-next",
						prevEl: ".hero-2-prev",
					},
				});
			}


		//////////////////////////////////////////
		// hero 3 active
		if ($('#showcase-slider-wrappper').length > 0) {

			const showcaseSwiper = new Swiper('#showcase-slider', {
				direction: "horizontal",
				loop: true,
				slidesPerView: 'auto',
				touchStartPreventDefault: false,
				speed:1000,
				autoplay:{
					delay:5000
				},
				effect: 'fade',
				simulateTouch : true,
				parallax:true,
				navigation: {
					clickable:true,
					nextEl: '.hero-3-next',
					prevEl: '.hero-3-prev',
				},
				pagination: {
					el: '.tp-slider-dot',
					clickable: true,
				},						
				on: {
					slidePrevTransitionStart: function () {	
			
						$('.tp-slider-dot').find('.swiper-pagination-bullet').each(function() {
							if (!$(this).hasClass("swiper-pagination-bullet-active")) {
								$('#trigger-slides .swiper-slide-active').find('div').first().each(function() {
									if (!$(this).hasClass("active")) {
										$(this).trigger('click');
									}
								});
								
								$('#trigger-slides .swiper-slide-duplicate-active').find('div').first().each(function() {
									if (!$(this).hasClass("active")) {
										$(this).trigger('click');
									}
								}); 
							}
						});
												
					},
					slideNextTransitionStart: function () {	
			
						$('.tp-slider-dot').find('.swiper-pagination-bullet').each(function() {
							if (!$(this).hasClass("swiper-pagination-bullet-active")) {
								$('#trigger-slides .swiper-slide-active').find('div').first().each(function() {
									if (!$(this).hasClass("active")) {
										$(this).trigger('click');
									}
								});
								
								$('#trigger-slides .swiper-slide-duplicate-active').find('div').first().each(function() {
									if (!$(this).hasClass("active")) {
										$(this).trigger('click');
									}
								}); 
							}
						});
												
					}
					},
			});	
			
			var vertex = 'varying vec2 vUv; void main() {  vUv = uv;  gl_Position = projectionMatrix  modelViewMatrix  vec4( position, 1.0 );	}';
			var fragment = `
				varying vec2 vUv;
			
				uniform sampler2D currentImage;
				uniform sampler2D nextImage;
				uniform sampler2D disp;
				uniform float dispFactor;
				uniform float effectFactor;
				uniform vec4 resolution;
			
				void main() {
			
					vec2 uv = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
			
					vec4 disp = texture2D(disp, uv);
					vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);
					vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);
					vec4 _currentImage = texture2D(currentImage, distortedPosition);
					vec4 _nextImage = texture2D(nextImage, distortedPosition2);
					vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);
			
					gl_FragColor = finalTexture; }
			
				`;
			
			var gl_canvas = new WebGL({
				vertex: vertex,
				fragment: fragment,
			});
					
			var addEvents = function(){
			
				var triggerSlide = Array.from(document.getElementById('trigger-slides').querySelectorAll('.slide-wrap'));
				gl_canvas.isRunning = false;
			
				triggerSlide.forEach( (el) => {
			
					el.addEventListener('click', function() {
			
							if( !gl_canvas.isRunning ) {
			
								gl_canvas.isRunning = true;
			
								document.getElementById('trigger-slides').querySelectorAll('.active')[0].className = '';
								this.className = 'active';
			
								var slideId = parseInt( this.dataset.slide, 10 );
			
								gl_canvas.material.uniforms.nextImage.value = gl_canvas.textures[slideId];
								gl_canvas.material.uniforms.nextImage.needsUpdate = true;
			
								gsap.to( gl_canvas.material.uniforms.dispFactor, {
									duration: 1,
									value: 1,
									ease: 'Sine.easeInOut',
									onComplete: function () {
										gl_canvas.material.uniforms.currentImage.value = gl_canvas.textures[slideId];
										gl_canvas.material.uniforms.currentImage.needsUpdate = true;
										gl_canvas.material.uniforms.dispFactor.value = 0.0;
										gl_canvas.isRunning = false;
									}
								});
			
							}
			
					});
			
				});
			
			};
			
			addEvents();
		}




		////////////////////////////////////////////////////
		// Hero 4 Active
		if ($('.tp-hero-4-active').length > 0){
		var slider = new Swiper('.tp-hero-4-active', {
			slidesPerView: 1,
			spaceBetween: 0,
			effect: 'fade',
			loop: true,
			mousewheel: true,
			// pagination
			pagination: {
				el: ".tp-hero-4-pagination",
				clickable: true
			},
		});
		}


		////////////////////////////////////////////////////
		// Hero 7 Active
		if ($('.tp-hero-7-active').length > 0){
			var swiper = new Swiper(".tp-hero-7-active", {
				slidesPerView:1,
				loop:true,
				effect: 'fade',
				navigation: {
					prevEl: ".hero-7-prev",
					nextEl: ".hero-7-next",
				},
			});
		}


		////////////////////////////////////////////////////
		// Hero 8 Active
		if ($('.tp-hero-8-slider').length > 0){
			var team = new Swiper('.tp-hero-8-slider', {
				slidesPerView: 3,
				loop: true,
				autoplay: false,
				arrow: false,
				mousewheel: true,
				spaceBetween: 50,
				autoplay: {
					delay: 3000,
				},
				breakpoints: {
					'1400': {
						slidesPerView: 3,
					},
					'1200': {
						slidesPerView: 3,
						spaceBetween:30,
					},
					'992': {
						slidesPerView: 3,
						spaceBetween:30,
					},
					'768': {
						slidesPerView: 2,
						spaceBetween:30,
					},
					'576': {
						slidesPerView: 1,
						spaceBetween:30,
					},
					'0': {
						slidesPerView: 1,
					},
				},
				// Navigation arrows
				navigation: {
					nextEl: ".hero-8-next-1",
					prevEl: ".hero-8-prev-1",
				},
			});
			}


		////////////////////////////////////////////////////
		// Hero 9 Active
			var verticalslider1 = new Swiper('.tp-hero-9-active', {
				// direction: "vertical",
				slidesPerView: 1,
				spaceBetween: 0,
				effect: 'fade',
				loop: true,
				mousewheel: true,
				pagination: {
					el: '.tp-slider-pagination',
					type: 'fraction',
					renderFraction: function (currentClass, totalClass) {
						return '<span class="' + currentClass + '"></span>' + ' <span class="tp-swiper-fraction-divide"></span> ' + '<span class="' + totalClass + '"></span>'; }
					},
			});

			$(window).scroll(function() {
				$('.tp-header-logo').addClass('scrolled');
			});
	

		////////////////////////////////////////////////////
		// Home One offer Active
		if ($('.tp-offer-active').length > 0) {
		var slider = new Swiper('.tp-offer-active', {
			slidesPerView: 4,
			spaceBetween: 30,
			loop: true,
			breakpoints: {
				'1400': {
					slidesPerView: 4,
				},
				'1200': {
					slidesPerView: 4,
				},
				'992': {
					slidesPerView: 3,
				},
				'650': {
					slidesPerView: 2,
				},
				'576': {
					slidesPerView: 1,
				},
				'0': {
					slidesPerView: 1,
				},
			},
			// pagination
			pagination: {
				el: ".tp-offer-pagination",
				clickable: true
			},
			navigation: {
				nextEl: ".tp-offer-next",
				prevEl: ".tp-offer-prev",
			},
		});
		}


		////////////////////////////////////////////////////
		// Home One portfolio Active
		if ($('.tp-portfolio-active').length > 0) {
		var slider = new Swiper('.tp-portfolio-active', {
			slidesPerView: 4,
			spaceBetween: 10,
			loop: true,
			breakpoints: {
				'1400': {
					slidesPerView: 4,
				},
				'1200': {
					slidesPerView: 3,
				},
				'992': {
					slidesPerView: 2,
				},
				'650': {
					slidesPerView: 2,
				},
				'576': {
					slidesPerView: 1,
				},
				'0': {
					slidesPerView: 1,
				},
			},
		});
		}


		////////////////////////////////////////////////////
		// Home One service Active
		if ($('.tp-service-5-active').length > 0) {
		var slider = new Swiper('.tp-service-5-active', {
			slidesPerView: 4,
			spaceBetween: 30,
			loop: true,
			breakpoints: {
				'1400': {
					slidesPerView: 4,
				},
				'1200': {
					slidesPerView: 3,
				},
				'992': {
					slidesPerView: 2,
				},
				'650': {
					slidesPerView: 2,
				},
				'576': {
					slidesPerView: 1,
				},
				'0': {
					slidesPerView: 1,
				},
			},
		});
		}


		////////////////////////////////////////////////////
		// Home One service Active
		if ($('.tp-testimonial-5-active').length > 0) {
		var slider = new Swiper('.tp-testimonial-5-active', {
			slidesPerView: 1,
			loop: true,
			navigation: {
				nextEl: ".tp-testimonial-5-next-1",
				prevEl: ".tp-testimonial-5-prev-1",
			},
		});
		}


		////////////////////////////////////////////////////
		// Home One portfolio Active
		if ($('.tp-portfolio-3-active').length > 0) {
		var slider = new Swiper('.tp-portfolio-3-active', {
			slidesPerView: 4,
			spaceBetween: 30,
			loop: true,
			breakpoints: {
				'1400': {
					slidesPerView: 4,
				},
				'1200': {
					slidesPerView: 4,
				},
				'992': {
					slidesPerView: 3,
				},
				'650': {
					slidesPerView: 2,
				},
				'576': {
					slidesPerView: 1,
				},
				'0': {
					slidesPerView: 1,
				},
			},
		});
		}


		////////////////////////////////////////////////////
		// Home One team Active
		if ($('.tp-team-2-active').length > 0) {
		var slider = new Swiper('.tp-team-2-active', {
			slidesPerView: 4,
			spaceBetween: 30,
			loop: true,
			breakpoints: {
				'1400': {
					slidesPerView: 4,
				},
				'1200': {
					slidesPerView: 3,
				},
				'992': {
					slidesPerView: 3,
				},
				'650': {
					slidesPerView: 2,
				},
				'576': {
					slidesPerView: 1,
				},
				'0': {
					slidesPerView: 1,
				},
			},
		});
		}

				////////////////////////////////////////////////////
		// Home One portfolio-7 Active
		if ($('.tp-portfolio-7-active').length > 0) {
			var slider = new Swiper('.tp-portfolio-7-active', {
				slidesPerView: 4,
				spaceBetween: 30,
				loop: true,
				breakpoints: {
					'1400': {
						slidesPerView: 4,
					},
					'1200': {
						slidesPerView: 4,
					},
					'992': {
						slidesPerView: 3,
					},
					'650': {
						slidesPerView: 2,
					},
					'576': {
						slidesPerView: 1,
					},
					'0': {
						slidesPerView: 1,
					},
				},
			});
			}
	

		////////////////////////////////////////////////////
		// Home two brand Active
		if ($('.tp-brand-active').length > 0) {
		var slider = new Swiper('.tp-brand-active', {
			slidesPerView: 5,
			spaceBetween: 120,
			centeredSlides: true,
			loop: true,
			autoplay: {
				delay: 3000,
			},
			breakpoints: {
				'1400': {
					slidesPerView: 5,
				},
				'1200': {
					slidesPerView: 5,
					spaceBetween: 30,
				},
				'992': {
					slidesPerView: 5,
					spaceBetween: 30,
				},
				'760': {
					slidesPerView: 4,
					spaceBetween: 30,
				},
				'576': {
					slidesPerView: 3,
					spaceBetween: 30,
				},
				'450':{
					slidesPerView: 3,
				},
				'0': {
					slidesPerView: 2,
				},
			},
		});
		} 


		////////////////////////////////////////////////////
		// Home two brand Active
		if ($('.tp-brand-3-active').length > 0) {
		var slider = new Swiper('.tp-brand-3-active', {
			slidesPerView: 5,
			spaceBetween: 120,
			loop: true,
			autoplay: {
				delay: 3000,
			},
			breakpoints: {
				'1400': {
					slidesPerView: 5,
				},
				'1200': {
					slidesPerView: 5,
					spaceBetween: 30,
				},
				'992': {
					slidesPerView: 5,
					spaceBetween: 30,
				},
				'760': {
					slidesPerView: 4,
					spaceBetween: 30,
				},
				'576': {
					slidesPerView: 3,
					spaceBetween: 30,
				},
				'450':{
					slidesPerView: 3,
				},
				'0': {
					slidesPerView: 2,
				},
			},
		});
		} 


		////////////////////////////////////////////////////
		// Home two testimonial Active
		if ($('.tp-testimonial-active').length > 0) {
		var slider = new Swiper('.tp-testimonial-active', {
			slidesPerView: 3,
			spaceBetween: 30,
			loop: true,
			breakpoints: {
				'1400': {
					slidesPerView: 3,
				},
				'1200': {
					slidesPerView: 3,
				},
				'992': {
					slidesPerView: 2,
				},
				'650': {
					slidesPerView: 2,
				},
				'576': {
					slidesPerView: 1,
				},
				'0': {
					slidesPerView: 1,
				},
			},
		});
		}


		////////////////////////////////////////////////////
		// Home two testimonial Active
		if ($('.tp-testimonial-6-active').length > 0) {
		var slider = new Swiper('.tp-testimonial-6-active', {
			slidesPerView: 3,
			spaceBetween: 30,
			loop: true,
			centeredSlides: true,
			breakpoints: {
				'1400': {
					slidesPerView: 3,
				},
				'1200': {
					slidesPerView: 3,
				},
				'992': {
					slidesPerView: 2,
				},
				'650': {
					slidesPerView: 2,
				},
				'576': {
					slidesPerView: 1,
				},
				'0': {
					slidesPerView: 1,
				},
			},
		});
		}


		////////////////////////////////////////////////////
		// Home six project-6 Active
		if ($('.tp-project-6-active').length > 0) {
		var slider = new Swiper('.tp-project-6-active', {
			slidesPerView: 4,
			spaceBetween: 30,
			loop: true,
			breakpoints: {
				'1400': {
					slidesPerView: 4,
				},
				'1200': {
					slidesPerView: 3,
				},
				'992': {
					slidesPerView: 2,
				},
				'650': {
					slidesPerView: 2,
				},
				'576': {
					slidesPerView: 1,
				},
				'0': {
					slidesPerView: 1,
				},
			},
		});
		}


		////////////////////////////////////////////////////
		// team Active
		if ($('.tp-blog-post-active').length > 0) {
			var slider = new Swiper('.tp-blog-post-active', {
				slidesPerView: 1,
				spaceBetween: 30,
				loop: true,
				// Navigation arrows
				navigation: {
					nextEl: ".tp-blog-next-1",
					prevEl: ".tp-blog-prev-1",
				},
				});
			}


		////////////////////////////////////////////////////
		// Jquery Appear radial
		if (typeof ($.fn.knob) != 'undefined') {
			$('.knob').each(function () {
			var $this = $(this),
			knobVal = $this.attr('data-rel');

			$this.knob({
			'draw': function () {
				$(this.i).val(this.cv + '%')
			}
			});

			$this.appear(function () {
			$({
				value: 0
			}).animate({
				value: knobVal
			}, {
				duration: 2000,
				easing: 'swing',
				step: function () {
				$this.val(Math.ceil(this.value)).trigger('change');
				}
			});
			}, {
			accX: 0,
			accY: -150
			});
		});
		}
	
		
		///////////////////////////////////////////////////
		//// tab line
		if ($('#marker').length > 0) {
			function tp_tab_line(){
				var marker = document.querySelector('#marker');
				var item = document.querySelectorAll('.tp-tab-menu button');
				var itemActive = document.querySelector('.tp-tab-menu .nav-link.active');
	
				// rtl settings
				var tp_rtl = localStorage.getItem('tp_dir');
				let rtl_setting = tp_rtl == 'rtl' ? 'right' : 'left';
	
				function indicator(e){
					marker.style.left = e.offsetLeft+"px";
					marker.style.width = e.offsetWidth+"px";
				}
					
			
				item.forEach(link => {
					link.addEventListener('click', (e)=>{
						indicator(e.target);
					});
				});
				
				var activeNav = $('.nav-link.active');
				var activewidth = $(activeNav).width();
				var activePadLeft = parseFloat($(activeNav).css('padding-left'));
				var activePadRight = parseFloat($(activeNav).css('padding-right'));
				var totalWidth = activewidth + activePadLeft + activePadRight;
				
				var precedingAnchorWidth = anchorWidthCounter();
			
			
				$(marker).css('display','block');
				
				$(marker).css('width', totalWidth);
			
				function anchorWidthCounter() {
					var anchorWidths = 0;
					var a;
					var aWidth;
					var aPadLeft;
					var aPadRight;
					var aTotalWidth;
					$('.tp-tab-menu button').each(function(index, elem) {
						var activeTest = $(elem).hasClass('active');
						marker.style.left = elem.offsetLeft+"px";
						if(activeTest) {
						// Break out of the each function.
						return false;
						}
				
						a = $(elem).find('button');
						aWidth = a.width();
						aPadLeft = parseFloat(a.css('padding-left'));
						aPadRight = parseFloat(a.css('padding-right'));
						aTotalWidth = aWidth + aPadLeft + aPadRight;
				
						anchorWidths = anchorWidths + aTotalWidth;
		
					});
			
					return anchorWidths;
				}
			}
			tp_tab_line();
			}

			////////////////////////////////////////////
		// 17. Ecommerce js
		function tp_ecommerce() {
			$('.tp-cart-minus').on('click', function () {
				var $input = $(this).parent().find('input');
				var count = parseInt($input.val()) - 1;
				count = count < 1 ? 1 : count;
				$input.val(count);
				$input.change();
				return false;
			});
		
			$('.tp-cart-plus').on('click', function () {
				var $input = $(this).parent().find('input');
				$input.val(parseInt($input.val()) + 1);
				$input.change();
				return false;
			});
	
			$('.cart-minus').on('click', function () {
				var $input = $(this).parent().find('input');
				var count = parseInt($input.val()) - 1;
				count = count < 1 ? 1 : count;
				$input.val(count);
				$input.change();
				return false;
			});
		
			$('.cart-plus').on('click', function () {
				var $input = $(this).parent().find('input');
				$input.val(parseInt($input.val()) + 1);
				$input.change();
				return false;
			});
		
		
			////////////////////////////////////////////////////
			// 18. Show Login Toggle Js
			$('#showlogin').on('click', function () {
				$('#checkout-login').slideToggle(900);
			});
		
			////////////////////////////////////////////////////
			// 19. Show Coupon Toggle Js
			$('#showcoupon').on('click', function () {
				$('#checkout_coupon').slideToggle(900);
			});
		
			////////////////////////////////////////////////////
			// 20. Create An Account Toggle Js
			$('#cbox').on('click', function () {
				$('#cbox_info').slideToggle(900);
			});
		
			////////////////////////////////////////////////////
			// 21. Shipping Box Toggle Js
			$('#ship-box').on('click', function () {
				$('#ship-box-info').slideToggle(1000);
			});
		}
		tp_ecommerce();


		////////////////////////////////////////////////////
		// 15. Masonary Js
		$('.grid').imagesLoaded(function () {
			// init Isotope
			var $grid = $('.grid').isotope({
				itemSelector: '.grid-item',
				percentPosition: true,
				masonry: {
					// use outer width of grid-sizer for columnWidth
					columnWidth: 1,
				}
			});


			// filter items on button click
			$('.masonary-menu').on('click', 'button', function () {
				var filterValue = $(this).attr('data-filter');
				$grid.isotope({ filter: filterValue });
			});

			//for menu active class
			$('.masonary-menu button').on('click', function (event) {
				$(this).siblings('.active').removeClass('active');
				$(this).addClass('active');
				event.preventDefault();
			});

		});

		////////////////////////////////////////////////////
		// 11. Nice Select Js
		$('select').niceSelect();
		$('.tp-shop-from select').niceSelect();

		////////////////////////////////////////////////////
		/* 12. MagnificPopup img view */
		$('.popup-image').magnificPopup({
			type: 'image',
			gallery: {
				enabled: true
			}
		});
		

		/* magnificPopup video view */
		$(".popup-video").magnificPopup({
			type: "iframe",
		});

			//////////////////////////////////////////////////
		// 13. Hover to Active
		$('.tp-counter-item').on('mouseenter', function () {
			$(this).addClass('active').parent().siblings().find('.tp-counter-item').removeClass('active');
		});

		////////////////////////////////////////////////////
		// 14. Wow Js
		new WOW().init();

		
		//////////////////////////////////////
		// webgl image effect
		$('img').imagesLoaded()
		.done(function(instance) {
		  allImagesLoaded();
		})
		.fail(function(instance) {
		  
		  handleFailedImages(instance);
		});
  
	  
		function allImagesLoaded() {
			
			$('.tp-hover-distort-wrapper').each(function(){
				var $this = $(this)
				var canvas = $this.find('.canvas')
				
				if($this.find('img.front')){
					$this.css({
						"width" : $this.find('img.front').width(),
						"height" : $this.find('img.front').height(),
					})
				}
			
				var frontImage = $this.find('img.front').attr('src')
				var backImage = $this.find('img.back').attr('src')
				var displacementImage = $this.find('.tp-hover-distort').attr('data-displacementImage')
		
				var distortEffect = new hoverEffect({
					parent: canvas[0],
					intensity: 3,
					speedIn: 2,
					speedOut: 2,
					angle: Math.PI / 3,
					angle2: -Math.PI / 3,
					image1: frontImage,
					image2: backImage,
					displacementImage: displacementImage,
					imagesRatio: $this.find('.tp-hover-distort').height()/$this.find('.tp-hover-distort').width()
				});
		
			});
		}
	
		function handleFailedImages(instance) {
			console.error('One or more images failed to load.');
	
			var failedImages = instance.images.filter(function(img) {
			return !img.isLoaded;
			});
	
			failedImages.forEach(function(failedImage) {
			console.error('Failed image source:', failedImage.img.src);
			});
		}


		// hover reveal start
		const hoverItem = document.querySelectorAll(".tp-hover-reveal-item");
		function moveImage(e, hoverItem,index) {
			const item = hoverItem.getBoundingClientRect();
			const x = e.clientX - item.x;
			const y = e.clientY - item.y;
			if (hoverItem.children[index]) {
				hoverItem.children[index].style.transform = `translate(${x}px, ${y}px)`;
			}
		}
		hoverItem.forEach((item, i) => {
			item.addEventListener("mousemove", (e) => {
				setInterval(moveImage(e, item,1), 100);
			});
		});
		// hover reveal end

		////////////////////////////////////////////////////
		// 15. Counter Js
		new PureCounter();
	

})(jQuery);