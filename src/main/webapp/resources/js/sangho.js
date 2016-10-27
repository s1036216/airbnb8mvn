var sangho = (function() {
	var init = function() {
		onCreate();
	}
	var setContentView = function() {
		
	}
	var onCreate = function() {
		setContentView();
		// 디테일 에서 예약 요청 버튼(결제 화면 이동 버튼) //
		$('#pub_article').on('click','a[name=detail_go]',function(){
			booking.show_detail($(this).children('input').prop('value'))
			$('#pub_article').html(DETAIL_FORM);
			$('button[name=paying_go]').click(function(e) {
				e.preventDefault();
				var detail = {
					'checkin' : $('#checkin_date').val(),
					'checkout' : $('#checkout_date').val(),
					'guestCnt' : $('#guest_cnt option:selected').val(),
					'houseSeq' : $(this).children('input').prop('value')
				}
				$.ajax({
					url : app.context()+'/booking/GoPay',
					type : 'POST',
					data : JSON.stringify(detail),
					dataType : 'json',
					contentType : 'application/json',
					async : false,
					success : function(data) {
						if (data.houseSeq != 0) {
							alert('결제화면으로 이동');
							$('#pub_article').html(PAYING_FORM);
						}
					},	
					error : function(x,s,m) {
						alert('결제화면으로 이동 중 에러 발생 : '+m);
					}	
				});
				/// 카드번호 정규식 ///
				$('#card_number').keyup(function(e) {
					if((e.which >=48 && e.which <= 57) || (e.which >=96 && e.which <= 105) || e.which==189 || e.which==8 || e.which==109){
						var cardNum = $(this).val();
						if(cardNum.length > 18){
							if(card_util.card_num_checker($(this).val())){
								$('#card_error').html('<font color="black">올바른 카드 번호</font>');
								// 나중에 flag 만들어서 모두 참일 때만 다음버튼 활성화 해야 함. 여기가 1번
								$('#bt_agrees').prop('disabled',false);
								$('#paying_complete').toggle('disabled');
							}else{
								$('#card_error').html('<font color="black">잘못된 카드 번호 입니다</font>');
								$(this).focus();
							}	
						}	
					}else{
						$(this).prop('value',$(this).prop('value').substring(0,$(this).prop('value').length-1));
					}	
				})
		/*		
				function agreeCheck(frm)
				{
					if (frm.bt_paying.disabled==true)
						frm.bt_paying.disabled=false
						else
						frm.bt_paying.disabled=true
				}
				
				$('#pub_artcle').on('click','#bt_agrees', function agreeCheck(frm) {
					frm.preventDefault();
					
				});*/
				///////////////////////////////////////
				$('#pub_article').on('click','#bt_agrees', function() {
					$('#paying_complete').toggle('disabled');
					
					/*if($('#paying_complete').prop('disabled')==false){
						$('#paying_complete').prop('disabled',true);
					}else{
						$('#paying_complete').prop('disabled',false);					
					}	*/
				})
				/// 결제화면 에서 결제버튼 ///
				$('#paying_complete').click(function(e) {
					e.preventDefault();
					var pay_data = {
						'cardNum' : $('#card_number').val()
						/*'paymentSeq' : $(#'').val(),
						'price' : $(#'').val(),
						'paymentDate' : $(#'').val(),
						'resvSeq' : $(#'').val()*/
							}
					$.ajax({
						url : app.context()+'/booking/payment',
						type : 'POST',
						data : JSON.stringify(pay_data),
						dataType : 'json',
						contentType : 'application/json',
						async : false,
						success : function(data) {
							if (data.message === 'ok') {
								alert('결제완료!');
								$('#pub_article').html(CANCEL_FORM);
							}
						},	
						error : function(x,s,m) {
							alert('결제 중 에러 발생 : '+m);
						}	
					});
				});
				////////////////////////////////////////
				
	/*			$.getJSON(app.context()+'/booking/list/'+pgNum,function(data){
					var frame = '';
					var startPg = data.startPg;
					var lastPg = data.lastPg;
					var pgSize = data.pgSize;
					var totPg = data.totPg;
					var groupSize = data.groupSize;
					console.log('스타트페이지'+startPg);
					console.log('라스트페이지'+lastPg);
					console.log('페이지사이즈'+pgSize);
					console.log('토탈페이지'+totPg);
					console.log('그룹사이즈'+groupSize);
					var booking_list =  
						'<div id="cancel_form" class="formbox2">'
						+'<h2>예약취소</h2>'
						+'<p class="m_b_5">* <span class="red">예약정보</span>를 잘 확인하여 취소하시기 바랍니다.</p>'
						+'<table class="table table-striped">'
						+'<caption><h4 style="text-align:center">예약정보</h4></caption>'
						+'<thead>'
						+'<tr>'
						+'<th scope="col">예약신청일</th>'
						+'<th scope="col">이용기간</th>'
						+'<th scope="col">예약장소</th>'
						+'<th scope="col">취소</th>'
						+'</tr>'
						+'</thead>'
						+'<tbody>'
						+'</tbody>'
						+'</table>';
					if(data.count == 0){
						booking_list+='<td colspan="10"><center>신청하신 내역이 없습니다.</center></td>';
					}else{
						$.each(data.list, function(i, booking) {
							booking_list+=
								+'<tr>'
								+'<th scope="col">'+booking.paymentDate+'</th>'
								+'<th scope="col">'+booking.checkinDate+'</th>~<th scope="col">'+booking.checkoutDate+'</th>'
								+'<th scope="col">'+house.state+'</th>'
								+'<th scope="col"><a class="regist" id=resv_cancel>취소</a>'
								+'</tr>';
						});
					}
					booking_list += '</tbody></table>'
						var pagination='<nav aria-label="Page navigation" align="center"><ul class="pagination">';
						if((startPg-lastPg) > 0){
							pagination += 
								+'<li>'
								+'<a href="'+app.context()+'/booking/list/'+(startPg-lastPg)+'" aria-label="Previous">'
								+'<span aria-hidden="true">&laquo;</span>'
								+'</a>'
								+'</li>';
						}
						for(var i=startPg; i<=lastPg; i++){
							if(i==pgNum){
								pagination +='<font color="red">'+i+'</font>';
							}else{
								pagination += '<a href="#" onclick="booking_list('+i+')">'+i+'</a>';
							}
						}
						if(startPg + pgSize <= totPg){
							pagination += 
								+'<li>'
								+'<a href="'+app.context()+'/booking/list/'+(startPg-pgSize)+'}" aria-label="Next">'
								+ '<span aria-hidden="true">&laquo;</span>'
								+'</a>'
								+'</li>';
						}
						pagination += +'</ul></nav>'
						
						frame += booking_list;
						frame += pagination;
						$('#pub_article').html(frame);
				});*/
			})
		});
	}
	return {
		init : init
	}
})();



