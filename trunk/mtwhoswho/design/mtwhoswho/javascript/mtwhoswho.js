/*
// SOFTWARE NAME: MT Who'S Who
// COPYRIGHT NOTICE: Copyright (C) 2009 Maxime THOMAS
// SOFTWARE LICENSE: GNU General Public License v3.0
// NOTICE: >
//  This file is part of MT Who's Who.
//
//  MT Who's Who is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  MT Who's Who is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with MT Who's Who.  If not, see <http://www.gnu.org/licenses/>.
*/
MTPeople=function(people){
	this.id = people.id;
	this.coa = 0;
	this.name = people.name;
	this.x = people.x;
	this.y = people.y;
};









MTWhoswho=function(params){
	this.square_size=100;
	this.border_width=3;
	this.border_color="#005493";

	this.images=new Array();
	this.radius=this.square_size/2+this.border_width;
	
	var th = this;
	
	if (params){
		$.each(params, function(i,el){
			eval("this."+i+"='"+el+"'");
		});
	}
	
	this.loadImages=function(){
		var th=this;
		$('img[id*=whoswho_]').each(function(i, el){
			var t = el.id.split("_");
			var id = t[t.length-1];
			if (!th.images[id]){
				//console.log("Loading image : "+id);
				th.images[id]=new MTImage(id, th);
				th.images[id].load();
			}
		});
	};
	
	this.enableImage=function(id){
		this.images[id].init();
		this.images[id].frame.action.show();
		$('img[id*=whoswho_identity_]').hide();
	};
	this.disableImage=function(id){
		this.images[id].frame.action.hide();
		$('img[id*=whoswho_identity_]').show();
	};
	
	$('img[id*=whoswho_identity_]').click(function(){
		var t = this.id.split("_");
		var id = t[t.length-1];
		th.enableImage(id);
	});
	
	this.loadImages();
};









MTImage=function(id, whoswho){
	this.whoswho=whoswho;

	this.id=id;	
	this.people=new Array();
	this.selected_people=new Array();
	
	this.image=$("#whoswho_"+id)[0];
	
	this.frame=new MTFrame(this);
	this.container=new MTContainer(this);
	
	this.init=function(){
		//console.log("MTImage init");
		var th = this;
		$("img[id=whoswho_"+this.id+"]").mouseover(function(event){
			$(this).addClass("mouseover");
			var xPos = event.pageX - th.image.offsetLeft - th.whoswho.radius;
			var yPos = event.pageY - th.image.offsetTop - th.whoswho.radius;
			
			var xMin = xPos-th.whoswho.radius;
			var yMin = yPos-th.whoswho.radius;
			var xMax = xPos+th.whoswho.radius;
			var yMax = yPos+th.whoswho.radius;
			
			//console.log("xMin : "+xMin+" < "+xPos+" < xMax "+xMax);
			//console.log("yMin : "+yMin+" < "+yPos+" < yMax "+yMax);
			
		}).mouseout(function(event){
			$(this).removeClass("mouseover");
		}).click(function(event){
			if($("#whoswho_container_"+th.id).length==0){
				th.container.show(event);
			}
			if (th.selected_people.length!=th.people.length){
				th.container.setPosition(event);
				th.container.show(event);
				th.container.init(event);
			}
			th.container.list.clear();
		});
	};
	//Data functions
	this.save = function(){
		//console.log("MTImage save");
		var th=this;
		var url = "mtwhoswho::save::"+this.id;
		$(this.selected_people).each(function(i,el){
			if (el!=undefined){
				url = url + "::" + el.id + "::" + el.x + "::"+el.y;
			}
		});
		ez.server.call(url, function(content, errorCode, errorText){
			if (!errorCode){
				th.whoswho.disableImage(th.id);
			}
		});		
	};
	this.load = function(){
		var th = this;
		ez.server.call( 'mtwhoswho::getListOf::'+this.id, function(content, errorCode, errorText){
			var source_people = eval("source_people="+content);
			if (source_people.errors.length==0){
				$(source_people.data).each(function(i, el){
					var people = new MTPeople(el);
					th.people[people.id]=people;
					//console.log("People loaded from the source : "+people.name);
				});
			}else{
				alert(source_people.errors+" ("+errorCode+" "+errorText+")");
			}
		});
		
		ez.server.call( 'mtwhoswho::load::'+this.id, function(content, errorCode, errorText){
			var loaded_people = eval("loaded_people="+content);
			if (loaded_people.errors.length==0){
				$(loaded_people.data).each(function(i,el){
					var people = new MTPeople(el);
					th.selected_people[people.id]=people;
					//console.log("People selected by default : "+people.name);
				})
				th.frame.show();
				th.frame.init();
			}else{
				alert(loaded_people.errors+" ("+errorCode+" "+errorText+")");
			}
		});
	};
};








