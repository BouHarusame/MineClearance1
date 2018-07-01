/**
 * Created by 12448 on 2018/5/19.
 */
var bq_game = {
    box : document.getElementById('box'),
    startBox : document.getElementById('startBox'),
    scope : document.getElementById('scope'),
    scopeBox : document.getElementById('scopeBox'),
    alertBox : document.getElementById('alertBox'),
    alertImg : document.getElementById('alertImg'),
    close : document.getElementById('close'),
    mineStar : 0,
    mineOver : 0,
    mineMap :[],
    startGameBool : true,
    eventBind : function(){
        var that = this;
        this.startBox.onclick = function(){
            that.scopeBox.style.display = 'block';
            that.box.style.display = 'block';
            that.init();
            that.startGameBool = false;
        };
        this.box.onmousedown = function(e){
            var e = e || window.event;
            var event = e.target;
            if(e.which == 1){
                that.leftClick(event);
            }else if(e.which == 3){
                that.rightClick(event);
            }
        };
        this.box.oncontextmenu = function(e){
            return false;
        };
        this.close.onclick = function(e){
            that.box.style.display = 'none';
            that.box.innerHTML = '';
            that.scopeBox.style.display = 'none';
            that.alertBox.style.display = 'none';
            that.startGameBool = true;
        }
    },
    init : function(){
        this.mineStar = window.prompt('请输入地雷的数量');
        this.mineOver = this.mineStar;
        this.scope.innerHTML = this.mineOver;
        //创建游戏块
        for(var i = 0; i < 10; i++){
            for(var j = 0; j < 10; j++){
                var dom = document.createElement('div');
                dom.classList.add('block');
                dom.setAttribute('id',i + '-' + j);
                this.box.appendChild(dom);
                this.mineMap.push({ mine : 0 });
            }
        }

        //创建地雷区域
        var domArr = document.getElementsByClassName('block');
        while(this.mineStar){
            var index = Math.floor(Math.random()*100);
            if( this.mineMap[index].mine == 0){
                domArr[index].classList.add('isLei');
                this.mineMap[index].mine = 1;
                this.mineStar --;
            }

        }
    },
    leftClick : function(dom){
        if(dom.classList.contains('flag')){
            return;
        }
        var that = this;
        var isLei = document.getElementsByClassName('isLei');
        if(dom && dom.classList.contains('isLei')){
            for(var i = 0; i < isLei.length; i++){
                isLei[i].classList.add('show');
            }
            setTimeout(function(){
                that.alertBox.style.display = 'block';
                that.alertImg.style.background = 'url("img/over.jpg")no-repeat top center';
                //that.box.display = 'none';
                //that.box.innerHTML = '';
            },1000)
        }else{
            var n = 0;
            var posArr = dom && dom.getAttribute('id').split('-');
            var posX = posArr && +posArr[0];
            var posY = posArr && +posArr[1];
            //给数字增加样式
            dom && dom.classList.add('num');
            //判断数字的具体是几
            for(var i = posX - 1; i <= posX + 1; i++){
                for(var j = posY - 1; j <= posY + 1; j++){
                    var around = document.getElementById(i + '-' + j);
                    if(around && around.classList.contains('isLei')){
                        n++;
                    }
                }
            }

            dom && (dom.innerHTML = n);
            if( n==0 ){
                //判断数字是0或者为空的 进行扩散
                for (var i = posX - 1; i <= posX + 1; i++) {
                    for (var j = posY - 1; j <= posY + 1; j++) {
                        var nearBox = document.getElementById(i + '-' + j);
                        if (nearBox && nearBox.length != 0) {
                            if (!nearBox.classList.contains('check')) {
                                nearBox.classList.add('check');
                                this.leftClick(nearBox);
                            }
                        }
                    }
                }
            }
        }
    },
    rightClick : function(dom){
        if(dom.classList.contains('num')){
            return ;
        }
        dom.classList.toggle('flag');
        if(dom.classList.contains('isLei') && dom.classList.contains('flag')){
            this.mineOver --;
        }
        if( dom.classList.contains('isLei') && !dom.classList.contains('flag')){
            this.mineOver ++;
        }
        this.scope.innerHTML = this.mineOver;
        if(this.mineOver == 0){
            this.alertBox.style.display = 'block';
            this.alertImg.style.backgroundImage = 'url("img/success.png")';
        }


    }
};
bq_game.eventBind();
