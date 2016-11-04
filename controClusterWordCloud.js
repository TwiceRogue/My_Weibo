var hitTest = function(elem, other_elems){
	var overlapping = function(BBox_a, BBox_b){
		var aWidth  = BBox_a.width,
			bWidth  = BBox_b.width,
			aHeight = BBox_a.height,
			bHeight = BBox_b.height,		
			aLeft  = BBox_a.x,
			bLeft  = BBox_b.x,
			aTop   = BBox_a.y,
			bTop   = BBox_b.y;
			
			if(aLeft + aWidth > bLeft && bLeft + bWidth > aLeft)
				if(aTop + aHeight > bTop && bTop + bHeight > aTop)
					return true; 
			return false;
		};
		var i = 0;
		for (i = 0; i < other_elems.length; i++){
			if(overlapping(elem, other_elems[i])){
				return true;
			}
		}
		return false;
};

function sort_reviews(sentence_ids){
	$("#sentTokenView").empty();

	var dataset_menu = d3.select("#dataset_menu select");
    var dataset_type = dataset_menu.property("value");
	var rating_num =5;
	if(dataset_type=='imdb'){
    	rating_num = 10;
    }

	var sentences = g.all_data[1];	
	var rating_sent_list = g.all_data[4];
	var sentiment_list = g.all_data[2];

	var senti_menu = d3.select("#senti_menu select");
    var senti_type = senti_menu.property("value");
    if(g.senttoken==2){
		for(var i=0;i<sentence_ids.length;i++){
			shtml=$(" <div class=\"sreview\"> </div>" );
			var rtitle=$("<div class=\"rtitle\"></div>");
			var date=$("<div style=\"float:left;\">" + rating_sent_list[sentence_ids[i]]+" stars</div>");
			rtitle.append(date);
	//        var img=$("<div class=\"stars star"+rtext_arr[rtext_id[i]].stars_num+"\"> </div>");
	//        rtitle.append(img);

			var rc=$("<div class=\"sentences\"></div>");
			rc.html(sentences[sentence_ids[i]]);

			shtml.append(rtitle);
			shtml.append(rc);        
			$("#sentTokenView").append(shtml);	

		}
    }
    else{
		if(senti_type=="senti_com"){
			for(var i=0;i<sentence_ids.length;i++){
				var senti = sentiment_list[sentence_ids[i]];
				if(g.senttoken==senti){	
						shtml=$(" <div class=\"sreview\"> </div>" );
						var rtitle=$("<div class=\"rtitle\"></div>");
						var date=$("<div style=\"float:left;\">" + rating_sent_list[sentence_ids[i]]+" stars</div>");
						rtitle.append(date);
				//        var img=$("<div class=\"stars star"+rtext_arr[rtext_id[i]].stars_num+"\"> </div>");
				//        rtitle.append(img);

						var rc=$("<div class=\"sentences\"></div>");
						rc.html(sentences[sentence_ids[i]]);

						shtml.append(rtitle);
						shtml.append(rc);        
						$("#sentTokenView").append(shtml);	
				}

			}
		}
		else{
			for(var i=0;i<sentence_ids.length;i++){
				var senti = rating_sent_list[sentence_ids[i]];
				if (senti<rating_num/2) senti = 0;
				else senti = 1;
				if(g.senttoken==senti){	
						shtml=$(" <div class=\"sreview\"> </div>" );
						var rtitle=$("<div class=\"rtitle\"></div>");
						var date=$("<div style=\"float:left;\">" + rating_sent_list[sentence_ids[i]]+" stars</div>");
						rtitle.append(date);
				//        var img=$("<div class=\"stars star"+rtext_arr[rtext_id[i]].stars_num+"\"> </div>");
				//        rtitle.append(img);

						var rc=$("<div class=\"sentences\"></div>");
						rc.html(sentences[sentence_ids[i]]);

						shtml.append(rtitle);
						shtml.append(rc);        
						$("#sentTokenView").append(shtml);	
				}

			}
		}
	}
 	
	
	
	$("#sentTokenView").scrollTop(0);
}