MTContainer=function(image){
	this.image=image;
	this.whoswho=this.image.whoswho;
		
	this.id=this.image.id;
	this.radius=this.image.whoswho.radius;
	
	this.x=0;
	this.y=0;
	
	this.box=new MTBox(this);
	this.list=new MTList(this);
	this.actionbox=new MTContainerActionBox(this);
	
	var th=this;
	
	this.create=function(){
		//console.log("MTContainer create");
		var container = $("#whoswho_container_"+this.id);
		if (container.length==0){
			container = document.createElement("div");
			$(container).attr("id", "whoswho_container_"+this.id)
				.addClass("container")
				.insertBefore('img[id=whoswho_'+this.id+']')
				.show();
		}
	};
	
	this.show=function(event){
		this.create();
		this.box.show(event);
		this.list.show(event);
		this.actionbox.show(event);
	};
	this.hide=function(){
		//console.log("MTContainer hide");
		this.box.hide();
		this.list.hide();
		this.actionbox.hide();
	};
	this.init=function(){
		//console.log("MTContainer init");
		this.box.init();
		this.list.init();
		this.actionbox.init();
	};
	this.setPosition=function(event,x,y){
		//console.log("MTContainer setPosition");
		if (event){
			this.x = event.pageX - this.image.image.offsetLeft;
			this.y = event.pageY - this.image.image.offsetTop;
		}else{
			if (x){this.x=x;}
			if (y){this.y=y;}
		}
		
		var maxX = this.image.image.width - this.radius;
		var maxY = this.image.image.height - this.radius;
		
		if (this.x<=this.radius){this.x=this.radius;}
		if (this.y<=this.radius){this.y=this.radius;}
		if (this.x>maxX){this.x=maxX;}
		if (this.y>maxY){this.y=maxY;}
		
		var container = $("#whoswho_container_"+this.id);
		$(container).css("margin-left", this.x-this.radius).css("margin-top", this.y-this.radius);
		//console.log("Positionning the container to center "+this.x+" "+this.y);
	};
};















MTBox=function(container){
	this.container=container;
	this.whoswho=this.container.whoswho;
	this.id=this.container.id;
	
	var th = this;
	
	this.show=function(event){
		
		//console.log("MTBox show");
		var c = $("#whoswho_container_"+this.id);
		var box = $("#whoswho_box_"+this.id);
		if (box.length==0){
			box = document.createElement("div");
			
			$(box).attr("id", "whoswho_box_"+this.id).addClass("box");
				$(box).css("width", this.whoswho.square_size);
				$(box).css("height", this.whoswho.square_size);
				$(box).css("border-color", this.whoswho.border_color);
				$(box).css("border-width", this.whoswho.border_width);
			$(c).append($(box));
		}
		$(box).show();
	};
	this.hide=function(){
		//console.log("MTBox hide");
		$("#whoswho_box_"+this.id).hide();
	};
	this.init=function(event){
		//console.log("MTBox init");
		$("#whoswho_box_"+this.id).unbind().click(function(event){
			if (th.container.image.selected_people.length!=th.container.image.people.length){
				th.container.setPosition(event);
				th.container.show(event);
			}
		});
	};
	
};













