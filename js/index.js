(function(){
    let schedule=[
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];//事先定义的一个数组
    let schedule_time='';//后台用的字符串
    let DIVOFFLEFT=0;
    let DIVOFFTOP=0;//table到浏览器的距离
    let BOMRIGHT=$(document).width();//浏览器的
    let evx=0;
    let evy=0;//鼠标按下的初始位置
    let endclientx=0;
    let endclienty=0;//移动中的位置
    let movex=0;
    let movey=0;//移动时减去一开始的位置的距离
    let isMove=false;//鼠标移动开关
    let isClick=false;//点击清除的开关
    let maskel0=$('#calemask0');
    let maskel1=$('#calemask1');
    let maskel2=$('#calemask2');
    let maskel3=$('#calemask3');
     
    
    let lines=0;//开始的列
    let ranks=0;//开始的行
    let endlines=0;//最后的列
    let endranks=0;//最后的行

    //开局拿到转化的字符串,看name有没有......初始化
    initschedule();
    
    //绑定点击事件
    $(document).on("mousedown", "#calendarid", function(ev) {
        getoff($('#calendarid'));//调用求距离函数
        let oEvent = ev || event;
        evx = oEvent.clientX;
        evy = oEvent.clientY;
        if((evx-DIVOFFLEFT)>70 && (evy-DIVOFFTOP)<154){
            isMove=true;
            clickx=Math.ceil((evx-DIVOFFLEFT-70)/12);//点击的列
            clicky=Math.ceil((evy-DIVOFFTOP)/22);//点击的行
        }else{
            return;
        }
        
    });
    //绑定移动事件
    $(document).on("mousemove", "body", function(ev) {

        if(isMove){
            endclientx=ev.clientX
            endclienty=ev.clientY
            
            movex=endclientx-evx;
            movey=endclienty-evy;
            //根据条件创建遮罩
            if(movex>0&&movey>0){
                maskelnew();//每次进入之后都消除
                lines=Math.ceil((evx-DIVOFFLEFT-70)/12);//开始的列
                ranks=Math.ceil((evy-DIVOFFTOP)/22);//开始的行
                endlines=Math.ceil((endclientx-DIVOFFLEFT-70)/12)>48?48:Math.ceil((endclientx-DIVOFFLEFT-70)/12);//最后的列
                endranks=Math.ceil((endclienty-DIVOFFTOP)/22)>7?7:Math.ceil((endclienty-DIVOFFTOP)/22);//最后的行
                maskel0.css({
                    'display':'block',
                    'width':(endlines-lines+1)*12,
                    'height':(endranks-ranks+1)*22,
                    'left':70+(lines-1)*12,
                    'top':44+(ranks-1)*22
                });
                return;
            }else if(movex>0&&movey<0){
                maskelnew();
                lines=Math.ceil((evx-DIVOFFLEFT-70)/12);//开始的列
                ranks=Math.ceil((evy-DIVOFFTOP)/22);//开始的行
                endlines=Math.ceil((endclientx-DIVOFFLEFT-70)/12)>48?48:Math.ceil((endclientx-DIVOFFLEFT-70)/12);//最后的列
                endranks=Math.ceil((endclienty-DIVOFFTOP)/22)<1?1:Math.ceil((endclienty-DIVOFFTOP)/22);//最后的行
                maskel1.css({
                    'display':'block',
                    'width':(endlines-lines+1)*12,
                    'height':(ranks-endranks+1)*22,
                    'left':70+(lines-1)*12,
                    'bottom':(7-ranks+1)*22+($('#seletime').height()-221)
                });
                return;
            }else if(movex<0&&movey>0){
                maskelnew();//每次进入之后都消除
                lines=Math.ceil((evx-DIVOFFLEFT-70)/12);//开始的列
                ranks=Math.ceil((evy-DIVOFFTOP)/22);//开始的行
                endlines=Math.ceil((endclientx-DIVOFFLEFT-70)/12)<1?1:Math.ceil((endclientx-DIVOFFLEFT-70)/12);//最后的列
                endranks=Math.ceil((endclienty-DIVOFFTOP)/22)>7?7:Math.ceil((endclienty-DIVOFFTOP)/22);//最后的行
                maskel2.css({
                    'display':'block',
                    'width':(lines-endlines+1)*12,
                    'height':(endranks-ranks+1)*22,
                    'right':4+(48-lines)*12,
                    'top':44+(ranks-1)*22
                });
                return;
            }else if(movex<0&&movey<0){
                maskelnew();//每次进入之后都消除
                lines=Math.ceil((evx-DIVOFFLEFT-70)/12);//开始的列
                ranks=Math.ceil((evy-DIVOFFTOP)/22);//开始的行
                endlines=Math.ceil((endclientx-DIVOFFLEFT-70)/12)<1?1:Math.ceil((endclientx-DIVOFFLEFT-70)/12);//最后的列
                endranks=Math.ceil((endclienty-DIVOFFTOP)/22)<1?1:Math.ceil((endclienty-DIVOFFTOP)/22);//最后的行
                maskel3.css({
                    'display':'block',
                    'width':(lines-endlines+1)*12,
                    'height':(ranks-endranks+1)*22,
                    'right':4+(48-lines)*12,
                    'bottom':(7-ranks+1)*22+($('#seletime').height()-221)
                });
                return;
            }else{
                return;
            }
        }else{

        }
       
        
    });
    //绑定松开事件
    $(document).on("mouseup", "body", function(ev) {
        if(isMove){
            let upx=Math.ceil((ev.clientX-DIVOFFLEFT-70)/12)-1;//结束的列
            let upy=Math.ceil((ev.clientY-DIVOFFTOP)/22)-1;//结束的行
            
            maskelnew();//重置遮罩样式
            //如果拖动两个格子以上才会调用数组

            if(clickx-1==upx&&clicky-1==upy){//如果只是点击只改一个
                if(schedule[upy][upx]==1){
                    schedule[upy].splice(upx,1,0);
                }else{
                    schedule[upy].splice(upx,1,1);
                }
                conversty();
            }else{
                chanarr();//更新数组
            }
        }
        //转为字符串
        schedule_time=toschedulestr(schedule).toString();
        schedule_time=schedule_time.replace(/,/g,'');//去掉逗号
        $("input[name='appoint_time']").val(schedule_time);//每次数组改变就更新input的value
        isMove=false;
        return;    
        });

    //拖动完改变数组
    function chanarr(){
        if(endranks>=ranks&&endlines>=lines||endranks>=ranks&&endlines>lines||endranks>ranks&&endlines>=lines){
            for(let j=ranks-1;j<=(endranks-1);j++){
                for(let i=lines-1;i<=(endlines-1);i++){
                    if(schedule[j][i]==1){
                        schedule[j].splice(i,1,0);
                    }else{
                        schedule[j].splice(i,1,1);
                    }
                    
                }
            }
            isClick=true;
            conversty();//数组变化就跟新样式,根据是第几行第几列
        }else if(endranks>ranks&&endlines<lines){
            for(let j=ranks-1;j<=(endranks-1);j++){
                for(let i=endlines-1;i<=(lines-1);i++){
                    if(schedule[j][i]==1){
                        schedule[j].splice(i,1,0);
                    }else{
                        schedule[j].splice(i,1,1);
                    }
                    
                }
            }
            isClick=true;
            conversty();//数组变化就跟新样式,根据是第几行第几列
        }else if(endranks<ranks&&endlines>lines){
            for(let j=endranks-1;j<=(ranks-1);j++){
                for(let i=lines-1;i<=(endlines-1);i++){
                    if(schedule[j][i]==1){
                        schedule[j].splice(i,1,0);
                    }else{
                        schedule[j].splice(i,1,1);
                    }
                    
                }
            }
            isClick=true;
            conversty();//数组变化就跟新样式,根据是第几行第几列
        }else{
            for(let j=endranks-1;j<=(ranks-1);j++){
                for(let i=endlines-1;i<=(lines-1);i++){
                    if(schedule[j][i]==1){
                        schedule[j].splice(i,1,0);
                    }else{
                        schedule[j].splice(i,1,1);
                    }
                    
                }
            }
            isClick=true;
            conversty();//数组变化就跟新样式,根据是第几行第几列
        }
    }
    //数组变化就跟新样式,根据是第几行第几列
    function conversty(arr){
        let flatarr=toschedulestr(schedule);
        for(let i=0;i<flatarr.length;i++){
            let num1=Math.floor(i/48);
            let num2=i%48;
            if(flatarr[i]==1){
                $('#calendarid').children('tr').eq(num1).children('td').eq(num2+1).addClass('selected');
                $('#choicetext').text('已选时间段');
            }else{
                $('#calendarid').children('tr').eq(num1).children('td').eq(num2+1).removeClass('selected');
            }
        }
        addel();
    }
    //数组变化就在下面显示时间段
    function addel(){
        let addtime=0;
        let indexweek=0;
        let getmount=0;
        let outmount=0;
        timerrenderout();//生成之前先删除
        for(let j=0;j<schedule.length;j++){
            for(let i=0;i<schedule[j].length;i++){
                if(addtime==0&&schedule[j][i]==0){
                    continue;
                }else if(addtime==0&&schedule[j][i]==1){
                    indexweek=j;
                    getmount=i;
                    if(i==47){
                        addtime+=30;
                        let headhour=Math.floor((getmount*30)/60);
                        if(headhour<10){
                            headhour='0'+headhour;
                        }
                        let headmin=Math.floor((getmount*30)%60);
                        if(headmin<10){
                            headmin='0'+headmin;
                        }
                        let foothour=Math.floor(((i+1)*30)/60);
                        if(foothour<10){
                            foothour='0'+foothour;
                        }
                        let footmin=Math.floor(((i+1)*30)%60);
                        if(footmin<10){
                            footmin='0'+footmin;
                        }
                        let timestr=headhour+':'+headmin+'~'+foothour+':'+footmin;
                        timerender(j,timestr);
                        //重置记录的时间
                        addtime=0;
                        indexweek=0;
                        getmount=0;
                        outmount=0
                    }else{
                        addtime+=30;
                    }
                    continue;
                }else if(addtime!=0&&schedule[j][i]==1){
                    if(i==47){
                        addtime+=30;
                        let headhour=Math.floor((getmount*30)/60);
                        if(headhour<10){
                            headhour='0'+headhour;
                        }
                        let headmin=Math.floor((getmount*30)%60);
                        if(headmin<10){
                            headmin='0'+headmin;
                        }
                        let foothour=Math.floor(((i+1)*30)/60);
                        if(foothour<10){
                            foothour='0'+foothour;
                        }
                        let footmin=Math.floor(((i+1)*30)%60);
                        if(footmin<10){
                            footmin='0'+footmin;
                        }
                        let timestr=headhour+':'+headmin+'~'+foothour+':'+footmin;
                        timerender(j,timestr);
                        //重置记录的时间
                        addtime=0;
                        indexweek=0;
                        getmount=0;
                        outmount=0
                    }else{
                        addtime+=30;
                    }
                    continue;
                }else{
                    let headhour=Math.floor((getmount*30)/60);
                        if(headhour<10){
                            headhour='0'+headhour;
                        }
                        let headmin=Math.floor((getmount*30)%60);
                        if(headmin<10){
                            headmin='0'+headmin;
                        }
                        let foothour=Math.floor((i*30)/60);
                        if(foothour<10){
                            foothour='0'+foothour;
                        }
                        let footmin=Math.floor((i*30)%60);
                        if(footmin<10){
                            footmin='0'+footmin;
                        }
                        let timestr=headhour+':'+headmin+'~'+foothour+':'+footmin;
                        timerender(j,timestr);
                    //重置记录的时间
                    addtime=0;
                    indexweek=0;
                    getmount=0;
                    outmount=0
                }
            }
        }
    }

    //根据产生的时间段的字符串渲染到页面
    function timerender(j,timestr){
        let domeltime=$('#td-selected-time').children('p').eq(j);
        domeltime.show();
        domeltime.children("span:last-child").append("<span class='tip-time'>"+timestr+"</span> ");
    }
    //清除选择时间段的显示
    function timerrenderout(){
        $('.tip-time').remove();
        for(let i=0;i<7;i++){
            let domeltime=$('#td-selected-time').children('p').eq(i);
            domeltime.hide();
        }
    }
    //遮罩xiaoshi
    function maskelnew(){
        maskel0.hide();
        maskel1.hide();
        maskel2.hide();
        maskel3.hide();
    }
    //获取盒子到浏览器距离的函数
    function getoff(el){
        DIVOFFLEFT=el.offset().left-$(document).scrollLeft();
        DIVOFFTOP=el.offset().top-$(document).scrollTop();
    }
    //点击清除还原数组
    $(document).on("click", "#unchoice", function(ev) {
        schedule=[
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ];
        $('#choicetext').text('可拖动鼠标进行时间段选择');
        conversty();
        schedule_time=toschedulestr(schedule).toString();
        schedule_time=schedule_time.replace(/,/g,'');//去掉逗号
        $("input[name='appoint_time']").val(schedule_time);
    });
    
    //封装把数组扁平化传给台用
    function toschedulestr(arr) {
        let res = [];
        //递归遍历每一项
        arr.map(item => {
            if(Array.isArray(item)) {
                res = res.concat(toschedulestr(item));
            } else {
                res.push(item);
            }
        });
        return res;
    }
    //拿到niput的值，更改数组，渲染到页面
    function initschedule(){
        let initstr=$("input[name='appoint_time']").val();
        if(initstr){
            let arrinitstr = initstr.split(''); 
            let newarrinit = [];
            if(arrinitstr.length==336){
                for(let i = 0;i<7;i++){
                    newarrinit.push(arrinitstr.slice(48 * i, 48 * (i + 1)))
                }
                schedule=newarrinit;
                conversty();
            }else{
                console.log('长度出错了')
            }
        }else{
            console.log('输入的值是空的')
        }
        schedule_time=toschedulestr(schedule).toString();
        schedule_time=schedule_time.replace(/,/g,'');//去掉逗号
    }
})()