var card_util = (function(){
	return {
		isNumber : function(value){
			return typeof value === 'number' && isFinite(value);
		},
		card_num_checker : function(value){
			var cnc_regex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
			return cnc_regex.test(value)?true:false;
		}
	};
})();
var DETAIL_FORM = '<div id="room">'
+'<div id="photos" class="with-photos with-modal"><img alt="img" src="/web/resources/img/booking/default.jpg" width="100%" height="550px" style="padding-bottom : 5%;"/>'
+'</div>'
+'<div id="summary" class="panel room-section">'
+'<div class="page-container-responsive">'
+'<div class="row">'
+'<div class="col-lg-8">'
+'<div>'
+'<div class="summary-component">'
+'<div class="space-4 space-top-4">'
+'<div class="row">'
+'<div class="col-md-3 space-sm-4 text-center space-sm-2">'
+'<div class="media-photo-badge"><a class="media-photo media-round"><img alt="사용자 프로필 이미지" class="host-profile-image" height="115" width="115" data-pin-nopin="true" src="/web/resources/img/booking/default.jpg" title="Donald"></a>'
+'</div>'
+'</div>'
+'<div class="col-md-9">'
+'<h1 class="overflow h3 space-1 text-center-sm" id="listing_name">Ocean Front Condo by Owner</h1>'
+'<div id="display-address" class="space-2 text-muted text-center-sm"><a href="#neighborhood" class="link-reset">노스 머틀 비치, 사우스캐롤라이나, 미국</a>'
+'<span> &nbsp; </span>'
+'</div>'
+'<div class="row row-condensed text-muted text-center">'
+'<div class="col-sm-3">'
+'<i class="icon icon-entire-place icon-size-2" aria-hidden="true"></i>'
+'</div>'
+'<div class="col-sm-3">'
+'<i class="icon icon-group icon-size-2" aria-hidden="true"></i>'
+'</div>'
+'<div class="col-sm-3">'
+'<i class="icon icon-rooms icon-size-2" aria-hidden="true"></i>'
+'</div>'
+'<div class="col-sm-3">'
+'<i class="icon icon-double-bed icon-size-2" aria-hidden="true"></i>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'<div class="row">'
+'<div class="col-md-3 text-muted text-center hide-sm">'
+'<a href="#host-profile" class="link-reset text-wrap">Donald</a>'
+'</div>'
+'<div class="col-md-9">'
+'<div class="row row-condensed text-muted text-center">'
+'<div class="col-sm-3">집 전체</div>'
+'<div class="col-sm-3">숙박 인원 3명</div>'
+'<div class="col-sm-3">침실 1개</div>'
+'<div class="col-sm-3">침대 1개</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
 +'<div class="col-lg-4">'
 +'<div class="mobile-bookit-btn-container js-bookit-btn-container panel-btn-sm panel-btn-fixed-sm hide hide-md hide-lg">'
+'<button name="paying_go" class="btn btn-primary btn-block btn-large js-book-it-sm-trigger">'
+'<span class="book-it__btn-text">예약 요청</span>'
 +'<span class="book-it__btn-text--contact-host">호스트에게 연락하기</span>'
+'<span class="book-it__btn-text--instant"><i class="icon icon-bolt icon-beach h4"></i>즉시 예약 </span>'
 +'</button>'
+'</div>'
+''
+'<div id="tax-descriptions-tip" class="tooltip tooltip-top-middle" role="tooltip" data-sticky="true" data-trigger="#tax-descriptions-tooltip">'
+'</div>'
+''
+''
 +'<div>'
