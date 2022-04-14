import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react/cjs/react.development";
import styles from "./newbook.css";
import DatePicker from 'react-datepicker';
import 'react-datetime/css/react-datetime.css';
import mystore from './Strore';

export default function BookingForm1_2() {

    let navigate = useNavigate();

    const [endcity, setEndcity] = useState('');
    const [duration, setDuration] = useState('');

    const [city, setCity] = useState([]);
    const [cityid, setCityid] = useState('');

    const [cityname, setCityname] = useState('');

    const [stete, setStete] = useState([]);
    const [stetename, setStetename] = useState('');
    const [date, setDate] = useState('');
    const [rideStartDate, setrideStartDate] = useState('');

    const [cust_address, setCust_address] = useState('');
    const [totalfare, setTotalFare] = useState('');


     const handleChange = date => setDate(date);
  //  const handleChange = (ev) => setDate(ev.target.value);

    const extractDate = (ev) => {
        let extractedDate = date.replace("T", " ");
        let extractedDate_1 = extractedDate.replace(".000Z","");
        setrideStartDate(extractedDate_1);
    }
  //  "2022-04-07T12:30"

  /*  let yourDate = date
    console.log("Date you have--> ", yourDate.toString())

    //offset to maintain time zone difference
  //  const offset = yourDate.getTimezoneOffset();  + (offset * 60 * 1000)

    yourDate = date(yourDate.getTime());
    console.log(yourDate);*/
  //  let modifiedDate = yourDate.toISOString().split('T')[0] + " " + yourDate.toLocaleTimeString()


    useEffect(() => {
        const getcity = async () => {
            const req = await fetch("http://localhost:8080/getcities?stete=" + stetename);
            const getres = await req.json();
         //   console.log(getres);
            setCity(await getres);
            localStorage.setItem("CityList", JSON.stringify({getres}));
            console.log(JSON.parse(localStorage.getItem("CityList")))
        }
        getcity();
    }, [stetename]);

    const handlecity = (event) => {
        const getCityname = event.target.value;
        setCityid(getCityname);
        event.preventDefault();
    }

    useEffect(() => {
        const getstete = async () => {
            const req = await fetch("http://localhost:8080/allstates");
            const getres = await req.json();
            console.log(getres);
            setStete(await getres);
        }
        getstete();
    }, []);

    const handlestete = (event) => {
        const getStetename = event.target.value;
        setStetename(getStetename);
        //     console.log(getStetename);
        event.preventDefault();
    }

    const handleInput = (ev) => {
        /*  setState((state) => ({
              ...state,
              [ev.target.name]: ev.target.value
          }));*/

        //    console.log(ev.target.name);
        //    console.log(ev.target.value);

        if (ev.target.name === "endcity")
            setEndcity(ev.target.value);

        else if (ev.target.name === "duration")
            setDuration(ev.target.value);

        else if (ev.target.name === "cust_address")
            setCust_address(ev.target.value);
    }

    let today = new Date();
    today.setDate(today.getDate() + 2);
    let in15Days = new Date();
    in15Days.setDate(in15Days.getDate() + 15);

    const handleFare = (ev) => {
        //  const duration=bookingdata.duration_hrs;
        fetch("http://localhost:8080/generatefare?duration_hrs=" + duration)
            .then(resp => resp.json())
            // .then(data => this.setState({ msg: "Inserted : " + data.uid }))
            .then(data => setTotalFare(data));
        //  console.log(totalfare);
        //  .then(data => console.log(data));
    }

    const submitData = (ev) => {
        ev.preventDefault();
        const body = JSON.stringify({
            stete: stetename,
            city_id: cityid,
            //cityname: cityname,
            destination_city_id: endcity,
            duration_hrs: duration,
            ride_start_date: rideStartDate,
            ride_status: "pending",
            pickup_address: cust_address,
            total_fare: totalfare,
            user_id: 1,
            driver_id:1,
        });
          console.log(body);



        localStorage.setItem("BookingForm1Data", body);
        //   console.log(JSON.parse(localStorage.getItem("BookingForm1Data")))
        //   mystore.dispatch({ type: "LOGGEDIN" });
        navigate('/booksummary');
    }


    return (
        <form className="form-inline">
            <div className="form-group" id="title"><h5 className="st1">BOOK DRIVER NOW</h5></div>

            <div className="form-group">

                <div className="col-sm-11">
                    <label>FROM</label>
                </div>

                <label className="visually-hidden" htmlFor="inlineFormSelectPref">State</label>

                <select name="stete" onChange={(e) => handlestete(e)}>
                    <option>--select state--</option>
                    {
                        stete.map((getcon, index) => (
                            <option key={getcon} value={getcon}> {getcon}</option>
                        ))
                    }
                </select>
            </div>

            <div className="form-group">
                <div className="col-sm-11">
                    <label>City</label>
                </div>

                <label className="visually-hidden" htmlFor="inlineFormSelectPref">FROM</label>

                <select name="city" onChange={(e) => handlecity(e)}>
                    <option>--select city--</option>
                    {
                        city.map((getcon) => (
                            <option key={getcon.city_id} value={getcon.city_id}> {getcon.city_name}</option>
                        ))
                    }

                </select>
            </div>

            <div className="form-group">
                <div className="col-sm-5">
                    <label>TO</label>
                </div>
                <div className="col-sm-11">
                    <input className="form-control" type="text" onChange={handleInput} name="endcity" required placeholder="Travelling place name" />
                </div>
            </div>

            <div className="form-group">
                <div className="col-sm-11">
                    <label>Enter Duration</label>
                </div>

                <div className="col-12">
                    <label className="visually-hidden" htmlFor="inlineFormSelectPref">Preference</label>
                    <select className="select" onChange={handleInput} onBlur={handleFare} name="duration">
                        <option>--select duration--</option>
                        <option value="6">6 Hours</option>
                        <option value="12">12 Hours</option>
                        <option value="24">24 Hours</option>
                        <option value="48">2 Days</option>
                        <option value="72">3 Days</option>
                        <option value="96">4 Days</option>
                        <option value="120">5 Days</option>
                        <option value="144">6 Days</option>
                    </select>
                </div>
            </div>

            <div className="calendarApp mt-5" id="cal">
                <div className="col-sm-11">
                    <label>Select Date</label> 
                    <DatePicker
                        wrapperClassName="date-picker"
                        name="selectDate"
                        selected={date}
                        onChange={handleChange}
                        onBlur={extractDate}
                        minDate={today}
                        maxDate={in15Days}
                        showTimeSelect
                        timeFormat="HH:mm:ss"
                        timeCaption="time"
                        dateFormat="yyyy-MM-dd HH:mm:ss "
                    />
                    {/* <input type="datetime-local" name="selectDate" onBlur={extractDate}  onChange={handleChange}></input> */}
                </div>
            </div>

            <div className="form-group">
                <div className="col-sm-5">
                    <label>Address</label>
                </div>
                <div className="col-sm-11">
                    <textarea className="form-control" onChange={handleInput} name="cust_address" required />
                </div>
            </div>

            <div className="form-group">
                <button type="submit" onClick={submitData} className="btn btn-primary mt-3">Next</button>
            </div>
        </form>
    )
}


{/*
    < div className="calendarApp mt-5" id="cal" >
        <div className="col-sm-11">
            <label>Select Date</label>
            <DatePicker
                className="form-control"
                timeFormat={false}
                isValidDate={disablePastDt}
                onChange={handleChange}
                name="selectDate"
                showTimeSelect
                timeIntervals={30}
                //   timeFormat="HH:mm"
                timeCaption="time"
            //   dateFormat="MMMM d, yyyy h:mm aa"
            />
        </div>
    </div >
*/}