function VenuedetailAssistant(venue,u,p) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	   
	   this.venue=venue;
	   this.username=u;
	   this.password=p;
}

VenuedetailAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
	$("snapMayor").hide();
	$("snapTips").hide();
	$("checkinVenueName").innerHTML=this.venue.name;
	$("checkinVenueAddress").innerHTML=this.venue.address;
	if (this.venue.crossstreet) {
	 $("checkinVenueAddress").innerHTML += "<br/>(at "+this.venue.crossstreet+")";
	}
	var query=encodeURIComponent(this.venue.address+' '+this.venue.city+', '+this.venue.state);
	$("venueMap").src="http://maps.google.com/maps/api/staticmap?mobile=true&zoom=15&size=320x175&sensor=false&markers=color:blue|"+this.venue.geolat+","+this.venue.geolong+"&key=ABQIAAAAfKBxdZJp1ib9EdLiKILvVxT50hbykH-f32yPesIURumAK58x-xSabNSSctTSap-7tI2Dm8GumOSqyA"
	
	
	
	
	
	
	
	
	
	var url = 'http://api.foursquare.com/v1/venue.json';
	auth = make_base_auth(this.username, this.password);
	Mojo.Log.error("un="+this.username);
	var request = new Ajax.Request(url, {
	   method: 'get',
	   evalJSON: 'force',
	   requestHeaders: {Authorization:auth}, //Not doing a search with auth due to malformed JSON results from it
	   parameters: {vid:this.venue.id},
	   onSuccess: this.getVenueInfoSuccess.bind(this),
	   onFailure: this.getVenueInfoFailed.bind(this)
	 });

	
			/* setup widgets here */
	    this.controller.setupWidget("detailScroller",
         this.scrollAttributes = {
             mode: 'vertical-snap'
         },
         this.scrollModel = {
             snapElements: {'y': [$("snapMap"),$("snapMayor"),$("snapTips"),$("snapInfo")]}
         });

	

	
	
	/* use Mojo.View.render to render view templates and add them to the scene, if needed. */
	
	/* add event handlers to listen to events from widgets */
}

var auth;

function make_base_auth(user, pass) {
  var tok = user + ':' + pass;
  var hash = Base64.encode(tok);
  //$('message').innerHTML += '<br/>'+ hash;
  return "Basic " + hash;
}

VenuedetailAssistant.prototype.getVenueInfoSuccess = function(response) {
	Mojo.Log.error(response.responseText);
	
	//mayorial stuff
	if(response.responseJSON.venue.stats.mayor != undefined) { //venue has a mayor
		$("snapMayor").show();
		$("mayorPic").src=response.responseJSON.venue.stats.mayor.user.photo;
		$("mayorName").innerHTML=response.responseJSON.venue.stats.mayor.user.firstname+" "+response.responseJSON.venue.stats.mayor.user.lastname;
		var mInfo;
		switch(response.responseJSON.venue.stats.mayor.user.gender) {
			case "male":
				var s=(response.responseJSON.venue.stats.mayor.count!=1)? "s": ""; 
				mInfo="He's checked in here "+response.responseJSON.venue.stats.mayor.count+" time"+s+".";
				break;
				
			case "female":
				var s=(response.responseJSON.venue.stats.mayor.count!=1)? "s": ""; 
				mInfo="She's checked in here "+response.responseJSON.venue.stats.mayor.count+" time"+s+".";
				break;
				
			default:
				var s=(response.responseJSON.venue.stats.mayor.count!=1)? "s": ""; 
				mInfo="They've checked in here "+response.responseJSON.venue.stats.mayor.count+" time"+s+".";
				break;
				
		}
		$("mayorInfo").innerHTML=mInfo;
	}
	
	
	//tips stuff
	if(response.responseJSON.venue.tips != undefined) {
		$("snapTips").show();
		var tips='';
		for (var t=0;t<response.responseJSON.venue.tips.length;t++) {
			//<div class="palm-row single"><div class="checkin-score"><img src="'+imgpath+'" /> <span>'+msg+'</span></div></div>
			var tip=response.responseJSON.venue.tips[t].text;
			var created=response.responseJSON.venue.tips[t].created;
			var username=response.responseJSON.venue.tips[t].user.firstname+" "+response.responseJSON.venue.tips[t].user.lastname;
			var photo=response.responseJSON.venue.tips[t].user.photo;

			tips+='<div class="palm-row single"><div class="checkin-score"><img src="'+photo+'" width="24"/> <span>'+username+'</span><br/><span class="palm-info-text">'+tip+'</span></div></div>'+"\n";
		}
		$("venueTips").innerHTML=tips;
	}
	
	
	//venue info stuff
	var totalcheckins=response.responseJSON.venue.stats.checkins;
	var beenhere=response.responseJSON.venue.stats.beenhere.me;
	var twitter=response.responseJSON.venue.twitter;
	var phone=response.responseJSON.venue.phone;
	var tags=response.responseJSON.venue.tags;
		Mojo.Log.error("phone="+phone);

	var vinfo='';
	var s=(totalcheckins != 1)? "s" :"";
	vinfo='<span class="capitalize">'+response.responseJSON.venue.name+'</span> has been visited '+totalcheckins+' time'+s+' ';
	vinfo+=(beenhere)? 'and you\'ve been here before.': 'but you\'ve never been here';
	vinfo+='.<br/>';
	vinfo+=(twitter != undefined)? 'Twitter: <a href="http://twitter.com/'+twitter+'">@'+twitter+'</a><br/>': '';
	vinfo+=(phone != undefined)? 'Phone: <a href="tel://'+phone+'">'+phone+'</a><br/>': '';
	Mojo.Log.error("vnfo="+vinfo);
	$("venueInfo").innerHTML=vinfo;
}
VenuedetailAssistant.prototype.getVenueInfoFailed = function(response) {
	Mojo.Log.error("############error!");
}




VenuedetailAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


VenuedetailAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

VenuedetailAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}