+'<div class="book-it__container js-book-it-container fixed" style="top: 40px;">'
+'<div>'
+'<div>'
+'<div class="">'
+'<div class="book-it__price fixed" style="height: 40px;">'
+'<div class="row">'
+'<div class="col-sm-8">'
+'<div class="book-it__price-amount text-special">'
+'<span class="h3"><span>₩74315</span></span>'
+'</div>'
+'</div>'
+'<div class="col-sm-4">'
+'<div class="book-it__payment-period-container pull-right">'
+'<div class="book-it__payment-period"><span>1박</span>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'<form method="post">'
+'<div class="panel book-it-panel">'
+'<div class="panel-body panel-light">'
+'<div class="row row-condensed space-3">'
+'<div class="col-md-9">'
+'<div class="row row-condensed">'
+'<div class="col-sm-6">'
+'<label class="book-it__label" for="datespan-checkin">체크인</label>'
+'<input id="checkin_date" type="text" name="checkin" class="checkin ui-datepicker-target" placeholder="년/월/일">'
+'</div>'
+'<div class="col-sm-6">'
+'<label class="book-it__label" for="datespan-checkout">체크아웃</label>'
+'<input id="checkout_date" type="text" name="checkout" class="checkout ui-datepicker-target" placeholder="년/월/일">'
+'</div>'
+'</div>'
+'</div>'
+'<div class="col-md-3">'
+'<div>'
+'<label for="number_of_guests_21674" class="book-it__label"><span>숙박 인원</span></label>'
+'<div class="select select-block">'
+'<select id="guest_cnt" name="number_of_guests">'
+'<option selected="selected" value="1">1</option>'
+'<option value="2">2</option>'
+'<option value="3">3</option>'
+'</select>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'<div>'
+'<button class="btn btn-primary btn-large btn-block" name="paying_go">'
+'<span>예약 요청</span>'
+'</button>'
+'<div class="bookit-message__container text-center text-muted">'
+'<small><span>"예약" 버튼을 클릭해도 대금이 바로 청구되지 않습니다.</span></small>'
+'</div>'
+'</div>'
+'<div class="hide">'
+'<button type="button" class="btn btn-primary btn-large btn-small btn-block">'
+'<span>호스트에게 연락하기</span>'
+'</button>'
+'</div>'
+'</div>'
+'</div>'
+'</form>'
+'</div>'
+'</div>'
 +'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+''
