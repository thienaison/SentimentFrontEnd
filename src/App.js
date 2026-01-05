
import './App.css';
import {   useEffect, useRef, useState } from "react"
import { PieChart, Pie, Cell, Legend } from "recharts";
import { uploadFile } from './uploadFile';
import Pagination from './Pagination';



function App() {
  const inputRef = useRef(null)
  const [fileValue,setFileValue] = useState('');
  const [valid,setValid] = useState('');
  const [data,setData] = useState(null);
  const [typeSentiment,setTypeSentiment] = useState('5sentiment');
  const [colors,setColors] = useState([""])
  const [dataChart,setDataChart] = useState([]);
  const [loading,setLoading] = useState(false);
  
  // xử lý khi click chọn file bị ẩn
  const handleClickFile =(e)=>{
    e.preventDefault();
    inputRef.current.click();
  }

  const total  = dataChart.reduce((s, i) => s + i.value, 0);

  //xử lý khi chọn file
  const handleOnchangeFile =(e)=>{
    if(e.target.files[0] && (e.target.files[0].type === 'text/csv' || e.target.files[0].type === 'application/vnd.ms-excel' || e.target.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')){
      setFileValue(e.target.files[0]);
      setValid('')
    }
    else{
      if(!fileValue){
        setValid('Please select file csv, xls, xlsx');
      }
    }
  }


  //xử lý gửi file lên server
  const handleSubmitFile =(e)=>{
    e.preventDefault();
    if(fileValue){
      uploadFile(fileValue, typeSentiment).then((res)=>{
        if(res){
          setData(res);
          setLoading(false);
        }
      })
    }
    else{
      setValid('Please select file csv, xls, xlsx');
    }
    
  }

  //xử lý dữ liệu để hiển thị biểu đồ
  useEffect(()=>{
    if(data && typeSentiment === '5sentiment'){
      const count = [0,0,0,0,0];
      data.forEach((item)=>{
        if(item.sentiment === 'Rất tệ (1 sao)'){
          count[0] +=1;
        }
        else if(item.sentiment === 'Tệ (2 sao)'){
          count[1] +=1;
        }
        else if(item.sentiment === 'Bình thường (3 sao)'){
          count[2] +=1;
        }
        else if(item.sentiment === 'Khá tốt (4 sao)'){
          count[3] +=1;
        }
        else if(item.sentiment === 'Rất tốt (5 sao)'){
          count[4] +=1;
        }
      })
      setDataChart([
        { name: "Very Bad", value: count[0] },
        { name: "Bad", value: count[1] },
        { name: "Normal", value: count[2] },
        { name: "Good", value: count[3] },
        { name: "Very Good", value: count[4] },
      ])
    }
    else if(data && typeSentiment === '3sentiment'){
      const count = [0,0,0];
      data.forEach((item)=>{
        if(item.sentiment === 'Tiêu cực'){
          count[0] +=1;
        }
        else if(item.sentiment === 'Bình thường'){
          count[1] +=1;
        }
        else if(item.sentiment === 'Tích cực'){
          count[2] +=1;
        }
      })
      setDataChart([
        { name: "Negative", value: count[0] },
        { name: "Normal", value: count[1] },
        { name: "Positive", value: count[2] },
      ])
    }

    //Xử lý màu
    if(typeSentiment === '5sentiment'){
      setColors(["#ff4d4f", "#ff7a45", "#ffd666", "#73d13d", "#389e0d"]);
    }
    else if(typeSentiment === '3sentiment'){
      setColors(["#ff4d4f", "#ffd666", "#73d13d"]);
    }
    
  },[data]);

  return (
    <div className="app">
      <div className='header'>
        <div className="container_input">
          <form className="form_input" onSubmit={handleSubmitFile}>
              <div className="input_file "  >
                  <div className='select_file' onClick={handleClickFile}>{fileValue.name || 'select file'}</div>
                  <input ref={inputRef}  onChange={handleOnchangeFile} type="file" id="file" accept=".csv, .xls, .xlsx" />
              </div>
              <div className='select_type'>
                <select value={typeSentiment} onChange={(e) => setTypeSentiment(e.target.value)}>
                  <option value="5sentiment">5 Sentiment</option>
                  <option value="3sentiment">3 Sentiment</option>
                </select>
              </div>
              {valid && <div className='valid'>{valid}</div>}
              <button type="submit" className='btn_click' onClick={()=>{
                if(fileValue){setLoading(true)}
              }}>Submit</button>
          </form>
        </div>
        <div style={{ width: 300, height: 300, position: "relative" }}>
          <PieChart width={300} height={300} >
            <Pie
              data={dataChart}
              innerRadius={80}
              outerRadius={120}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke='transparent'
            >
              {dataChart.map((entry, index) => (
                <Cell key={index} fill={colors[index]}  />
              ))}
            </Pie>

            <Legend verticalAlign="bottom" />
          </PieChart>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
              color: "#27ae60",
            }}
          >
            {total}
            <br />
            <span style={{ fontSize: 14, fontWeight: 400, color: "#d1cacaff" }}>
              Packet Count
            </span>
          </div>
        </div>
      </div>
      {loading && <div className='loader'></div>}
      <div className="container_list">
          { !loading && data && <Pagination data={data} type={typeSentiment} /> }
      </div>
    </div>
  );
}

export default App;
