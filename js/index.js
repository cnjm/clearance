let mv= new Vue({
    el:"#app",
    data:function(){
        return {
            gametime:0,//游戏时间
            istimenow:true,//计时开关
            isok:false,//游戏结束了吗
            ischangenum:0,//插对了多少旗子
            thundernum:10,//减去插了旗子的雷数
            thunarr:[],//格子
            isthrnarr:[],//雷的下标//随机生成
            liv:0,//游戏等级
            thunline:9,
            thuncol:9,
            thunnum:10,//雷个数
            calculanum:0,//用于计算
            timer:null,//dingshiqi
        }
    },
    watch:{
        liv(val,oldval){//监测等级变化
            if(val==0){
                this.thunline=9;
                this.thuncol=9;
            }else if(val==1){
                this.thunline=16;
                this.thuncol=16;
            }else{
                this.thunline=16;
                this.thuncol=30;
            }
        },
        ischangenum(val,oldval){//检测胜利条件
            if(val==this.thunnum){
                clearInterval(this.timer);//停止计时
                this.isok=true;//不能再点击了
                this.$refs.showall.style.display="block";
                this.$refs.showt.innerHTML="恭喜你，获得了胜利";
            }
        }
    },
    computed:{

    },
    methods:{
        initdata(liv){//初始化
            this.changeHW(liv);
            this.newthunarr();//重置生成雷
            this.istimenow=true;//重置计时
            this.gametime=0;
            this.isok=false;//重置允许点击
        },
        newgame(){//点击笑脸或者重玩开始新的游戏
            this.$refs.showall.style.display="none";
            this.initdata(this.liv);
            this.toinitstyle();//重置样式
            clearInterval(this.timer);
        },
        clickthun(index,colindex,ele){//点击判断
            if(this.isok || ele.className !=""){
                return;
            }
            if(this.istimenow){
                this.istimenow=false;
                this.getgametime();
            }
            if(this.thunarr[index][colindex]==-1){
                clearInterval(this.timer);//停止计时
                this.showthunall();//显示所有地雷
                this.isok=true;//不能再点击了
                this.$refs.showall.style.display="block";//告诉用户已经失败了
                this.$refs.showt.innerHTML="你完蛋了，你这个菜鸟！";
            }else{//不是雷的时候
                this.calcula(index,colindex);//算
                ele.className ="calculanum"+this.calculanum;
                if(this.calculanum!=0){
                    ele.innerHTML=this.calculanum;
                }else{//如果是零，可以试着打开周围八个格子
                    for(let i=(index-1);i<(index+2);i++){
                        for(let j=(colindex-1);j<(colindex+2);j++){
                            if(i>-1 && j>-1 && i<this.thunline && j<this.thuncol){
                                this.clickthun(i,j,this.$refs.thunlist[i*this.thuncol+j]);
                            }
                        }
                    }
                }
            }
        },
        changeHW(num){//根据级别改变样式
            let vueapp=document.querySelector("#app");
            switch(num) {
                case 0:
                   vueapp.style.width=360+'px';
                //    vueapp.style.height=500+'px';
                   break;
                case 1:
                    console.log(num);
                   break;
                default:
                    console.log(num);
           } 
        },
        newthunarr(){//产出格子数组
            let n=0;
            let isarr=[];
            this.thunarr=[];
            for(let i = 0;i < this.thunline*this.thuncol; i++){
                this.thunarr[i] = n;
            }
            this.newthunlist();
            for(let p = 0;p<this.isthrnarr.length;p++){//写入雷
                this.thunarr[this.isthrnarr[p]]=-1;
            }
            for(let q=0;q<this.thunline;q++){//转为二维好渲染
                let arrs=this.thunarr.slice(q*this.thuncol, q*this.thuncol+this.thuncol);
                isarr.push(arrs);
            }
            this.thunarr=isarr;
        },
        newthunlist(){//生成雷的位置
            this.isthrnarr=[];
            for(let i = 0 ; ; i++){ 
                if(this.isthrnarr.length<this.thunnum){ 
                    this.genRandom(this.thunline*this.thuncol); 
                }else{ 
                  break; 
               } 
            } 
        },
        genRandom(count){//生成随机数
            let rand = parseInt(Math.random()*count); 
            for(let i = 0 ; i < this.isthrnarr.length; i++){ 
                 if(this.isthrnarr[i] == rand){ 
                      return false; 
                 }      
            } 
            this.isthrnarr.push(rand); 
        },
        calcula(index,colindex){//计算附近雷数
            // 根据位置不同，进行不同计算
            this.calculanum=0;
            for(let i=(index-1);i<(index+2);i++){
                for(let j=(colindex-1);j<(colindex+2);j++){
                    this.getcalculanum(i,j);//九个格子都算
                }
            }
        },
        getcalculanum(i,j){//计算雷数函数
            if(i>-1 && j>-1 && i<this.thunline && j<this.thuncol){
                if(this.thunarr[i][j]==-1){
                    this.calculanum+=1;
                }
            }
        },
        toinitstyle(){//还原样式
            for(let i=0;i<this.$refs.thunlist.length;i++){
                this.$refs.thunlist[i].className ="";
                this.$refs.thunlist[i].innerHTML="";
            }
        },
        showthunall(){//游戏失败显示所有雷
            for(let i=0;i<this.thunline;i++){
                for(let j=0;j<this.thuncol;j++){
                    if(this.thunarr[i][j]==-1){
                        this.$refs.thunlist[i*this.thuncol+j].className ="iscalcula";
                    }
                }
            }
        },
        getgametime(){//计算游戏时间、秒单位、有更好的方法
            clearInterval(this.timer);
            this.timer=setInterval(()=>{
                this.gametime+=1;
            },1000);
        },
        clickr(index,colindex,ele){//右键插旗
            if(ele.button==2){
                if(ele.target.className ==""){
                    if(this.thundernum<=0){//插了十个旗子就不能继续啦
                        return;
                    }
                    ele.target.className ="isokthun";
                    this.thundernum-=1;
                    this.ischange(index,colindex,"add");//计算胜利
                    return;
                }else if(ele.target.className =="isokthun"){
                    ele.target.className ="issusp";
                    this.thundernum+=1;
                    this.ischange(index,colindex,"reduce");//计算胜利
                    return;
                }else if(ele.target.className =="issusp"){
                    ele.target.className ="";
                }else{
                    return;
                }
            }
        },
        ischange(index,colindex,is){
            if(is=="add"){
                if(this.thunarr[index][colindex]==-1){
                    this.ischangenum+=1;
                }
            }else if(is=="reduce"){
                if(this.thunarr[index][colindex]==-1){
                    this.ischangenum-=1;
                }
            }
            
        },
        share(){//点击分享
            let str=window.location.href;
            let input=this.$refs.input;
            input.value=str;
            input.select();
            document.execCommand("Copy");
            alert("已复制地址，赶紧粘贴发送给小伙伴吧！")
            this.$refs.showall.style.display="none";
        }
    },
    created:function(){
        this.initdata(this.liv);
    },
    mounted:function(){
        console.log(this.$refs.thunlist[0]);//可以在这里设置渐变色的界面
    }
})