+'<div>'
+'<div>'
+'<div id="details" class="details-section webkit-render-fix">'
+'<div class="page-container-responsive">'
+'<div class="row">'
+'<div class="col-lg-8 js-details-column">'
+'<div class="space-8 space-top-8"><h4 class="space-4 text-center-sm"></h4>'
+'<div class="row row-condensed">'
+'<div class="contact-host-div col-12">'
+'<div>'
+'<button class="btn-link btn-link--bold" type="button">'
+'<span>호스트에게 연락하기</span>'
+'</button>'
+'</div>'
+'</div>'
+'</div>'
+'<hr>'
+'<div class="row">'
+'<div class="col-md-3 text-muted">'
+'<div><span>숙소</span></div>'
+'</div>'
+'<div class="col-md-9">'
+'<div class="row">'
+'<div class="col-md-6">'
+'<div>'
+'<span>숙박 가능 인원:</span>'
+'<span></span><strong>3</strong>'
+'</div>'
+'<div>'
+'<span>욕실:</span>'
+'<span> </span><strong>1</strong>'
+'</div>'
+'<div>'
+'<span>침실:</span>'
+'<span> </span><strong>1</strong>'
+'</div>'
+'<div>'
+'<span>침대:</span>'
+'<span> </span><strong>1</strong>'
+'</div>'
+'</div>'
+'<div class="col-md-6">'
+'<div><span>체크인:</span>'
+'<span> </span><strong>15:00 이후</strong>'
+'</div>'
+'<div>'
+'<span>체크아웃:</span>'
+'<span> </span><strong>10:00</strong>'
+'</div>'
+'<div>'
+'<span>집 유형:</span>'
+'<span> </span><strong>아파트</strong>'
+'</div>'
+'<div>'
+'<span>숙소 유형 :</span>'
+'<span> </span><strong>집 전체</strong>'
+'</div>'
+'</div>'
+'</div>'
+'<div class="row">'
+'<div class="col-md-6">'
+'<strong><a href="#house-rules" class="react-house-rules-trigger" data-prevent-default="true"><span>숙소 이용규칙</span></a></strong>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'<hr>'
+'<div class="row amenities">'
+'<div class="col-md-3 text-muted">'
+'<div>'
+'<span>시설</span>'
+'</div>'
+'</div>'
+'<div class="col-md-9 expandable expanded">'
+''
+'<div class="expandable-content expandable-content-full">'
+'<div class="row">'
+'<div class="col-sm-6">'
+'<div>'
+'<div class="space-1">'
+'<span><i class="icon h3 icon-meal"></i><span>&nbsp;&nbsp;&nbsp;</span></span>'
+'<span id="amenity-long-tooltip-trigger-8"><strong>부엌</strong></span>'
+'</div>'
+'</div>'
+'<div>'
+'<div class="space-1 text-muted">'
+'<span id="amenity-long-tooltip-trigger-40"><del>필수품목</del></span>'
+'</div>'
+'</div>'
+'</div>'
+'<div class="col-sm-6">'
+'<div>'
+'<div class="space-1">'
+'<span><i class="icon h3 icon-tv"></i><span>&nbsp;&nbsp;&nbsp;</span></span>'
+'<span id="amenity-long-tooltip-trigger-1"><strong>TV</strong></span>'
+'</div>'
+'</div>'
+'<div>'
+'<div class="space-1 text-muted">'
+'<span id="amenity-long-tooltip-trigger-40"><del>필수품목</del></span>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'<hr>'
+'<div class="row">'
+'<div class="col-md-3 text-muted">'
+'<div>'
+'<span>가격</span>'
+'</div>'
+'</div>'
+'<div class="col-md-9">'
+'<div class="row">'
+'<div class="col-md-6">'
+'<div>'
+'<span>추가 인원 요금 :</span>'
+'<span> </span><strong>추가요금 없음</strong>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'<hr>'
+'<div class="row description" id="description">'
+'<div class="col-md-3 text-muted">'
+'<div>'
+'<span>설명</span>'
+'</div>'
+'</div>'
+'<div class="col-md-9">'
+'<div>'
+'<div class="react-expandable expanded">'
+'<div class="expandable-content expandable-content-long">'
+'<div>'
+'<p><span>Small 14 Unit condo on the Beach in N. Myrtle Beach.</span></p>'
+'<p><span>설명</span></p>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'<hr>'
+'<div class="row react-house-rules" id="house-rules">'
+'<div class="col-md-3">'
+'<div class="text-muted">'
+'<span>숙소 이용규칙</span>'
+'</div>'
+'</div>'
+'<div class="col-md-9">'
+'<div class="structured_house_rules">'
+'<div class="row col-sm-12">'
+'<span>체크인은 15:00 이후입니다.</span>'
+'</div>'
+'<div class="row">'
+'<div class="col-sm-2">'
+'<hr class="structured_house_rules__hr">'
+'</div>'
+'</div>'
+'</div>'
+'<div>'
+'<div class="react-expandable expanded">'
+'<div class="expandable-content">'
+'<div>'
+'<p><span>Winter rates: $70.00 per night</span></p>'
+'</div>'
+'<div class="expandable-indicator"></div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'<hr>'
+'<div class="row">'
+'<div class="col-md-3 text-muted">'
+'<div>'
+'<span>안전 기능</span>'
+'</div>'
+'</div>'
+'<div class="col-md-9">'
+'<div class="row">'
+'<div class="col-sm-6">'
+'<div>'
+'<div class="space-1">'
+'<span id="amenity-short-tooltip-trigger-35"><span>화재 감지기</span></span>'
+'</div>'
+'</div>'
+'</div>'
+'<div class="col-sm-6">'
+'<div>'
+'<div class="space-1">'
+'<span id="amenity-short-tooltip-trigger-39"><span>소화기</span></span>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'<hr>'
+'<div class="row">'
+'<div class="col-md-3 text-muted">'
+'<div>'
+'<span>예약 가능 여부</span>'
+'</div>'
+'</div>'
+'<div class="col-md-9">'
+'<div class="row">'
+'<div class="col-md-6">최소 숙박일 <strong>3일</strong>.</div>'
+'<div class="col-md-6">'
+'<a id="view-calendar" href="#"><strong><span>달력 보기</span></strong></a>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'<div></div>'
+'<div id="host-profile" class="room-section webkit-render-fix">'
+'<div class="page-container-responsive space-top-8 space-8">'
+'<div class="row">'
+'<div class="col-lg-8">'
+'<h4 class="space-2 text-center-sm"><span>호스트</span></h4>'
+'<hr class="space-4 space-top-2">'
+'<div class="row">'
+'<div class="col-md-3 text-center">'
+'<div class="media-photo-badge">'
+'<a href="#" class="media-photo media-round">'
+'<img alt="Donald" class="media-photo media-round" height="90" width="90" data-pin-nopin="true" src="/web/resources/img/booking/default.jpg" title="Donald"></a>'
+'</div>'
+'</div>'
+'<div class="col-md-9">'
+'<h3 class="space-1">Donald</h3>'
+'<div class="row row-condensed space-2">'
+'<div class="col-md-12 text-muted">'
+'<span>Freeport, 뉴욕, 미국</span>'
+'<span> · </span>'
+'<span>회원가입 : 2009년 11월</span>'
+'</div>'
+'</div>'
+'<div class="react-expandable expanded">'
+'<div class="expandable-content expandable-content-long">'
+'<div><p><span>자기소개</span></p></div>'
+'<div class="expandable-indicator"></div>'
+'</div>'
+'</div>'
+'<div>'
+'<span class="btn btn-primary btn-small"><span>호스트에게 연락하기</span></span>'
+'<div><noscript data-reactid=".1exo7crry0w.2.0.0.0.2.1.5.1.0"></noscript></div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'<div id="neighborhood" class="room-section">'
+'<div style="position:relative;" class="page-container-responsive">'
+'<div class="p3-location--map">'
+'<div class="panel location-panel"></div>'
+'<ul id="guidebook-recommendations" class="hide">'
+'<li class="user-image"><img alt="Donald" data-pin-nopin="true" height="90" src="web/resources/img/booking/default.jpg" title="Donald" width="90"></li>'
+'</ul>'
+'<div id="hover-card" class="panel">'
+'<div class="panel-body">'
+'<div class="text-center">숙소 위치</div>'
+'<div class="text-center">'
+'<span class="listing-location"><span>노스 머틀 비치,</span><span>사우스 캐롤라이나,</span><span>미국</span></span>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>';
var CANCEL_FORM = '<div id="cancel_form" class="formbox2">'
+'<h2>예약취소</h2>'
+'<p class="m_b_5">* <span class="red">예약정보</span>를 잘 확인하여 취소하시기 바랍니다.</p>'
+'<table class="table table-striped">'
 +'<caption><h4 style="text-align:center">예약정보</h4></caption>'