function draw_selected_circle_word_cloud_all(pos_info, children_nodes, id_list){
	var margin = {top: 0, right: 0, bottom: 0, left: 0};
	
// 	var word_cloud_data = all_data.cluster_word_freq;
// 	var cluster_word_sent = all_data.cluster_word_senttoken;
// 	var raw_tokens = all_data.sent_token_arr;

    var feature_freq = g.all_data[3];

	
	var r_max = d3.max(pos_info, function(c){return c[3];});
	var r_min = d3.min(pos_info, function(c){return c[3];});
	var weight_r = d3.scale.linear()
						.range([0.5,1])
	
						.domain([r_min, r_max]);
						
	var wordcloud_groups = d3.select("#cluster_svg").append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("id", "wordcloud_gropups");
    //code		
	for(var i = 0; i < pos_info.length;i++){
		var a_pos_data = pos_info[i];
		var index = a_pos_data[0];

		var feature_index_list = children_nodes[id_list[index]][2];
		var word_freq_arr = [];
		for(var j = 0;j < feature_index_list.length;j++){
			var feature_id = feature_index_list[j];
			var word_freq = [];
			var feature = feature_freq[feature_id][0];
			var freq = feature_freq[feature_id][1];
			var features = feature.split('_');
			for(var k = 0; k < features.length;k++){
				word_freq.push(features[k]);
				word_freq.push(freq);
				word_freq.push(feature_id);
			}	
// 			for(var k = 0; k < features.length;k++){
// 				word_freq.push(feature);
// 				word_freq.push(freq);
// 				word_freq.push(feature_id);
// 			}		
			word_freq_arr.push(word_freq);
		}
		word_freq_arr.sort(function(a,b){
			return b[1] - a[1];
		}); 

		var top_k = 20;
		if(word_freq_arr.length<top_k) top_k=word_freq_arr.length;
		var word_freq_arr = word_freq_arr.slice(0, top_k);

		var center_posx = a_pos_data[1];
		var center_posy = a_pos_data[2];
		var center_r = a_pos_data[3];
// 		var word_freq_arr = word_cloud_data[index];
		
		
		
		var max = d3.max(word_freq_arr, function(c){ return c[1];});
		var min = d3.min(word_freq_arr, function(c){ return c[1];});
		var r_scale = weight_r(center_r);
		var Tmax = 35*r_scale;
		var Tmin = 10;
		
		var weight_z = d3.scale.linear()
						.rangeRound([Tmin,Tmax])
						.domain([min, max]);
		
		var BBox = function(x, y, w, h){
			this.x = x;
			this.y = y;
			this.width  = w;
			this.height = h;
		};
		
		
		var r = center_r;
		
		var step = 1.0,
			already_placed_words = [],
			aspect_ratio = 1;
		
		var all_text = wordcloud_groups.append("g")
			.attr("id","node_wc_"+i)
			.selectAll(".text_class").data(word_freq_arr)
		    .enter().append("text")
		    .attr("class", "text_class")
		    .attr("id",index)
		    .each(draw_one_word);
		all_text.on("click", function(d,i){
			var feature_id = d[2];
 			var sent_index_arr = feature_freq[feature_id][2];
 			sort_reviews(sent_index_arr);
			
			//高亮
	//		console.log(word_select);
	//		console.log(d.weight);
			$('#sentTokenView .sentences span').css("background-color", "#f5f5f5");
			var words = d[0].split("_");
			var str = words[0];
			for(var i = 1;i < words.length;i++){
// 				$('#sentTokenView .sentences').highlight(words[i]);
				str = str + " " + words[i]
			}	
			$('#sentTokenView .sentences').highlight(str);
		});
	}
	
	function draw_one_word(word){
// 		var Tmax = 40, Tmin = 10;		
		var $this = this;
		var word_id = word[0],
			angle  = 2 * Math.PI * Math.random() *0.01,
			angle_step = 0.01 * 2 * Math.PI,
			radius = 0.0,
			inner_html = word[0].replace(/_/g," "),
//			weight = weight_z(word.weight),
			//weight = Tmin + (Tmax - Tmin) * weight_z(word[1]),
			weight =  weight_z(word[1]),
			x1 = center_posx,
			y1 =  center_posy;	
		
		d3.select(this)
			.attr("id", "word_"+word_id)
			.attr("class","clusterWordcloud")
			.attr("font-size", weight + "px")
			.attr("fill",'black')
			.text(inner_html);
		
		var word_width  = this.getBBox().width,
			word_height = this.getBBox().height;
		var diagnal	= Math.sqrt(word_width * word_width + word_height * word_height) / 2;
		
		var hasPlaced = true;
		while (diagnal>=r && weight>1) {
            //code
			weight = weight - 1;
			d3.select(this).attr("font-size", weight + "px");
			word_width  = this.getBBox().width,
			word_height = this.getBBox().height;
			diagnal	= Math.sqrt(word_width * word_width + word_height * word_height) / 2;
        }
		if (diagnal>=r) {
            //code
			d3.select(this).remove();
			hasPlaced = false;
// 			console.log(word[0] + word[1] + " out");
			return;
        }
		var posX = x1 - word_width/2, posY = y1 + word_height/2;		
		var left = posX, top = posY;
		
		var bbox = new BBox(posX, posY-word_height, word_width, word_height);
		
		while(hitTest(bbox, already_placed_words))
		{
			radius += step;
			if(radius + diagnal > r){
				d3.select(this).remove();
				hasPlaced = false;
// 				console.log(word[0] + word[1] + " out");
				break;
			}
			for(var i = 0; i < 1; i = i + 0.01){
				posX = left + (radius * Math.cos(angle)) * aspect_ratio;
				posY   = top  + radius * Math.sin(angle);				

				
				if (posX > center_posx-center_r && posX < center_posx+center_r-word_width && posY > center_posy-center_r+word_height && posY < center_posy+center_r) {
					bbox.x = posX;
					bbox.y = posY - word_height;
					if(!hitTest(bbox, already_placed_words)){
						break;
					}
				}				
				
				angle  = angle + angle_step;
//				console.log(word.name);
			}			
			
		}
		if(hasPlaced) {
			already_placed_words.push(bbox);

			d3.select(this)
			  .attr("x",posX)
			  .attr("y",posY);
		}
		
	}
}

