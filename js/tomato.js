 

window.onload = function(){

	new Vue({
			el:'#parentdiv',
			data:{
				inittext:"番茄钟计时器",
				//text:"番茄钟计时器",
				timer:25, 
				everyRelextTime:5,
				soundRest:'audio/rest.mp3',
				soundTick:'audio/tick.mp3',
				openTickSound:true,
				showaddmission:false,
				tomatoCount:1,
				initTaskName:"我的番茄钟任务",
				mytasks:[],		
				mytimer:null,	
				currentTomato:null,
				pannelType:0,//0是任务 1是统计 2是设置 3是关于
				
			},
			watch:{
				timer:function(t){
					if(this.currentTomato){
						 this.currentTomato.currentTime = this.timer;	
					} 
				}
			},
			computed:{

				allTime:function(){
					return this.tomatoCount*30;
				},
				workTime:function(){
					return this.tomatoCount*(30 - this.everyRelextTime);
				},
				relexTime:function(){
					return this.tomatoCount*this.everyRelextTime;
				},
				text:function(){
					if (this.tomatoCount<1) {
						return "番茄钟计时器";
					} 
					let [mini,second] = [parseInt(this.timer/60).toString().padStart(2,'0'),(this.timer%60).toString().padStart(2,'0')];
					return `${mini}:${second}`
				} 


			},
			methods:{

				switchPannelType:function(type=1){
					this.pannelType = type;
				},
				startAtask:function (count=25*60) {  
					this.timer = 0;
					this.timer = count;
					clearTimeout(this.mytimer); 
					this.startDaojishi() 
				},
				endAtask:function(){
					this.timer = 0; 
					clearTimeout(this.mytimer); 
				},
				pauseAtask:function(){

					clearTimeout(this.mytimer); 
				},
				startDaojishi:function(){

					this.timer -=1;
					if(this.timer>0){
						if(this.openTickSound){
							this.PlaySound(this.soundTick)		
						}
						var that = this; 
						this.mytimer = setTimeout(function(){ that.startDaojishi() }, 1000);	 
					}
					else{
						this.tomatoCount -=1;
						this.timer = 25*60; 
						if(this.currentTomato){
							this.currentTomato.currentIndex +=1;
						} 
						this.PlaySound(this.soundRest);
					}
				},
			 	PlaySound:function(src) { 
					/* 播放提示音 */
				 	var au = document.createElement("audio");
				 	au.preload="auto";
			 		au.src = src;
			 		au.play();
			 	},
			 	addtomato:function(){
			 		this.tomatoCount +=1;	 
			 	},
			 	subtomato:function(){
			 		if(this.tomatoCount>1)
			 		{
			 			this.tomatoCount -=1;
			 		}
			 	},
			 	relextStartCount:function(){
			 		this.pannelType = 0;
			 		if(this.currentTomato && this.currentTomato.state === 1){
			 			this.currentTomato.state = 0;  
			 		}
			 		this.tomatoCount = 1;
			 		this.startAtask(5*60);
			 	},
			 	maketask:function(){
			 		this.showaddmission = false;
			 		let task = {"initTaskName":this.initTaskName,
			 					"tomatoCount":this.tomatoCount,
			 					"currentIndex":0,
			 					"currentTime":60*25,
			 					"state":0,/*0 未开始  1进行中 2完成*/
			 				  }
			 		this.mytasks.unshift(task); //.push(task); 
			        console.log('已添加一个番茄钟');
			 		// this.startAtask();
			 	},
			 	removeTomato:function(item){
			 		let idx = this.mytasks.indexOf(item);
			 		this.mytasks.splice(idx,1);
			 		console.log(idx)
			 		this.endAtask()
			 	},
			 	pauseTomato:function(item){
			 		item.state = 0;
			 		this.pauseAtask()
			 	},
			 	startTomato:function(item){
			 		if(this.currentTomato && this.currentTomato.state === 1){
			 			this.currentTomato.state = 0; 
			 		}
			 		this.currentTomato = item;
			 		item.state = 1;  
			 		this.startAtask(this.currentTomato.currentTime);
			 	},
			 	completeTomato:function(item){
			 		item.state = 2; 
			 		this.endAtask() 
			 	}
			}
	})
	
};