+'<thead>'
+'<tr>'
+'<th scope="col">예약신청일</th>'
+'<th scope="col">이용기간</th>'
+'<th scope="col">예약장소</th>'
+'<th scope="col">취소</th>'
+'</tr>'
+'</thead>'
+'<tbody>'
+'<tr>'
+'<td colspan="10"><center>신청하신 내역이 없습니다.</center></td>'
+'</tr>'
+'</tbody>'
+'</table>';
///////////////////////
var aaa = 
	+'<nav aria-label="Page navigation">'
	+'<ul class="pagination">'
	+'<c:if test="${startPg - pgSize gt 0}">'
	+'<li>'
	+'<a href="${context}/booking/list/${startPg-pgSize}" aria-label="Previous">'
	+'<span aria-hidden="true">&laquo;</span>'
	+'</a>'
	+'</li>'
	+'</c:if>'
	+'<c:forEach begin="${startPg}" end="${lastPg}" step="1" varStatus="i">'
	+'<c:choose>'
	+'<c:when test="${i.index == pgNum }">'
	+'<font color="red">${i.index}</font>'
	+'</c:when>'
	+'<c:otherwise>'
	+'<a href="${context}/booking/list/${i.index}">${i.index}</a>'
	+'</c:otherwise>'
	+'</c:choose>'
	+'</c:forEach>'
	+'<c:if test="${startPg + pgSize le totPg}">'
	+'<li>'
	+'<a href="${context}/booking/list/${startPg-pgSize}" aria-label="Next">'
	+'<span aria-hidden="true">&raquo;</span>'
	+'</a>'
	+'</li>'
	+'</c:if>' 
	+'</nav>'
	+'</div>'
	+'</div>';
