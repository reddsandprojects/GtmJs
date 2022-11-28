<script src="https://polyfill.io/v3/polyfill.min.js?features=Array.from,Promise,Symbol,Object.setPrototypeOf,Object.getOwnPropertySymbols,Set,Math.trunc,BigInt,Map,Reflect,WeakMap,WeakRef,WeakSet,BigInt,Map,Reflect,WeakMap,WeakRef,WeakSet"></script>
<script src="https://cdn.jsdelivr.net/npm/superagent"></script>
<!-- if you wish to use unpkg.com instead: -->
<!-- <script src="https://unpkg.com/superagent"></script> -->
<style>
.ecommodal {
  display: none; 
  position: fixed; 
  z-index: 1; 
  padding-top: 100px; 
  left: 0;
  top: 0;
  width: 100%; 
  height: 100%; 
  overflow: auto; 
  background-color: rgb(0,0,0); 
  background-color: rgba(0,0,0,0.4); 
}
.ecommodal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  width: 80%;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s
}
@-webkit-keyframes animatetop {
  from {top:-300px; opacity:0} 
  to {top:0; opacity:1}
}
@keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}
.ecomclose {
  color: white;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
.ecomclose:hover,
.ecomclose:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
.ecommodal-header {
  padding: 2px 16px;
  background-color: grey;
  color: white;
}
.ecommodal-body {padding: 2px 16px;}

</style>

<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="-1" />

<div id="ecommyModal" class="ecommodal">
  <div class="ecommodal-content">
    <div class="ecommodal-header">
      <span class="ecomclose" onclick="ecomCloseAlert();">&times;</span>
      <h4 style="color:white" id="ecomAlertHeader"></h4>
    </div>
    <div id="ecomAlertText" class="ecommodal-body"></div>
  </div>
</div>

<script>
var ecom_UserId = null;
var ecom_loDetails = null;
//var ecom_MiddleWareApiUrl = 'https://svgq3ogkhk.execute-api.eu-west-1.amazonaws.com/prod'; //Schneider Prod URL
var ecom_MiddleWareApiUrl = 'https://pgj5zsfo24.execute-api.eu-west-1.amazonaws.com/prod';//Schneider dev env
var ecom_origin = window.location.origin.toString();

var ecom_ExUrl = "https://exst-ui-uat.schneider-electric.com/api/navigation-service/auth?authorized=true&target=https%3A%2F%2Fexst-ui-uat.schneider-electric.com%2Fshop%2Fproducts-services%2Forder%2F";
var ecom_ExRedirectUrl = "?redirectBack=https://schneider-electric3-pilot.csod.com/ui/lms-learner-home/home?tab_page_id=-200300006";
var ecom_eventObjectId = null;
var curMutation = null;
var ecom_config = { attributes: true, childList: true, characterData: true, subtree: true};
var ecom_container = document.body;
var ecom_TrainingAction = null;
var ecom_RequestSession = null;
var ecom_TrainingDetails = null;
var ecomError = null;
var ecom_RegisterAddItemToNewCart = null;
var ecom_Counter = 0;
var ecom_ReqCounter = 0;
var ecom_iniCounter = 0;
var ecom_RequestStr = ["request", "ask", "demander", "fragen", "anfrage", "anfordern", "solicitud", "solicitar", "запрос", "申込", "申请", "richiedi", "zapisz się",
"aanvragen", "الطلب", "בקש הדרכה", "신청", "požadavek", "anmod", "mohon", "հարցում", "zatraži", "pyyntö", "αίτημα έναρξης", "jelentkezés",
"permintaan", "solicitare", "begäran", "ร้องขอ", "talep", "запит", "yêu cầu"];




function ecomShowAlert(header, text){
	try{
		var modal = document.getElementById("ecommyModal");
		document.getElementById("ecomAlertHeader").innerHTML = header;
		document.getElementById("ecomAlertText").innerHTML = "<p> </p><p>" + text + "</p><p> </p>";
		modal.style.display = "block";
	}catch(e){
		console.log(e);
	}
}

function ecomCloseAlert(){
	try{
		var modal = document.getElementById("ecommyModal");
		modal.style.display = "none";
	}catch(e){
		console.log(e);
	}
}

function ecomShowLoading(){
	try{
		var span = document.createElement("span");
		span.setAttribute("aria-hidden", "true");
		span.setAttribute("data-testid", "$rcl-preloader__spinner");
		span.setAttribute("class", "sc-gJWqzi iTDCOR");
		span.setAttribute("style", "width: 64px; height: 64px;");

		var div = document.createElement("div");
		div.appendChild(span);

		var div1 = document.createElement("div");
		div1.setAttribute("class", "sc-CtfFt fzpRPc");
		div1.appendChild(div);

		var div2 = document.createElement("div");
		div2.appendChild(div1);
		div2.setAttribute("data-testid", "$rcl-preloader__scrim");
		div2.setAttribute("class", "sc-bMvGRv inCzUN");

		document.querySelectorAll("[role='status']")[0].appendChild(div2);
	}catch(e){
		console.log(e);
	}
}

function ecomHideLoading(){	
	try{
		document.querySelectorAll("[role='status']")[0].innerHTML = "";
	}catch(e){
		console.log(e);
	}
}

function ecomGetMonthNumber(month){
	try{
		return "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3
	}catch(e){
		console.log(e);
	}
}

function ecomHandOverToCsod(loid){
	try{
		document.querySelectorAll("[loid='"+ loid +"']")[0].removeAttribute("onclick");
		document.querySelectorAll("[loid='"+ loid +"']")[0].click();
		if(document.querySelectorAll("[data-test='LD_Upcoming_Session_Row_Secondary_Action']").length > 0){
			document.querySelectorAll("[data-test='LD_Upcoming_Session_Row_Secondary_Action']")[0].click();
		}
		document.querySelectorAll("[loid='"+ loid +"']")[0].setAttribute("onclick","ecomSetMenuItem('" + loid + "');");
		ecomHideLoading();
	}catch(e){
		ecomHideLoading();
		console.log(e);
	}
}

function ecomRequestSession(loid, cartId){
	try{
	  superagent
				.post(ecom_origin + '/Services/api/LMS/Training/' + loid + '/Actions/2/User/' + ecom_UserId)
		.send({"actionId":2,"trainingId":loid,"viewSource":2})
				.set('accept', 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1')
	  .set('authorization', 'Bearer ' + csod.context.token)
				.end(function (err, res) {
					if (!err && res) {
						ecom_RequestSession = res.body;
						if(ecom_RequestSession.data[0].succeeded.toString().toLowerCase() == "true"){
							var url = ecom_ExUrl + cartId;// + ecom_ExRedirectUrl;
							console.log(url);
							window.location.href = url;
						}else{
							ecomHandOverToCsod(loid);
						}
					} else {
						ecomHideLoading();
						ecomError = err;
						var text = "Error Occured";
						if(err.rawResponse){
							text = err.rawResponse;
						}else if(err.response){
							text = "Error: " + err.response.statusCode + " - " + err.response.text;
						}else{
							text = err.status;
						}
						console.log("Error: " + text);
						ecomShowAlert("Error", text);
					}
				});
	}catch(e){
		console.log(e);
	}
}
  
function ecomGetChildSession(uiDate, uiLocation){
	try{
		for(var i=0;i<ecom_TrainingDetails.data[0].sessions.length;i++){
			try{
				var dataDate = new Date(ecom_TrainingDetails.data[0].sessions[i].startDate.toString());
				if(((uiDate - dataDate) === 0) && uiLocation.trim() == ecom_TrainingDetails.data[0].sessions[i].locationString.toString()){
					return ecom_TrainingDetails.data[0].sessions[i];
				}
			}catch(e){
				console.log(e);
				ecomShowAlert("Error", e);
			}
		}
		return null;
	}catch(e){
		console.log(e);
	}
}

function ecomValidate(){
	if(ecom_loDetails.SkuId == "null" || ecom_loDetails.SkuId == ""){
		console.log("No Sku Id present for this ILT Event");
		ecomShowAlert("Lo Data Missing", "No SkuId present for this ILT Event");
		return false;
	}
	if(ecom_loDetails.OfferCode == "null" || ecom_loDetails.OfferCode == ""){
		console.log("No Offer Code present for this ILT Event");
		ecomShowAlert("Lo Data Missing", "No Offer Code present for this ILT Event");
		return true;
	}
	if(ecom_loDetails.ApplicationProductID == "null" || ecom_loDetails.ApplicationProductID == ""){
		console.log("No Application Product ID present for this Online Course");
		ecomShowAlert("Lo Data Missing", "No Application Product ID present for this ILT Event");
		return true;
	}
	return false;
}

function ecomRegisterAddItemToNewCart(LOID){
	try{
		if(ecomValidate()){
			return false;
		}
 
		var button = document.querySelectorAll("[loid='"+ LOID+ "']")[0];
		var eventName = document.getElementById("clamped-content-LD_Call_To_Action_Title").innerText;
		var eventLocation = button.getAttribute("location");
		var dateTime = button.getAttribute("eventDate");
		ecomShowLoading();
		superagent
			.get(ecom_MiddleWareApiUrl + '/registeradditemtonewcart')
			.query("UserId=" + ecom_UserId)
			.query("EventId=" + ecom_eventObjectId)
			.query("LOID=" + LOID)
			.query("Event=" + eventName)
			.query("Loc=" + eventLocation)
			.query("Date=" + dateTime)
			.set('X-API-Key', 'xxxxxxxxxxxxxxxxxxxxxxxxx')
			.set('accept', 'json')
			.end(function (err, res) {
				if (!err && res) {
					ecom_RegisterAddItemToNewCart = res;
					if(res.statusCode == 200){
						ecom_RegisterAddItemToNewCart = res.body;
						ecomRequestSession(LOID, ecom_RegisterAddItemToNewCart.CartId);
					}else if(res.statusCode == 406){
						ecomHideLoading();
						console.log("NoContent for user: " + ecom_UserId + " and loid:" + ecom_eventObjectId);
						console.log(res);					
						ecomShowAlert("LO Data Missing", res.body);					
					}else{
						ecomHideLoading();
						ecomShowAlert("Error: ", res);
						console.log("Error: " + res);
					}
				} else {
					ecomError = err;
					if(ecomError.status == 406){
						ecomHideLoading();
						console.log("NoContent for user: " + ecom_UserId + " and loid:" + ecom_eventObjectId);
						console.log(ecomError);					
						ecomShowAlert("LO Data Missing", ecomError.message);	
					}else{
						ecomHideLoading();
						var text = "Error Occured";
						if(err.rawResponse){
							text = err.rawResponse;
						}else if(ecomError.response){
							text = "Error: " + ecomError.response.statusCode + " - " + ecomError.response.text;
						}else{
							text = ecomError.status;
						}
						console.log("Error: " + text);
						ecomShowAlert("Error", text);
					}
				}
			});
	}catch(e){
		ecomHideLoading();
		console.log(e);
	}
}

function ecomSetMenuItem(loid){
	try{
		var liElem = null;
		var liElems = document.querySelectorAll("[data-test='LD_Upcoming_Session_Row_Secondary_Action']");
		if(liElems.length > 0){
			for(var i = 0; i < liElems.length; i++){
				var requestStr = liElems[i].innerText.trim().toLowerCase().trim();
				if(ecom_RequestStr.includes(requestStr) && liElems[i].style.display != "none"){
					liElem = liElems[i];
					break;
				}
			}
			ecom_Counter = 0;
			if(liElem){
				liElem.style.display = "none";
				var menuElement = liElem.parentElement;					
				var newLi = document.createElement("li");
				newLi.setAttribute("id", "myLi");
				newLi.innerText = "Buy";
				for(var x=0; x<=liElem.classList.length;x++){
					newLi.classList.add(liElem.classList[x]);
				}
				newLi.setAttribute("onclick","ecomRegisterAddItemToNewCart('" + loid + "');");
				menuElement.insertBefore(newLi, liElem);
			}
		}else{
			if (ecom_Counter <= 50) {
				ecom_Counter++;
				setTimeout(function () { ecomSetMenuItem(loid); }, 200);
			}
		}		
	}catch(e){
		console.log(e);
	}
}

function ecomRemoveRequestButton(){
	try{
		var flyOutDiv = document.getElementById("sessionFlyout");
		if(flyOutDiv.querySelectorAll("[data-test='LD_Flyout_Footer_Duplexed_Btn']")[0]){
			var requestStr = flyOutDiv.querySelectorAll("[data-test='LD_Flyout_Footer_Duplexed_Btn']")[0].innerText.toString().toLowerCase().trim();
			if(ecom_RequestStr.includes(requestStr)){
				flyOutDiv.querySelectorAll("[data-test='LD_Flyout_Footer_Duplexed_Btn']")[0].style.display = "none";
			}
			var priceText = "€" + (ecom_loDetails.EuroCost.trim() == "" ? "0.00" : ecom_loDetails.EuroCost) + "/$" + (ecom_loDetails.DollarCost.trim() == "" ? "0.00" : ecom_loDetails.DollarCost);
			if(flyOutDiv.querySelectorAll("[data-test='LD_Session_Flyout_Price']") && flyOutDiv.querySelectorAll("[data-test='LD_Session_Flyout_Price']")[0] && flyOutDiv.querySelectorAll("[data-test='LD_Session_Flyout_Price']")[0].children[0]){
				flyOutDiv.querySelectorAll("[data-test='LD_Session_Flyout_Price']")[0].children[0].innerHTML = priceText;
			}else{
				var span = document.createElement("span");
				span.innerText = priceText;
				var para = document.createElement("p");
				para.setAttribute("color", "grey70");
				para.setAttribute("font-style", "normal");
				para.setAttribute("font-weight", "normal");
				para.setAttribute("data-test", "LD_Session_Flyout_Price");
				para.setAttribute("class", "sc-fhYwyz zfGNq sc-eMigcr sc-fOICqy jIdisl sc-dznXNo jebwSr");
				para.appendChild(span);
				if(flyOutDiv.querySelectorAll("[data-test='LD_Flyout_Footer_Duplexed_Btn']")[0]){
					var elem = flyOutDiv.querySelectorAll("[data-test='LD_Flyout_Footer_Duplexed_Btn']")[0];
					elem.parentElement.insertBefore(para, elem);
				}
			}
		}else{
			if (ecom_Counter <= 50) {
				ecom_ReqCounter++;
				setTimeout(function () { ecomRemoveRequestButton(); }, 200);
			}
		}
	}catch(e){
		console.log(e);
	}
}

function ecomAddButtons(){
	try{
		var priceText = "€" + (ecom_loDetails.EuroCost.trim() == "" ? "0.00" : ecom_loDetails.EuroCost) + "/$" + (ecom_loDetails.DollarCost.trim() == "" ? "0.00" : ecom_loDetails.DollarCost);
		var sessionArea = document.getElementById("upcoming-session-section-id");
		if(sessionArea && sessionArea.children[2] && sessionArea.children[2].children[0] && sessionArea.children[2].children[0].children){
			sessionArea = sessionArea.children[2].children[0].children;
			if(document.querySelectorAll("[data-test='LD_Call_To_Action_price']")[0]){
				var span = document.querySelectorAll("[data-test='LD_Call_To_Action_price']")[0].children[0];
				span.innerText = priceText;
			}else{
				var span = document.createElement("span");
				span.innerText = priceText;
				var para = document.createElement("p");
				para.setAttribute("color", "grey60");
				para.setAttribute("font-style", "normal");
				para.setAttribute("font-weight", "normal");
				para.setAttribute("data-test", "LD_Call_To_Action_price");
				para.setAttribute("class", "sc-fhYwyz kxCJRZ sc-eMigcr sc-fOICqy jIdisl sc-hdPSEv cdwQcV");
				para.appendChild(span);
				var buttonEle = document.querySelectorAll("[data-test='LD_Call_To_Action_Duplexed_Btn']")[0];
				buttonEle.parentElement.insertBefore(para, buttonEle);
			}
			
			for(var i = 0; i < sessionArea.length; i++){
				try{
					if(sessionArea[i].children[1] && sessionArea[i].children[1].children[0] && sessionArea[i].children[1].children[0].children[1] && sessionArea[i].children[1].children[0].children[1].children[0]){
						var eventDate = sessionArea[i].children[1].children[0].children[1].children[0].innerText.trim();
						//var strDates = eventDate.trim().split('-');
						//var uiDate = new Date(strDates[0].trim());
						var uiLocation = sessionArea[i].children[1].children[0].children[2].innerText;
						var session = ecom_TrainingDetails.data[0].sessions[i]; //ecomGetChildSession(uiDate, uiLocation);
						
						if(session != null){
							var loid = session.loId.toString();
							var buttonsArea = sessionArea[i].children[1].children[1];

							if(sessionArea[i].children[1].children[1].children[0].querySelectorAll("[data-test='LD_Upcoming_Session_Row_Price']")[0]){
								var span = sessionArea[i].children[1].children[1].children[0].querySelectorAll("[data-test='LD_Upcoming_Session_Row_Price']")[0].children[0];
								span.innerText = priceText;
							}else{
								var span = document.createElement("span");
								span.innerText = priceText;
								var para = document.createElement("p");
								para.setAttribute("color", "grey60");
								para.setAttribute("font-style", "normal");
								para.setAttribute("font-weight", "normal");
								para.setAttribute("data-test", "LD_Upcoming_Session_Row_Price");
								para.setAttribute("class", "sc-fhYwyz bzQLsB sc-eMigcr sc-fOICqy jIdisl sc-fgfRvd cRmCQP");
								para.appendChild(span);
								sessionArea[i].children[1].children[1].insertBefore(para, sessionArea[i].children[1].children[1].children[0]);
							}
							if(buttonsArea.querySelectorAll("[data-testid='rcl$duplexedButton__primaryButton']")[0]){
								buttonsArea.querySelectorAll("[data-testid='rcl$duplexedButton__primaryButton']")[0].setAttribute("onclick","ecomRemoveRequestButton();");
							}
							if(buttonsArea.getElementsByTagName("svg")[0].parentElement){
								buttonsArea.getElementsByTagName("svg")[0].parentElement.setAttribute("loid", loid);
								buttonsArea.getElementsByTagName("svg")[0].parentElement.setAttribute("eventDate", eventDate);
								buttonsArea.getElementsByTagName("svg")[0].parentElement.setAttribute("location", uiLocation);
								buttonsArea.getElementsByTagName("svg")[0].parentElement.setAttribute("onclick","ecomSetMenuItem('" + loid + "');");
							}
						}
					}
				}catch(e){
					console.log(e);
				}
			}
		}
		ecomHideLoading();
	}catch(e){
		console.log(e);
		ecomHideLoading();
	}
}

function ecomTrainingDetails(){
	try{
		superagent
				.get(ecom_origin + '/services/api/lms/training/' + ecom_eventObjectId + '/details')
				.set('accept', 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1')
				.set('authorization', 'Bearer ' + csod.context.token)
				.end(function (err, res) {
					if (!err && res) {
						ecom_TrainingDetails = res.body;
						ecomAddButtons();
					}else{
						ecomError = err;
						var text = "Error Occured";
						if(err.rawResponse){
							text = err.rawResponse;
						}else if(err.response){
							text = "Error: " + err.response.statusCode + " - " + err.response.text;
						}else{
							text = err.status;
						}
						console.log("Error: " + text);
						ecomShowAlert("Error", text);
					}
				});
		return false;
	}catch(e){
		console.log(e);
		ecomHideLoading();
	}
}

function ecomHideRequest(target){
	try{
		var liElems = target.getElementsByTagName("li");
		for (var i = 0; i < liElems.length; i++) {
			var requestStr = liElems[i].innerText.toLowerCase().trim();
			if(ecom_RequestStr.includes(requestStr)){
				liElems[i].style.display = "none";
			}
		}
	}catch(e){
		console.log(e);
	}
}
  
var ecom_domobserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		var requestStr = mutation.target.innerText.toLowerCase().trim();
		if(ecom_RequestStr.includes(requestStr)){
			curMutation = mutation;
            ecomHideRequest(mutation.target);
		}
    });
});