MTList=function(container){
	this.container=container;
	this.image=this.container.image.image;
	this.whoswho=this.container.whoswho;
	this.id=this.container.id;
	
	this.selected_people=new Array();
	
	var th = this;
	
	this.show = function(event){
		//console.log("MTList show");
		var box = $("#whoswho_box_"+this.id);
		var list = $("#whoswho_boxlist_"+this.id);
		
		if (list.length==0){
			list = document.createElement("ul");
			$(list).attr("id", "whoswho_boxlist_"+this.id)
				.addClass("boxlist")
				.css("width", 2*this.whoswho.radius)
				.css("height", 2*this.whoswho.radius);
			$(list).insertAfter($(box));
		};

		this.setAlign();
		
		$(list).empty();
		
		$(this.container.image.people).each(function(i, el){
			if (el!=undefined && !th.container.image.selected_people[i]){
				var p = document.createElement("li");
				$(p).attr("id", "whoswho_people_"+th.id+"_"+el.id);
				var d = document.createTextNode(el.name);
				$(p).append($(d));
				$(list).append($(p));
			}
		});
		
		$(list).show();
	};
	this.hide = function(){
		//console.log("MTList hide");
		$("#whoswho_boxlist_"+this.id).hide();
	};
	this.init=function(){
		//console.log("MTList init");
		$(".boxlist li").unbind().mouseover(function(){
			$(this).toggleClass("cursor");
		}).mouseout(function(){
			$(this).toggleClass("cursor");
		}).click(function(event){
			th.click(event);
		});
	};
	this.click = function(event){
		//console.log("MTList click");
		var t = event.currentTarget.id.split("_");
		var new_selected = t[t.length-1]; 
		var former_selected = 0;

		if ($("#whoswho_boxlist_"+this.id).children(".selected").length>0){
			t = $("#whoswho_boxlist_"+this.id).children(".selected")[0].id.split("_");
			former_selected = t[t.length-1];
		}
		
		$(event.currentTarget).siblings().removeClass("selected");
		$(event.currentTarget).toggleClass("selected");
		
		var former_index=this.selected_people.indexOf(former_selected);
		var new_index=this.selected_people.indexOf(new_selected);
		
		if (new_selected==former_selected){
			this.selected_people.splice(former_index,1);
		}else if(former_selected!=0&&new_selected!=former_selected){
			this.selected_people.splice(former_index,1);
			this.selected_people.push(new_selected);
		}else if (former_selected==0){
			this.selected_people.push(new_selected);
		}
	};
	this.clear=function(){
		//console.log("MTList clear");
		this.selected_people=new Array();
	};
	this.setAlign=function(){
		//console.log("MTList setAlign");
		var list=$("#whoswho_boxlist_"+this.id);
		var box=$("#whoswho_box_"+this.id);

		if (this.container.x >= this.image.width/2){
			$(list).css("left", -2*this.whoswho.radius)
				.addClass("right")
				.removeClass("left");
			$(box).addClass("left")
				.removeClass("right");
		}else{
			$(list).css("left", 2*this.whoswho.radius)
				.addClass("left")
				.removeClass("right");
			$(box).addClass("right")
				.removeClass("left");
		}
	};
};








MTContainerActionBox=function(container){
	this.container=container;
	this.image=this.container.image.image;
	this.whoswho=this.container.whoswho;
	this.id=this.container.id;
	
	this.show=function(event){
		//console.log("MTContainerActionBox show");
		var th=this;
		
		var container_action_box = $("#whoswho_container_action_box_"+this.id);
		if(container_action_box.length==0){
			container_action_box = document.createElement("div");
			$(container_action_box).attr("id", "whoswho_container_action_box_"+this.id)
				.addClass("container_action_box");
			
			var button_ok=document.createElement("input");
			$(button_ok).attr("id", "whoswho_container_action_box_ok_"+this.id)
				.attr("type", "button")
				.attr("value", "OK")
				.addClass("button")
				.css("width", this.whoswho.radius)
				.show();
			
			var button_cancel=document.createElement("input");
			$(button_cancel).attr("id", "whoswho_container_action_box_cancel_"+this.id)
				.attr("type", "button")
				.attr("value", "Cancel")
				.addClass("button")
				.css("width", this.whoswho.radius)
				.show();
			$(container_action_box).append($(button_ok)).append($(button_cancel));
			
			$("#whoswho_container_"+this.id).append($(container_action_box));
		};
		$(container_action_box).show();
	};
	this.init=function(){
		var th=this;
		//console.log("MTContainerActionBox init");
		$("#whoswho_container_action_box_ok_"+this.id).unbind().click(function(){
			th.container.image.frame.update();
			th.container.hide();
		});
		$("#whoswho_container_action_box_cancel_"+this.id).click(function(){
			th.container.hide();
		});
	};
	this.hide=function(){
		//console.log("MTContainerActionBox hide");
		$("#whoswho_container_action_box_"+this.id).hide();
	};
};