///////////////////////	
var PAYING_FORM = '<main id="site-content" role="main" style="margin-top : 10%;">'
+'<div data-hypernova-key="p4flash_messagebundlejs"><span data-react-checksum="464588145"></span></div>'
+'<div id="main-view" class="main-view page-container-responsive space-top-md-6 space-md-6 space-top-lg-6 space-lg-6">'
+'<form action="/payments/create_booking_v2" method="post" id="checkout-form">'
+'<div class="row">'
+'<div class="col-sm-12 p4-error-header space-1">'
+'<div class="alert alert-with-icon alert-error alert-block hide space-lg-2 space-md-2" id="form-errors">'
+'<i class="icon alert-icon icon-alert-alt"></i>'
+'<div class="h5 space-1 error-header">'
+'거의 끝났습니다!'
+'</div>'
+'<ul></ul>'
+'</div>'
+'<div class="alert alert-with-icon alert-success alert-block hide space-lg-2 space-md-2" id="coupon-success">'
+'<i class="icon alert-icon icon-star-circled"></i>'
+'<div class="h5 space-1 error-header">'
+'프로모션 요금이 적용되었습니다.'
+'</div>'
+'전체 숙박 요금에 프로모션을 적용했습니다. 이제 즐거운 여행을 하는 일만 남았네요!'
+'</div>'
+'<div class="alert alert-with-icon alert-error alert-block hide space-lg-2 space-md-2" id="server-error">'
+'<i class="icon alert-icon icon-alert-alt"></i>'
+'오류가 발생하여 요청이 접수되지 않았습니다. 에어비앤비 웹사이트가 점검 중이었거나 연결이 자동으로 중지되었을 수 있습니다. 다시 시도해 주세요.'
+'</div>'
+'<div class="alert alert-with-icon alert-error alert-block hide space-lg-2 space-md-2" id="verification-error">'
+'<i class="icon alert-icon icon-alert-alt"></i>'
+'회원님의 카드를 인증할 수 없습니다. 다른 카드로 시도해 보세요. 회원님의 카드에는 금액이 청구되지 않았습니다.'
+'</div>'
+'<div class="alert alert-with-icon alert-error alert-block hide space-lg-2 space-md-2" id="house-rules-error">'
+'<i class="icon alert-icon icon-alert-alt"></i>'
+'<div class="h5 space-1 error-header">'
+'숙소 이용규칙과 약관'
+'</div>'
+'<p>'
+'예약를 하려면, 숙소 이용규칙과 약관에 동의하세요.'
+'</p>'
+'</div>'
+'</div>'
+'</div>'
+'<div class="row">'
+'<div class="col-md-5 col-md-push-7 space-lg-2 space-md-2 side-summary-container">'
+'<div data-hypernova-key="p4_sidebarbundlejs">'
+'<div class="summary-card col-center">'
+'<div class="background-cover summary-card__payments-listing-image" style="background-image:url();">'
+'</div>'
+'<div class="pull-right space-3 summary-card__host-profile-photo">'
+'<div class="media-photo media-round">'
+'<img class="summary-card__host-profile-photo-src" src="https://a2.muscache.com/im/pictures/531c686c-96ff-4d95-8806-bc3452a0e62b.jpg?aki_policy=profile_x_medium" alt="Chris">'
 +'</div>'
 +'</div>'
 +'<div class="panel">'
 +'<div class="panel-body">'
 +'<div class="text-muted space-2"><span>호스트: SangHo님</span>'
 +'</div>'
 +'<div class="sidebar-text-large">고급 스튜디오를 최저가에 @강남역 최고의 위치!!'
 +'</div>'
 +'<div class="hide-sm text-muted">'
 +'<ul class="list-layout summary-card__additional-details-list">'
 +'<li>집 전체</li>'
 +'<li><small><div class="star-rating-wrapper">'
 +'<div class="star-rating" content="4.5">'
 +'<div class="foreground">'
 +'<span><span><i class="icon-star icon icon-beach icon-star-big"></i><span> </span></span><span>'
 +'<i class="icon-star icon icon-beach icon-star-big"></i><span> </span></span><span><i class="icon-star icon icon-beach icon-star-big"></i><span> </span></span><span>'
 +'<i class="icon-star icon icon-beach icon-star-big"></i><span> </span></span><i class="icon-star-half icon icon-beach icon-star-big"></i></span>'
 +'</div>'
 +'<div class="background">'
 +'<span><span><i class="icon-star icon icon-light-gray icon-star-big"></i><span> </span></span><span><i class="icon-star icon icon-light-gray icon-star-big"></i>'
 +'<span> </span></span><span><i class="icon-star icon icon-light-gray icon-star-big"></i><span> </span></span><span><i class="icon-star icon icon-light-gray icon-star-big"></i>'
 +'<span> </span></span><span><i class="icon-star icon icon-light-gray icon-star-big"></i><span> </span></span></span>'
 +'</div>'
 +'</div>'
 +'<span> </span><span class="h6"><small><span>60</span></small></span>'
 +'</div>'
 +'</small>'
 +'</li>'
 +'<li class="hide-md"><span>후기 60개</span></li>'
 +'</ul>'
 +'<div>Gangnam-daero, Seocho-gu, 서울 137-072, 한국</div>'
 +'</div>'
 +'</div>'
 +'<div class="panel-body hide-sm">'
 +'<div class="row row-condensed">'
 +'<div class="col-sm-5">'
 +'<div class="text-muted space-bottom-2"><span>체크인</span>'
 +'</div><span>2016년 10월 13일</span>'
 +'</div>'
 +'<div class="col-sm-2 summary-card__check-in-icon">'
 +'<i class="icon icon-chevron-right icon-light-gray"></i>'
 +'</div>'
 +'<div class="col-sm-5">'
 +'<div class="text-muted space-bottom-2"><span>체크아웃</span>'
 +'</div><span>2016년 10월 14일</span>'
 +'</div>'
 +'</div>'
 +'</div>'
 +'<div class="panel-body hide-sm">'
 +'<table class="summary-card__billing-table">'
 +'<tbody>'
 +'<tr class="price-item">'
 +'<td><span>₩58036 x 1박</span><span>&nbsp;</span></td>'
 +'<td class="text-right price-item__price"><div><span>₩58036</span></div></td>'
 +'</tr>'
 +'</tbody>'
 +'</table>'
 +'</div>'
 +'<div class="panel-body hide-sm">'
 +'<span class="sidebar-text-large space-2 summary-card__total-price" tabindex="-1">'
 +'<table class="summary-card__billing-table">'
 +'<tbody>'
 +'<tr class="price-item">'
 +'<td><span>총합계</span><span>&nbsp;</span></td>'
 +'<td class="text-right price-item__price">'
 +'<div><span>₩78126</span><sup>KRW</sup></div>'
 +'</td>'
 +'</tr>'
 +'</tbody>'
 +'</table>'
 +'</span>'
 +'</div>'
 +'<div class="show-sm panel-body text-center"><a><span>요금 및 여행 요약 보기</span></a></div>'
 +'</div>'
 +'</div>'
 +'</div>'
+'<div class="pwp-summary-container"></div>'
+'</div>'
+'<div class="urgency-commitment-message col-md-7 col-md-pull-5 space-lg-4 space-md-4 space-sm-2">'
+'<div data-hypernova-key="p4_urgency_commitment_messagebundlejs">'
+'<div><span class="hide-sm">'
+'<div class="panel UrgencyCommitmentWrapper--expanded">'
+'<div class="panel-body">'
+'<div class="icon-background-container icon-rare-find-background">'
+'<div class="UrgencyCommitmentWrapper__text">'
+'<strong>흔치 않은 기회입니다.</strong>'
+'<div class="media space-top-1">Chris님의 숙소는 보통 예약이 가득 차있습니다.</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</span>'
+'<div class="show-sm"><a href="#" class="link-reset">'
+'<div class="panel UrgencyCommitmentWrapper--expanded">'
+'<div class="panel-body">'
+'<div class="icon-background-container icon-rare-find-background">'
+'<div class="UrgencyCommitmentWrapper__text">'
+'<strong>흔치 않은 기회입니다.</strong>'
+'<div class="media space-top-1">Chris님의 숙소는 보통 예약이 가득 차있습니다.</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div></a>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'<div id="content-container" class="summary-card-page-content col-md-7 col-md-pull-5">'
+'<div class="accordion-panel" data-panel-name="Payment">'
  +'<div id="payment-panel" class="accordion-panel__content accordion-panel-overflow text-lead accordion-panel--expanded">'