function eCom_Initialize() {
	try{
		if (document.getElementById("upcoming-session-section-id")) {
			ecomShowLoading();
			var replaceQueryStr = window.location.search.toString();
			ecom_eventObjectId = window.location.href.toString();
			if(replaceQueryStr.trim() != ""){
				ecom_eventObjectId = ecom_eventObjectId.replace(replaceQueryStr, "");
			}
			ecom_eventObjectId = ecom_eventObjectId.substring(ecom_eventObjectId.lastIndexOf('/') + 1);
			ecom_UserId = localStorage.getItem("loggedInUser");
			if(ecom_UserId == null){
				ecom_UserId = csod.context.user;
			}
			(function() {
				superagent
				.get(ecom_MiddleWareApiUrl + '/getlodetails')				
				.query("loId=" + ecom_eventObjectId)
				.query("UserId=" + ecom_UserId)
				.query("r=" + Math.random())
				.set('X-API-Key', 'xxxxxxxxxxxxxxxxxxxxxxxxx')
				.set('accept', 'json')				
				.end(function (err, res) {
					if (!err && res) {
						ecom_loDetails = res;
						if(res.statusCode == 200){
							ecom_loDetails = res.body;
							if(ecom_loDetails == null || ecom_loDetails == "null"){
								ecomHideLoading();
							}
							else if(ecom_loDetails.IsECommerce && ecom_loDetails.IsECommerce.toLowerCase() == "yes"){
								ecom_domobserver.observe(ecom_container, ecom_config);
								ecomTrainingDetails();
								if(replaceQueryStr.trim() != ""){
									ecomRemoveRequestButton();
								}
							}else{
								ecomHideLoading();
							}
						}else if(res.statusCode == 406){
							ecomShowAlert("Error", "NoContent for user: " + ecom_UserId + " and loid:" + ecom_eventObjectId);
							console.log("NoContent for user: " + ecom_UserId + " and loid:" + ecom_eventObjectId);
							ecomHideLoading();
						}else{
							ecomShowAlert("Error: ", res);
							console.log("Error: " + res);
							ecomHideLoading();
						}
					} else {
						ecomError = err;
						if(ecomError.status == 406){
							console.log("NoContent for user: " + ecom_UserId + " and loid:" + ecom_eventObjectId);
							console.log("Error: " + ecomError.message);
							ecomShowAlert("Error", "NoContent for user: " + ecom_UserId + " and loid:" + ecom_eventObjectId);
						}else{
							ecomHideLoading();
							console.log("Error: " + ecomError.rawResponse);
							ecomShowAlert("Error", ecomError.rawResponse);
						}
					}
				});
			})();
			
		} else {
			if (ecom_iniCounter <= 20) {
					ecom_iniCounter++;
					setTimeout(function () { eCom_Initialize(); }, 1000);
				}
		}
	}catch(e){
		ecomHideLoading();
		console.log(e);
	}
}

if(performance.navigation.type == 2){
	window.location.reload(true);
}

eCom_Initialize();
</script>