import { useEffect, useState } from "react";
import "./trinkerr.css";

var id

function Thrinkerr(){
    const [data,setData] = useState([]);
    const [inp,setInp] = useState("");
    const [loading ,setLoading] = useState(false);
    const [search ,setSearch] = useState([]);
    const [localData , setLocalData] = useState([])

    //get json data
    const getData=()=>{
        fetch('./data.json'
        ,{
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           }
        }
        )
        .then((res)=>{
            return res.json();
        })
        .then((res)=> {
            setData(res)
        })
        .catch((err)=>{
            console.log(err)
        })
      }

    //to get all the watchlist stored in local storge
    useEffect(()=>{
        getData();
        let local = JSON.parse(localStorage.getItem("market"));

        if(local === null){
            return
        }
        setLocalData(local)
    },[])

    //useEffect triggers when input in changed
    useEffect(()=>{
        if(inp===""){
            setSearch([]);
            setLoading(false);
            return
        }
        let searchData = data.filter((el)=>{
            return el[0].trim().toLowerCase().split("::")[0].includes(inp.toLowerCase())
        })
        setSearch(searchData);
    },[inp])


    // settting throttling of 0.5sec as soon as something in input box is changed
    const handleInput = (e)=>{
        if(id){
            return
        }
        setLoading(true);
        id = setTimeout(()=>{
            setLoading(false)
            setInp(e.target.value);
            id=undefined
        },500)
    }

    // settting throttling of 0.5sec as soon as something in input box is clicked
    const handleInput1 = (e)=>{
        if(id){
            return
        }
        id = setTimeout(()=>{
            setInp(e.target.value);
            id=undefined
        },500)
    }

    //to add icon and color when mouse is hovered
    const handleMouseOver = (i,j)=>{
        
        let show = document.getElementById(i);
        if(j){
            let back = document.getElementById(j);
            back.style.backgroundColor = "#f7f4f4"
        }
        show.style.display = "block"
        
    }

    //to remove icon and color when mouse is left
    const handleMouseLeave = (i,j)=>{
        let show = document.getElementById(i);
        if(j){
            let back = document.getElementById(j);
            back.style.backgroundColor = "#fff"
        }
        show.style.display = "none"
        console.log(show)
    }

    // adds a particular stock from the dropdown to the watchlist
    const handleAdd = (e)=>{
        let local = JSON.parse(localStorage.getItem("market"));
        if(local ===null){
            local = [e]
        }
        else{
            local.push(e)
        }
        localStorage.setItem("market",JSON.stringify(local));
        setLocalData(local)
    }

    //return the condition to make changes as to add +icon or add delete icon
    const handleChange = (data)=>{
        let temp = false
        for(let i=0 ;i<localData.length ; i++ ){
            if(localData[i][0].trim().toLowerCase().split("::")[0] === data[0].trim().toLowerCase().split("::")[0]){
                temp = true
            }
            if(temp){
                break;
            }
        }
        if(temp){
            return false
        }    
    
        return true
    }

    //to delete stocks from watchlist
    const handleDelete = (data)=>{
        let local = JSON.parse(localStorage.getItem("market"));
        
        local = local.filter((el)=>{
            return el[0].trim().toLowerCase().split("::")[0] !== data[0].trim().toLowerCase().split("::")[0]
        })
        localStorage.setItem("market",JSON.stringify(local));
        setLocalData(local)
    }

    return <div className="container">
        <div>
            <input onBlur={()=>setInp("")} onClick={handleInput1} onChange={handleInput} className="input-box" type="text" placeholder="Search stocks... "/>
            <div className="fixed">
                {
                    loading ? <div className="main-float float-font">...loading</div> : inp ? search[0] ? search.map((el,i)=>{
                        return <div id={i+"b"} onMouseLeave={()=>{handleMouseLeave(i,i+"b")}} onMouseOver={()=>handleMouseOver(i,i+"b")} key={i} className="main-float">
                                    <div className="float-left">
                                        <div style={((el[1] - el[2]) / el[2]).toFixed(2) < 0 ? {color:"#f51111"} : {color:"#17c0cc"}} className="float-font">{el[0].trim().split("::")[0]}</div>
                                        <div style={{color:"#979393",fontSize:"18px"}}>{el[0].trim().split("::")[1]}</div>
                                    </div>
                                    
                                    <div className="float-right">
                                    <div style={((el[1] - el[2]) / el[2]).toFixed(2) < 0 ? {color:"#f51111"} : {color:"#17c0cc"}} className="float-font">{el[1]}</div>
                                    <div style={{color:"#363535",fontSize:"18px",float:"right"}}>{((el[1] - el[2]) / el[2]).toFixed(2)}%</div>{((el[1] - el[2]) / el[2]).toFixed(2) < 0 ? <span className="triangle-down"></span> : <span className="triangle-up"></span>}
                                    </div>
                                    
                                    {
                                        localData[0] ? 
                                                !handleChange(el) ? <img id={i} onMouseDown={()=>handleDelete(el)} style={{display:"none"}} className="plus" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw0TFWug6We67x53KSbzynHSYaBH0i6t0HrA&usqp=CAU"/> : <img onMouseDown={()=>handleAdd(el)} id={i} style={{display:"none"}} className="plus" src="https://cdn3.iconfinder.com/data/icons/navigation-and-settings/24/Material_icons-01-07-512.png"/>
                                            : <img onMouseDown={()=>handleAdd(el)} id={i} style={{display:"none"}} className="plus" src="https://cdn3.iconfinder.com/data/icons/navigation-and-settings/24/Material_icons-01-07-512.png"/>
                                    }
                                </div> 
                    })
                    : <div className="main-float float-font">No results Found</div> 
                    : ""
                    
                }
            </div>
        </div>
        <div className="main-div">
            <h2 style={{color:"#3a3838"}}>WatchList</h2>
            {
                localData[0] ? localData.map((el,i)=>{
                    return <div id={i+"c"} className="main-float1" onMouseLeave={()=>{handleMouseLeave(i+"a",i+"c")}} onMouseOver={()=>handleMouseOver(i+"a",i+"c")} key={i+"c"} style={i===0? {borderTop:"1px solid rgb(231, 226, 226)"} : {}}>
                            <div className="float-left">
                                <div style={((el[1] - el[2]) / el[2]).toFixed(2) < 0 ? {color:"#f51111"} : {color:"#17c0cc"}} className="float-font">{el[0].trim().split("::")[0]}</div>
                                <div style={{color:"#979393",fontSize:"18px"}}>{el[0].trim().split("::")[1]}</div>
                            </div>
                            <div className="float-right">
                                <div style={((el[1] - el[2]) / el[2]).toFixed(2) < 0 ? {color:"#f51111"} : {color:"#17c0cc"}} className="float-font">{el[1]}</div>
                                <div style={{color:"#363535",fontSize:"18px",float:"right"}}>{((el[1] - el[2]) / el[2]).toFixed(2)}%</div>{((el[1] - el[2]) / el[2]).toFixed(2) < 0 ? <span className="triangle-down"></span> : <span className="triangle-up"></span>}
                            </div>
                            <img onClick={()=>handleDelete(el)} id={i+"a"} style={{display:"none",right: "17%",marginTop:"2%"}} className="plus" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw0TFWug6We67x53KSbzynHSYaBH0i6t0HrA&usqp=CAU"/>
                        </div> 
                        })  
                        : <img src="https://i.pinimg.com/236x/ae/8a/c2/ae8ac2fa217d23aadcc913989fcc34a2.jpg"/>
            }
        </div>
    </div>
}

export {Thrinkerr}