+'<div id="payment_selectors">'
+'<div>'
+'<div class="row space-4">'
+'<div class="col-sm-12"><span>호스트가 요청을 수락한 경우에만 비용이 청구됩니다. 호스트는 24시간 내로 요청을 수락 또는 거절해야 합니다.</span>'
+'</div>'
+'</div>'
+'<div>'
+'<div class="row space-4">'
+'<div class="col-6">'
+'<div>'
+'<label for="payment_country"><span>결제 국가</span></label>'
+'<div class="select select-block">'
+'<select name="payment_country">'
 +'<option selected="" value="KR">한국</option>'
+'</select>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'<div>'
+'<div class="row">'
+'<div class="col-sm-12">'
+'<label for="payment_type"><span>결제 방법</span></label>'
+'</div>'
+'</div>'
+'<div class="row space-4">'
+'<div class="col-md-6 col-sm-12">'
+'<div>'
+'<div class="select select-block">'
+'<select name="payment_type">'
+'<option selected="" value="0">신용카드</option>'
+'</select>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'<div>'
+'<div>'
+'<div>'
+'<div class="row space-4">'
+'<div class="col-12">'
+'<div class="page-container-full">'
+'<div class="row">'
+'<div class="responsive-component col-12 cc-number space-4">'
+'<label for="credit-card-number" data-i18n="cc_number" class="text-lead">카드 번호</label>'
+'<div class="right-addon first-message-right-addon">'
+'<a href="#" id="tooltip-cc-icon-lock" class="icon icon-lock icon-light-gray h3 link-reset"></a>'
+'<input type="text" id="card_number" maxlength="19" name="credit-card-number" placeholder="XXXX-XXXX-XXXX-XXXX" class="first-message-input invalid">'
+'</div>'
+'<div id="card_error" class="label label-warning inline-error text-lead" name="credit-card-number-error">'
+'</div>'
+'</div>'
+'</div>'
+'<div class="row">'
+'<div class="responsive-component col-6 cc-expiration">'
+'<label for="credit-card-month" class="text-lead">'
+'유효기간'
+'</label>'
+'<div class="row row-super-condensed">'
+'<div class="col-6">'
+'<div class="select select-block first-message-select-div">'
+'<select id="card_m" option="selected" name="credit-card-month" class="first-message-input">'
+'<option>MM</option>'
+'<option value="1">1</option>'
+'<option value="2">2</option>'
+'<option value="3">3</option>'
+'<option value="4">4</option>'
+'<option value="5">5</option>'
+'<option value="6">6</option>'
+'<option value="7">7</option>'
+'<option value="8">8</option>'
+'<option value="9">9</option>'
+'<option value="10">10</option>'
+'<option value="11">11</option>'
+'<option value="12">12</option>'
+'</select>'
+'</div>'
+'</div>'
+'<div class="col-6">'
+'<div class="select select-block first-message-select-div">'
+'<select name="credit-card-year" class="first-message-input">'
+'<option>YYYY</option>'
+'<option value="2016">2016</option>'
+'<option value="2017">2017</option>'
+'<option value="2018">2018</option>'
+'<option value="2019">2019</option>'
+'<option value="2020">2020</option>'
+'<option value="2021">2021</option>'
+'<option value="2022">2022</option>'
+'<option value="2023">2023</option>'
+'<option value="2024">2024</option>'
+'<option value="2025">2025</option>'
+'<option value="2026">2026</option>'
+'<option value="2027">2027</option>'
+'<option value="2028">2028</option>'
+'<option value="2029">2029</option>'
+'<option value="2030">2030</option>'
+'<option value="2031">2031</option>'
+'<option value="2032">2032</option>'
+'<option value="2033">2033</option>'
+'<option value="2034">2034</option>'
+'<option value="2035">2035</option>'
+'</select>'
+'</div>'
+'</div>'
+'</div>'
+'<div class="label label-warning inline-error hide text-lead" name="credit-card-exp-date-past-error">'
+'</div>'
+'<div class="label label-warning inline-error hide text-lead" name="credit-card-exp-date-error">'
+'</div>'
+'</div>'
+'<div class="responsive-component col-6 cc-security-code">'
+'<label id="cvv-label" for="credit-card-cvv" class="text-lead">'
+'보안 코드'
+'</label>'
+'<div class="right-addon first-message-right-addon">'
+'<input type="text" name="credit-card-cvv" class="first-message-input">'
+'</div>'
+'<div class="label label-warning inline-error hide text-lead" name="credit-card-cvv-error">'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'<div class="row space-4">'
+'<div class="col-6">'
+'<div>'
+'<label for="credit_card[first_name]"><span>이름</span></label>'
+'<input name="credit_card[first_name]" type="text">'
+'</div>'
+'</div>'
+'<div class="col-6">'
+'<div>'
+'<label for="credit_card[last_name]"><span>성</span></label>'
+'<input name="credit_card[last_name]" type="text">'
+'</div>'
+'</div>'
+'</div>'
+'<div class="row space-4">'
+'<div class="col-4">'
+'<div>'
+'<label for="credit_card[zip]"><span>우편번호</span></label>'
+'<input name="credit_card[zip]" type="text">'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'<div class="accordion-style-checkout__section">'
+'<div>'
+'<div>'
+'<div class="text-lead">'
+'<div class="media-body text-rausch">에어비앤비는 게스트가 호스트와 협의하여 직접 계약을 체결할 수 있도록 해주는 플랫폼을 제공합니다. 숙박은 호스트가 게스트에게 제공하며, 에어비앤비는 호스트의 행위나 숙박을 감독하지 않습니다. 에어비앤비는 게스트와 호스트 사이에 체결되는 어떠한 계약의 당사자도 아니므로, 이에 관한 어떠한 책임도 지지 않습니다.</div>'
+'<div class="terms media">'
 +'<div class="media-body terms-media-body">'
 +'<label name="form" for="agrees-to-terms" class="va-container">'
  +'<div class="va-top accordion-checkbox">'
  +'<input type="checkbox" id="bt_agrees" name="agree" value="1" disabled="disabled">'
  +'</div>'
  +'<div class="va-top" id="agrees-to-terms-text">'
  +'<div><a href="#" class="house-rules-link" id="house-rules-modal-trigger">숙소 이용규칙</a>, <a href="/home/cancellation_policies#strict" class="cancel-policy-link" target="_blank">환불정책</a>, <a href="/terms/guest_refund_policy" class="refund_policy_link" target="_blank">게스트 환불 정책</a>에 동의합니다. 서비스 수수료를 포함하여 표시된 총액을 지불하는 것에도 동의합니다.</div>'
  +'</div>'
 +'</label>'
 +'</div>'
