function cutPage(arg){
  Object.assign(this,arg)
  // 样式的处理
  this.styleHandle=function(){
    var $style=`<style>
    .pageContent{
      display: flex;
      align-content: center;
      justify-content: center;
    }
    .pageContent div{
      display: flex;
      justify-content: center
    }
    .pageContent span{
      display:block;
      width:40px;
      height:40px;
      text-align:center;
      line-height:40px;
      border:1px solid red;
    }
    .currentStyle{
      color:white;
      background:red;
    }
  </style>`
    document.getElementsByTagName("head")[0].innerHTML+=$style
  }

  // dom的渲染
  this.domHandle=function(){
    var html=` <main class="pageContent">
                <b>总共${this.data.length}条</b>
                <select name="" id="" value=>`
    this.pageLength.forEach((i)=>{
        html+=`<option value="${i}">${i}条/页</option>`
    })     
    html+=`</select><div id="pageNumberCon">`   
    var $pagelength=Math.ceil(this.data.length/this.pageLengthCurrent)
    for(var i=1;i<=$pagelength;i++){
      html+=`<span>${i}</span>`
    }
    html+=`</div></main>`
    this.el.innerHTML=html
  }

  // 页码事件的监听
  this.pageNumberListen=function(){
    var $span=this.el.getElementsByTagName("span")
    for(var i=0;i<$span.length;i++){

      $span[i].onclick=function(e){
        for(var i=0;i<$span.length;i++){
          $span[i].className=""
        }
        this.currentPage=e.target.innerHTML
        e.target.className=e.target.className+ "currentStyle"
        this.callback2()
      }.bind(this)
    }
  }
  // 每次select改变时，重新渲染页码
  this.pageNumber=function(){
    var $pagelength=Math.ceil(this.data.length/this.pageLengthCurrent)
    var html=""
    for(var i=1;i<=$pagelength;i++){
      html+=`<span>${i}</span>`
    }
    pageNumberCon.innerHTML=html
    this.pageNumberListen()
  }
  // 监听select的数据改变
  this.selectChange=function(){
    var $select=this.el.getElementsByTagName("select")[0]
    $select.onchange=function(e){
       
        this.pageLengthCurrent=e.target.value
        this.pageNumber()
        this.currentPage=1
        this.callback2()
        this.cb1(e.target.value)
    }.bind(this)
  }

  // 执行展示数据的callback函数
  this.callback2=function(){
    var everyData=this.data.slice((this.currentPage-1)*this.pageLengthCurrent,this.currentPage*this.pageLengthCurrent)
        this.cb2(everyData)
  }
  this.init=function(){
    // 当前每页展示的条数
    this.pageLengthCurrent=this.pageLength[0]
    // 当前页码数
    this.currentPage=1
    this.domHandle()
    this.pageNumberListen()
    this.selectChange()
    this.callback2()
    this.styleHandle()
  }
}
