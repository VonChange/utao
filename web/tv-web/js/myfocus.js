let TvFocus={
    focusId:".tv-focus",
    focusClass:"tv-focus",
    menuId: null,
    model:{
        event:{}
    },
   /* constructor(menuId) {
        this.menuId=menuId;
        console.log("constructor menuId",menuId)
    }*/
    init(menuId){
        this.menuId=menuId;
        this.menuCtrl();
        this.initKeyEvent();
    },
    menuCtrl(){
        let _this=this;
        window._menuCtrl={
            menu(){
                //_this.keyMenuEvent();
                _this.menu();
                let data = _detailData();
                //console.log("menu",data);
                _apiX.message("menu",data);
            },
            ok(){
                _this.keyOkEvent();
            },
            back(){
                _this.keyBackEvent();
            },
            left(){
                _this.keyLeftEvent();
            },
            right(){
                _this.keyRightEvent();
            },
            down(){
                _this.keyDownEvent();
            },
            up(){
                _this.keyUpEvent();
            },
            focus(id){
                $$(id).addClass(_this.focusClass);
            }
        }
    },
    ok(){
        if(_ctrlx.ok){
            _ctrlx.ok();
        }
        return true;
    },
    menu(){
        if(_ctrlx.menu){
            _ctrlx.menu();
        }
        return true;
    },
    back(){
        return true;
    },
    left(){
        if(_isVideo){
            let duration=_tvFunc.getVideo().duration;
            if(duration=="Infinity"){
                return true;
            }
            _tvFunc.getVideo().currentTime-=20;_layer.notifyLess("进度减20秒");
        }
        return true;
    },
    right(){
        if(_isVideo){
            let duration=_tvFunc.getVideo().duration;
            if(duration=="Infinity"){
                return true;
            }
            _tvFunc.getVideo().currentTime+=20;_layer.notifyLess("进度加20秒");
        }
        return true;
    },
    up(){
        let video= _tvFunc.getVideo();
        let currentVolume=_tvFunc.getVideo().volume;
        if(currentVolume<1){if((currentVolume+0.2)>1){video.volume=1}else{video.volume+=0.2}}
        let name= Math.floor(video.volume*100);
        _layer.notifyLess("音量"+name);
        return true;
    },
    down(){
        let video= _tvFunc.getVideo();
        let currentVolume=_tvFunc.getVideo().volume;
        if(currentVolume>0){if((currentVolume-0.2)<0){video.volume=0}else{video.volume-=0.2;}}
        let name= Math.floor(video.volume*100);
        _layer.notifyLess("音量"+name);
        return true;
    },
    keyDownEvent(){
        var elem= this.getFocus();
        if(null==elem){
            this.down();
            return;
        }
        var updownNum= elem.attr("move-updown");
        if(updownNum){
            this.move(this.next(elem,updownNum));
        }
        this.moveBack(elem,"move-down");
    },
    moveBack(elem,attr){
        var attrElem= elem.attr(attr);
        if(attrElem){
            var strs =  attrElem.split(":");
            if(strs.length==1){
                if($$(attrElem).length>0){
                    this.move($$(attrElem).first());
                }else{
                    this.moveBack(elem,attr+"b");
                }
            }
            if(strs.length==2){
                this.move($$(strs[0]).find(strs[1]).first());
            }   
        }
    },
    keyUpEvent(){
        var elem= this.getFocus()
        if(null==elem){
            this.up();
            return;
        }
        var updownNum= elem.attr("move-updown");
        if(updownNum){
            this.move(this.prev(elem,updownNum));
            return;
        }
        var moveUp= elem.attr("move-up");
        if(moveUp){
            this.move($$(moveUp).first());
        }
    },
    keyRightEvent() {
        console.log("keyRightEvent");
        let focus=this.getFocus();
        if(null==focus){
            this.right();
            return;
        }
        this.move(focus.next());
    },
    found(location){
        if(null==this.menuId){
            return  $$(location);
        }
        let isShow=_layer.isShow(this.menuId);
        if(isShow){
            return $$("#"+this.menuId).find(location);
        }
        return  null;
    },
    getFocus(){
        return this.found(this.focusId);
    },
    keyLeftEvent() {
        console.log("keyLeftEvent");
        let focus=this.getFocus();
        if(null==focus){
            this.left();
            return;
        }
        this.move(focus.prev());
    },
    idFound(elem,num,down){
        let idPre=elem.attr("move-updown-id");
        if(idPre){
            let nowId=elem.attr("id").substring(idPre.length);
            console.log("foundId nowId::"+nowId);
            let newNum=Number(nowId)-Number(num);
            if(down){
                newNum=Number(nowId)+Number(num);
            }
            let foundId=idPre+newNum;
            console.log("foundId::"+foundId);
            if(null!=document.getElementById(foundId)){
                return $$("#"+foundId);
            }else{
                if(!down){
                    var moveUp= elem.attr("move-up");
                    return $$(moveUp);
                }
            }

            return elem;
        }
        return null;
    },
    next(elem,num){
        let newElem = this.idFound(elem,num,true);
        if(null!=newElem){
             return newElem;
        }
        //var elem= $$(this.focusId);
        for(var i=0;i<num;i++){
            if(elem.next()&&elem.next().length>0){
                elem=elem.next();
            }
        }
        return elem;
    },
    prev(elem,num){
        let newElem = this.idFound(elem,num,false);
        if(null!=newElem){
             return newElem;
        }
        for(var i=0;i<num;i++){
            if(elem.prev()&&elem.prev().length>0){
                elem=elem.prev();
            }else{
                var moveUp= elem.attr("move-up");
                return $$(moveUp);
            }
        }
        return elem;
    },
    move(nextElm){
        if(nextElm&&nextElm.length>0){
            $$(this.focusId).removeClass(this.focusClass);
            // var nextElm=$$(this.focusId).next();
            // $$(this.focusId).removeAttr("id");
            this.foucsActive(nextElm);
            // nextElm.attr('id', this.focusIdName);
             this.scrollTo();
             this.focusEvent();
        }
    },
    foucsActive(elem){
        elem.addClass(this.focusClass);
        //elem.css("background-color","#16baaa");
    },
    isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      },
      scrollTo: function() {
        var el = document.querySelector(this.focusId);
        var flag = this.isElementInViewport(el);
        if (!flag) {
            // 找到可滚动的父容器
            var parent = el.parentElement;
            var isHeader = el.closest('.tv-header') !== null; // 检查是否在header中
            
            // 如果是header中的元素，直接找到header作为滚动容器
            if (isHeader) {
                parent = el.closest('.tv-header');
                // 确保回到顶部时页面完全重置
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                
                // 处理header的水平滚动
                var elementRect = el.getBoundingClientRect();
                if (elementRect.right > window.innerWidth) {
                    parent.scrollLeft += (elementRect.right - window.innerWidth) + 60;
                } else if (elementRect.left < 0) {
                    parent.scrollLeft = Math.max(0, parent.scrollLeft + elementRect.left - 60);
                }
                return; // 对于header元素，处理完直接返回
            }
            
            // 非header元素的处理
            while (parent && (!parent.scrollHeight || parent.scrollHeight <= parent.clientHeight)) {
                parent = parent.parentElement;
            }
            
            if (parent) {
                var elementRect = el.getBoundingClientRect();
                var parentRect = parent.getBoundingClientRect();
                
                // 计算目标位置
                var targetScrollTop = parent.scrollTop;
                var targetScrollLeft = parent.scrollLeft;
                
                // 普通元素的垂直滚动
                if (elementRect.bottom > window.innerHeight) {
                    targetScrollTop = parent.scrollTop + (elementRect.bottom - window.innerHeight) + 20;
                } else if (elementRect.top < 0) {
                    targetScrollTop = parent.scrollTop + elementRect.top - 20;
                }
                
                // 普通元素的水平滚动
                if (elementRect.right > window.innerWidth) {
                    targetScrollLeft = parent.scrollLeft + (elementRect.right - window.innerWidth) + 40;
                } else if (elementRect.left < 0) {
                    targetScrollLeft = Math.max(0, parent.scrollLeft + elementRect.left - 40);
                }
                
                // 应用滚动
                if (targetScrollTop !== parent.scrollTop) {
                    parent.scrollTop = targetScrollTop;
                }
                if (targetScrollLeft !== parent.scrollLeft) {
                    parent.scrollLeft = targetScrollLeft;
                }
            }
        }
    },
    keyOkEvent() {
        console.log("点击了确认键");
        let focus=this.getFocus();
        if(null==focus){
            this.ok();
            return;
        }
        focus.trigger("click");
    },
    keyBackEvent(){
        if(_layer.isShow(this.menuId)){
            //menu
            _layer.hide(this.menuId);
        }else{
            //返回上一层
            window.location.href= this.backUrl();
        }
    },
    backUrl(){
        return _browser.getURL("index.html");
    },
    keyMenuEvent(){
        console.log("keyMenuEvent");
        this.isShow= _layer.toggle(_tv_menuId);
        if(!this.isShow){
            this.focus=null;
            _apiX.msgStr("menuShow","0");
        }else{
            this.menu();
            this.focus=this.found(this.focusId);
            _apiX.msgStr("menuShow","1");
        }
    },
    focusEvent(){
        console.log("focusEvent ");
        let focus=this.getFocus();
        if(null!=focus){
            console.log("focusEvent focus");
            focus.trigger("focus");
        }
    },
    initKeyEvent() {
        var KEY_BACK = 8,
            KeyQ=81,
            KEY_OK = 13,
            KeyA=65,
            KeyW=87,
            KeyD = 68,
            KeyS=83,
            KeyR=82
        let _this=this;
        console.log("initKeyEvent....")
        document.addEventListener("keydown",function(e){
       // .onkeydown = function (e) {
            var keyCode=e.keyCode;
           // console.log(e.keyCode);
           // if(!e.code){ keyCode=e.keyCode;}
            console.log(keyCode);
            switch (keyCode) {
                case KeyW:
                    _this.keyUpEvent()
                    break;
                case KeyS:
                    _this.keyDownEvent()
                    break
                case KeyA:
                    _this.keyLeftEvent()
                    break
                case 4: /*ipannel*/
                case KeyD:
                    _this.keyRightEvent()
                    break
                case KeyQ:
                    _this.keyBackEvent()
                    break
                case KEY_OK:
                    _this.keyOkEvent();
                    e.preventDefault();
                    break
                case KeyR:
                    _this.keyMenuEvent();
                    break
                default:
                    console.log("CCCCC");
                    //thismy.keyDefaultEvent(e.keyCode)
                    //e.preventDefault();
                    break
            }
        });
    }
};
