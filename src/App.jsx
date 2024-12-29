import { useEffect, useState } from 'react'
import Proptypes from "prop-types"
import './App.css'


/* IMAGES */ 

import clearIcon from "./assets/clear.png";
import cloudIcon from "./assets/cloudy.png";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/rain.png";
import snowIcon from "./assets/snow.png";

import windIcon from "./assets/wind.png";
import humidityIcon from "./assets/humidity.png";

import { use } from 'react';
import PropTypes from 'prop-types';

const WeatherDetails=({props,props1,props2,props3,props4,props5,props6,props7})=>{
   return(
    <>

    <div className='image'>
       <img src={props} alt='image'/>
    </div>
    <div className='temp'> {props1}*C </div>
    <div className='location'> {props2} </div>
    <div className="country">{props3}</div>
    <div className='cord'>
      <div>
        <span className='latitude'>latitude</span>
        <span className='lati'>{props4}</span>
      </div>
      <div>
        <span className='longitude'>longitude</span>
        <span className='longi'>{props5}</span>
      </div>
    </div>

    <div className='data_container'>
       <div className='element'>
          <img src={humidityIcon} alt='humidity' className='icon'/>
       
       <div className="data">
          <div className="humidity_percent">
           {props6}%
          </div>
          <div className='text'>
           Humidity
          </div>
        </div>
       </div>

       <div className='element'>
          <img src={windIcon} alt='wind' className='icon'/>
       
       <div className="data">
          <div className="wind_percent">
           {props7} km/h
          </div>
          <div className='text'>
           Wind Speed
          </div>
        </div>
       </div>
    </div>
    </>
   )
}
WeatherDetails.propTypes={
   props:PropTypes.string.isRequired,
   props1:PropTypes.number.isRequired,
   props2:PropTypes.string.isRequired,
   props3:PropTypes.string.isRequired,
   props4:PropTypes.number.isRequired,
   props5:PropTypes.number.isRequired,
   props6:PropTypes.number.isRequired,
   props7:PropTypes.number.isRequired
}


function App() {

  let api_key="b72a79c1b8e03863d8606539456807b0";

  const[text,setText]=useState("Bengaluru")
   
  const[icon,setIcon]=useState(clearIcon)
  const[temp,setTemp]=useState(0)
  const[city,setCity]=useState("")
  const[country,setCountry]=useState("")
  const[latitude,setLatitude]=useState(0)
  const[longitude,setLongitude]=useState(0)
  const[humidity,setHumidity]=useState(0)
  const[wind,setWind]=useState(0)

  const[cityNotFound,setCityNotFound]=useState(false)
  const[loading,setLoading]=useState(false)
  const[error,setError]=useState(null)

  const weatherIconMap={
      "01d": clearIcon,
      "01n": clearIcon,
      "02d": cloudIcon,
      "02n": cloudIcon,
      "03d": drizzleIcon,
      "03n": drizzleIcon,
      "04d": drizzleIcon,
      "04n": drizzleIcon,
      "09d": rainIcon,
      "09n": rainIcon,
      "10d": rainIcon,
      "10n": rainIcon,
      "13d": snowIcon,
      "13n": snowIcon
   }

  const search = async() =>{
       setLoading(true)

       let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

       try{
          let res = await fetch(url);
          let data=await res.json();
          //console.log(data)
          if(data.cod === "404"){
            console.error("City not found")
            setCityNotFound(true)
            setLoading(false)
            return
          }

          setHumidity(data.main.humidity)
          setWind(data.wind.speed)
          setTemp(Math.floor(data.main.temp))
          setCity(data.name)
          setCountry(data.sys.country)
          setLatitude(data.coord.lat)
          setLongitude(data.coord.lon)

          const weatherIconCode=data.weather[0].icon
          setIcon(weatherIconMap[weatherIconCode] || clearIcon)
          setCityNotFound(false)

       }
       catch(error){
          console.error("An error occurred:",error.message);
          setError("An error occurred while fetching data.")
       }
       finally{
          setLoading(false)
       }
  }

  const handleCity=(e)=>{
      setText(e.target.value);
  }

  const handleKeyDown=(e)=>{
     if(e.key === "Enter"){
       search();
     }
  }

  useEffect(()=>{
   search()
  },[])

   return (
    <>
      <div className='container'>
         <div className='input_container'>
             <input 
             type='text' 
             className='cityInput' 
             placeholder='Search City' 
             onChange={handleCity}
             value={text}
             onKeyDown={handleKeyDown}
             />
             
             <div className='search_icon' onClick={()=>{
               search()
             }}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M762.69-160.92 524.46-399.16q-30 22.77-65.79 35.27-35.79 12.5-73.87 12.5-93.58 0-159.11-65.51-65.53-65.51-65.53-159.04 0-93.52 65.51-159.1 65.51-65.57 159.04-65.57 93.52 0 159.1 65.53 65.57 65.53 65.57 159.11 0 39.23-12.88 75.02-12.89 35.8-34.89 64.64l238.23 238.23-37.15 37.16ZM384.77-403.38q72.31 0 122.46-50.16 50.16-50.15 50.16-122.46t-50.16-122.46q-50.15-50.16-122.46-50.16t-122.46 50.16Q212.15-648.31 212.15-576t50.16 122.46q50.15 50.16 122.46 50.16Z"/>
                  </svg>
             </div>
         </div>

         {!loading && !cityNotFound &&<WeatherDetails props={icon} props1={temp} props2={city} props3={country} props4={latitude} props5={longitude} props6={humidity} props7={wind}/>}

         {loading && <div className="loading_message">Loading...</div>}

         {error && <div className="error_message">{error}</div>}

         {cityNotFound && <div className="city_not_found">City not found</div>}

         <p className='copyright'>
             Designed by <span>Dani</span>
         </p>
      </div>
    </>
  )
}

export default App;
