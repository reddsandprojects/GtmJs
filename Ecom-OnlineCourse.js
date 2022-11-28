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
var ecom_UserId;
var ecom_loDetails;
//var ecom_MiddleWareApiUrl = 'https://svgq3ogkhk.execute-api.eu-west-1.amazonaws.com/prod'; //Schneider Prod URL
var ecom_MiddleWareApiUrl = 'https://pgj5zsfo24.execute-api.eu-west-1.amazonaws.com/prod';//Schneider dev env
var ecom_origin = window.location.origin.toString();

var ecom_ExUrl = "https://exst-ui-uat.schneider-electric.com/api/navigation-service/auth?authorized=true&target=https%3A%2F%2Fexst-ui-uat.schneider-electric.com%2Fshop%2Fproducts-services%2Forder%2F";
var ecom_ExRedirectUrl = "?redirectBack=https://schneider-electric3-pilot.csod.com/ui/lms-learner-home/home?tab_page_id=-200300006";
var ecom_eventObjectId;
var ecom_iniCounter = 0;
var resp, error;
var ecom_RequestSession;
var ecom_TrainingDetails;
var ecomError;
var ecom_RegisterAddItemToNewCart;

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

function ecomHandOverToCsod(loid){
	try{
		var div = document.querySelectorAll("[data-test='LD_Call_To_Action_Duplexed_Btn']")[0];
		var sysbutton = div.getElementsByTagName("button")[0];
		sysbutton.click();
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
		ecomHideLoading();
		console.log(e);		
	}
}