function draw_node_word_cloud(feature_index_list){
	$('#word_cloud').empty();
	var feature_freq = g.all_data[3];
	var word_freq_arr = [];
	for(var j = 0;j < feature_index_list.length;j++){
		var feature_id = feature_index_list[j];
		var word_freq = [];
		var feature = feature_freq[feature_id][0];
		var freq = feature_freq[feature_id][1];
// 		var features = feature.split('_');
// 		for(var k = 0; k < features.length;k++){
			word_freq.push(feature);
			word_freq.push(freq);
			word_freq.push(feature_id);
// 		}			
		word_freq_arr.push(word_freq);
	}
	word_freq_arr.sort(function(a,b){
		return b[1] - a[1];
	}); 
	var top_k = 30;
	if(word_freq_arr.length<top_k) top_k=word_freq_arr.length;
	var word_freq_arr = word_freq_arr.slice(0, top_k);

// 	var cluster_word_sent = all_data.cluster_word_senttoken;
// 	var raw_tokens = all_data.sent_token_arr;

	//词云
	var div = document.getElementById("word_cloud");
	var client_width = div.clientWidth;
	var client_height = div.clientHeight;

	var margin = {top: 2, right: 2, bottom: 2, left: 2},
	padding = {top: 0, right:0, bottom:0, left:0},
    width = client_width - margin.left - margin.right - padding.left - padding.right,
    height = client_height - margin.top - margin.bottom - padding.top - padding.bottom;
	
	var Tmax = 55, Tmin = 15;
	
	var BBox = function(x, y, w, h){
		this.x = x;
		this.y = y;
		this.width  = w;
		this.height = h;
	};
	
	
	var r = width;
	
	var step = 8.0,
		already_placed_words = [],
		aspect_ratio = 1;
	
	var weight_z = d3.scale.linear().range([0,1]);	

	
	//color array
//	var color = d3.scale.category10();
//	var color = d3.scale.category20b();	
	var color = ['#000000','#9e0142','#d53e4f','#f46d43','#fdae61','#fee08b','#e6f598','#abdda4','#66c2a5','#3288bd','#5e4fa2'];

	
	var wordcloud_svg = d3.select("#word_cloud").append("svg")
	    .attr("width", width + padding.left + padding.right)
	    .attr("height", height + padding.top + padding.bottom)
	    .attr("id","wordcloud_svg")
	    .attr("transform", "translate(" + padding.left + "," + padding.top + ")");
	

	weight_z.domain(d3.extent(word_freq_arr, function(d) { return d[1]; })).nice();	

	var svg = wordcloud_svg.append("g")
					.attr("class","text_group");
	
	var all_text = svg.selectAll(".text_class")
		    .data(word_freq_arr)
		    .enter().append("text")
		    .attr("class", "text_class")
		    .each(draw_one_word);

	all_text.on("click", function(d,i){
 			var feature_id = d[2];
 			var sent_index_arr = feature_freq[feature_id][2];
 			sort_reviews(sent_index_arr);
			
			//高亮
	//		console.log(word_select);
	//		console.log(d.weight);
			$('#sentTokenView .sentences span').css("background-color", "#f5f5f5");
			var words = d[0].split("_");
			var str = words[0];
			for(var i = 1;i < words.length;i++){
// 				$('#sentTokenView .sentences').highlight(words[i]);
				str = str + " " + words[i]
			}	
			$('#sentTokenView .sentences').highlight(str);
		});

	
	function draw_one_word(word){
		var $this = this;
		console.log( word[0]);
		var word_id = word[0],
			angle  = 2 * Math.PI * Math.random() *0.01,
			angle_step = 0.01 * 2 * Math.PI,
			radius = 0.0,
			inner_html = word[0].replace(/_/g," "),
//			weight = weight_z(word.weight),
			weight = Tmin + (Tmax - Tmin) * weight_z(word[1]),
			x1 = width/2,
			y1 =  height/2;	
		console.log(inner_html);
		d3.select(this)
			.attr("class", "word_"+word_id)
			.attr("font-size", weight + "px")
			.attr("fill",color[0])
			.text(inner_html);
		
		var word_width  = this.getBBox().width,
			word_height = this.getBBox().height;
		var diagnal	= Math.sqrt(word_width * word_width + word_height * word_height) / 2;
		
		var hasPlaced = true;
		var posX = x1-word_width/2, posY = y1+word_height/2;
		var left = posX, top = posY;
		
		var bbox = new BBox(posX, posY-word_height, word_width, word_height);
		
		while(hitTest(bbox, already_placed_words))
		{
			radius += step;
			if(radius + diagnal > r){
				d3.select(this).remove();
				hasPlaced = false;
				console.log(word[0] + word[1] + " out");
				break;
			}
			for(var i = 0; i < 1; i = i + 0.01){
				posX = left + (radius * Math.cos(angle)) * aspect_ratio;
				posY   = top  + radius * Math.sin(angle);
				

				
				if (posX > padding.left && posX + word_width < width && posY - word_height > padding.top && posY < height) {
					bbox.x = posX;
					bbox.y = posY - word_height;
					if(!hitTest(bbox, already_placed_words)){
						break;
					}
				}				
				
				angle  = angle + angle_step;
//				console.log(word.name);
			}			
			
		}
		if(hasPlaced) {
			already_placed_words.push(bbox);

			d3.select(this)
			  .attr("x",posX)
			  .attr("y",posY);
		}
		
	}
}