MTFrame=function(image){
	this.image = image;
	this.id=this.image.id;
	this.whoswho = this.image.whoswho;
	this.action = new MTAction(this);
	this.people=new Array();
	
	var th=this;
	
	this.show=function(){
		//console.log("MTFrame show");
		frame = document.createElement("div");
		$(frame).attr("id", "whoswho_frame_"+this.id)
			.addClass("frame")
			.insertAfter('img[id=whoswho_'+this.id+']')
			.show();
		
		this.action.show();
				
		$(this.image.selected_people).each(function(i,el){
			if (el!=undefined){
				th.people[i]=el;
				var p = new MTFramePeople(th, el); 
				p.show();
			}
		});
		
	};
	
	this.init=function(){
		//console.log("MTFrame init");
		this.action.init();
		$(this.image.selected_people).each(function(i,el){
			if (el!=undefined){
				var p = new MTFramePeople(th, el); 
				p.init();
			}
		});
	};
	
	this.update=function(){
		//console.log("MTFrame update");
		$(this.image.container.list.selected_people).each(function(i,el){
			th.addPeople(el);
		});
		this.action.setStatus("action-enabled");
	};
	
	this.addPeople=function(pid){
		//console.log("MTFrame addPeople");
		var p = this.image.people[pid];
		p.x = this.image.container.x;
		p.y = this.image.container.y;
		var fp = new MTFramePeople(this, p);
		fp.show();
		fp.init();
		this.image.selected_people[pid]=p;
		//console.log("People added in the frame : "+pid);
	};
	
	this.removePeople=function(pid){
		//console.log("MTFrame removePeople");
		$("#whoswho_frame_people_"+this.id+"_"+pid).unbind().remove();
		this.image.selected_people.splice(this.image.selected_people.indexOf(pid));
		//console.log("People removed from the frame : "+pid);
	};
};













MTAction=function(frame){
	this.frame=frame;
	this.id=this.frame.id;
	this.whoswho=this.frame.image.whoswho;
	this.status="feature-disabled";
	
	var th=this;
	
	this.show=function(){
		//console.log("MTAction show");
		
		var f = $("#whoswho_frame_"+this.id);
		var action = $("#whoswho_action_"+this.id);
		
		if (action.length==0){
			action = document.createElement("div");
			$(action).attr("id", "whoswho_action_"+this.id)
				.addClass("action")
				.css("width", 2*this.whoswho.radius);
			
			var save = document.createElement("div");
			$(save).attr("id", "whoswho_action_save_"+this.id).addClass("save save-disabled");
	
			var cancel = document.createElement("div");
			$(cancel).attr("id", "whoswho_action_cancel_"+this.id).addClass("cancel");
			
			$(action).append($(save)).append($(cancel)).hide();
			$(f).append($(action));
			return;
		}
		$(action).show()
	};
	this.init=function(){
		//console.log("MTAction init");
		var th = this;
		$("#whoswho_action_cancel_"+this.id).click(function(){
			document.location.href="";
		});
		$("#whoswho_action_save_"+this.id).click(function(){
			th.frame.image.save();
		});
	};
	this.hide=function(){
		//console.log("MTAction hide");
		$("#whoswho_action_"+this.id).hide();
	}
	this.setStatus=function(status){
		//console.log("MTAction setStatus");
		switch (status) {
			case "action-enabled":
				$("#whoswho_action_"+this.id).children().removeClass("save-disabled cancel-disabled");	
				break;
		}
		this.status=status;
	};
};












MTFramePeople=function(frame,people){
	this.frame=frame;
	this.people=people;
	this.id=this.frame.id;
	this.pid=this.people.id;
	
	var th = this;
	
	this.show=function(event){
		//console.log("MTFramePeople show");
		var frame = $("#whoswho_frame_"+this.id);
		var p = $("#whoswho_frame_people_"+this.id+"_"+this.pid);
		
		if (p.length==0){
			p = document.createElement("div");
			$(p).attr("id", "whoswho_frame_people_"+this.id+"_"+this.pid)
				.addClass("frame_people");
			var d=document.createTextNode(this.people.name);
			$(p).append(d);
			$(frame).append(p);
		}
	};
	
	this.init=function(){
		//console.log("MTFramePeople init");
		$("#whoswho_frame_people_"+th.id+"_"+th.pid).unbind().click(function(event){
			th.frame.image.container.box.hide();
			th.frame.removePeople(th.pid);
		}).mouseover(function(event){
			th.frame.image.container.create();
			th.frame.image.container.hide();
			th.frame.image.container.setPosition(null, th.people.x, th.people.y);
			th.frame.image.container.list.setAlign();
			th.frame.image.container.box.show();
		}).mouseout(function(event){
			th.frame.image.container.hide();
		});
	};
	
};

$('document').ready(function(){
	var mtwhoswho=new MTWhoswho(params);
});

var params=new Array();