+'</div>'
+'</div>'
+'<div class="space-top-3">'
+'<div id="payment-form-submit-wrapper">'
+'<button id="paying_complete" class="btn btn-large btn-primary">요청 보내기'
+'</div>'
+'</div>'
 +'<div id="house-rules-modal" class="modal" role="dialog" aria-hidden="true" data-trigger="#house-rules-modal-trigger">'
 +'<div class="modal-table">'
 +'<div class="modal-cell">'
 +'<div class="modal-content">'
 +'<div class="panel-header house-rules-modal-label"><span>Chris님의 숙소 이용규칙</span><a href="#" class="panel-close" data-behavior="modal-close">×</a></div>'
 +'<div class="panel-body house-rules-modal-body">'
 +'<div class="expandable_house_rules">'
 +'<div class="structured_house_rules">'
 +'<div class="row col-sm-12"><span>흡연 금지</span></div>'
 +'<div class="row col-sm-12 space-top-1"><span>반려동물 동반에 적합하지 않음</span></div>'
 +'<div class="row col-sm-12 space-top-1"><span>파티나 이벤트 금지</span></div>'
 +'<div class="row col-sm-12 space-top-1"><span>체크인은 22:00 이후입니다.</span></div>'
 +'<div class="row">'
 +'<div class="col-sm-2"><hr class="structured_house_rules__hr"></div>'
 +'</div>'
 +'</div>'
 +'</div>'
 +'</div>'
 +'</div>'
 +'</div>'
 +'</div>'
 +'</div>'
 +'</div>'
+'</div>'
+'<div class="show-sm space-top-2">'
+'<div class="accordion-style-checkout__section">'
+'<div>'
+'<div>'
+'<div class="sidebar-text-large">'
+'<div><span>합계</span><span>&nbsp;</span><span>₩78126</span></div>'
+'</div><a href="#"><span>요금 및 여행 요약 보기</span></a></div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'<div class="modal" id="security-deposit-modal" role="dialog">'
+'<div class="modal-table">'
+'<div class="modal-cell">'
+'<div class="modal-content">'
+'<div class="panel-header">'
+'<a href="#" class="panel-close" data-behavior="modal-close">'
+'×'
+'<span class="screen-reader-only">'
+'보증금'
+'</span>'
+'</a>'
+'보증금'
+'</div>'
+'<div class="panel-body">'
+'<p>'
+'보증금은 체크인 하루 전에 회원님의 신용카드로 청구됩니다. 호스트가 문제를 제기하지 않는 경우, 체크아웃 48시간 후 청구 금액 전액이 취소됩니다.'
+'</p>'
+'<p>'
+'호스트가 문제를 제기할 경우에는, 에어비앤비에서 보증금의 지급을 유보하고 호스트와 게스트 양 당사자들로부터 추가 정보를 수집할 것입니다. 만약 호스트와 게스트 간에 합의가 이루어 지는 경우, 에어비앤비에서 해당 금액을 돌려드립니다. 주로 호스트가 피해 정도를 결정하지만, 에어비앤비는 모든 청구건들을 추적하여, 호스트가 보증금을 차지하기 위해 과도하게 청구를 하는 경향이 있다고 판단되면 이 호스트를 퇴출시킵니다.'
+'</p>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</div>'
+'</main>';