function ecomGetChildSession(uiDate, uiLocation){
	try{
		for(var i=0;i<ecom_TrainingDetails.data[0].sessions.length;i++){
			try{
			var dataDate = new Date(ecom_TrainingDetails.data[0].sessions[i].startDate.toString())
			if(uiDate.getFullYear() == dataDate.getFullYear() && 
			uiDate.getMonth() == dataDate.getMonth() && 
			uiDate.getDate() == dataDate.getDate() &&
			uiDate.getHours() == (dataDate.getHours()  % 12 || 12) &&
			uiDate.getMinutes() == dataDate.getMinutes() && 
			uiLocation.trim() == ecom_TrainingDetails.data[0].sessions[i].locationString.toString())
			{
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
		console.log("No Sku Id present for this Online Course");
		ecomShowAlert("Lo Data Missing", "No SkuId present for this Online Course");
		return true;
	}
	if(ecom_loDetails.OfferCode == "null" || ecom_loDetails.OfferCode == ""){
		console.log("No Offer Code present for this Online Course");
		ecomShowAlert("Lo Data Missing", "No Offer Code present for this Online Course");
		return true;
	}
	if(ecom_loDetails.ApplicationProductID == "null" || ecom_loDetails.ApplicationProductID == ""){
		console.log("No Application Product ID present for this Online Course");
		ecomShowAlert("Lo Data Missing", "No Application Product ID present for this Online Course");
		return true;
	}
	return false;
}

function ecomRegisterAddItemToNewCart(LOID){
	try{
		if(ecomValidate()){
			return false;
		}
		
		var eventName = document.getElementById("clamped-content-LD_Call_To_Action_Title").innerText;
		ecomShowLoading();
		superagent
			.get(ecom_MiddleWareApiUrl + '/registeraddonlinecourseitemtonewcart')
			.query("UserId=" + ecom_UserId)
			.query("EventId=" + ecom_eventObjectId)
			.query("Event=" + eventName)
			.set('X-API-Key', 'xxxxxxxxxxxxxxxxxxxxxxxxx')
			.set('accept', 'json')
			.end(function (err, res) {
				if (!err && res) {
					ecom_RegisterAddItemToNewCart = res;
					if(res.statusCode == 200){
						ecom_RegisterAddItemToNewCart = res.body;
						ecomRequestSession(LOID, ecom_RegisterAddItemToNewCart.CartId);
					}else if(res.statusCode == 406){
						console.log("NoContent for user: " + ecom_UserId + " and loid:" + ecom_eventObjectId);
						console.log(res);					
						ecomShowAlert("LO Data Missing", res.body);	
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
						console.log(ecomError);					
						ecomShowAlert("LO Data Missing", ecomError.message);	
						ecomHideLoading();						
					}else{
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
						ecomHideLoading();
					}
				}
			});
	}catch(e){
		console.log(e);
		ecomHideLoading();
	}
}

function ecomChangeRequestToBuy(loid, ecom_loDetails){
	try{
		var div = document.querySelectorAll("[data-test='LD_Call_To_Action_Duplexed_Btn']")[0];
		var sysbutton = div.getElementsByTagName("button")[0];
		if(sysbutton.innerText.trim().toLowerCase() == "request" || sysbutton.innerText.trim().toLowerCase() == "request again"){
			sysbutton.style.display = "none";
			var priceP = document.createElement("p");
			priceP.style.fontWeight = "normal";
			priceP.setAttribute("color", "grey60");
			priceP.setAttribute("font-style", "normal");
			priceP.setAttribute("class", "sc-fhYwyz kxCJRZ sc-eMigcr sc-fOICqy jIdisl sc-hdPSEv cdwQcV");
			var span = document.createElement("span");
			span.innerText = "€" + ecom_loDetails.EuroCost + "/$" + ecom_loDetails.DollarCost;
			priceP.appendChild(span);
			div.appendChild(priceP);
			var button = document.createElement("input");
			button.setAttribute("type", "button");
			button.setAttribute("id", "ecomButton" + i);
			button.value = "Buy";
			for(var x=0; x<=sysbutton.classList.length;x++){
				button.classList.add(sysbutton.classList[x]);
			}
			button.setAttribute("onclick","ecomRegisterAddItemToNewCart('" + loid + "');");
			if(div.children[0]){
				div.children[0].insertBefore(button, sysbutton);
			}else{
				div.appendChild(button);
			}
		}
	}catch(e){
		console.log(e);
	}
}
  
function eCom_Initialize() {
	try{
		if (document.querySelectorAll("[data-test='LD_Call_To_Action_Duplexed_Btn']")[0]) {
			ecomShowLoading();
			ecom_eventObjectId = window.location.href;
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
				.set('X-API-Key', 'xxxxxxxxxxxxxxxxxxxxxxxxx')
				.set('accept', 'json')
				.end(function (err, res) {
					if (!err && res) {
						ecom_loDetails = res;
						if(res.statusCode == 200){
							ecom_loDetails = res.body;
							if(ecom_loDetails == null || ecom_loDetails == "null"){
								ecomHideLoading();
							}else if(res.body.IsECommerce && res.body.IsECommerce.toLowerCase() == "yes"){
								ecomChangeRequestToBuy(ecom_eventObjectId, ecom_loDetails);
							}else{
								ecomHideLoading();
							}
						}else if(res.statusCode == 406){
							ecomShowAlert("Error", "NoContent for user: " + ecom_UserId + " and loid:" + ecom_eventObjectId);
							console.log("NoContent for user: " + ecom_UserId + " and loid:" + ecom_eventObjectId);
						}else{
							ecomShowAlert("Error: ", res);
							console.log("Error: " + res);
						}
					} else {
						ecomError = err;
						if(ecomError.status == 406){
							ecomShowAlert("Error", "NoContent for user: " + ecom_UserId + " and loid:" + ecom_eventObjectId);
							console.log("NoContent for user: " + ecom_UserId + " and loid:" + ecom_eventObjectId);
							console.loId(ecomError);
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
					}
					ecomHideLoading();
				});
			})();
			
		} else {
			if (ecom_iniCounter <= 20) {
					ecom_iniCounter++;
					setTimeout(function () { eCom_Initialize(); }, 1000);
				}
		}
	}catch(e){
		console.log(e);
		ecomHideLoading();
	}	
}

eCom_Initialize();
</script>	