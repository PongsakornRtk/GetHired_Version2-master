import React, { useEffect, useState } from "react";

import FreelanceList from "../components/FreelanceList";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Freelance.css";
const Freelance = () => {
  const [loadedJobs, setLoadedJobs] = useState();
  const [filterList, setFilterList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/jobs`
        );
        setLoadedJobs(responseData.jobs);
        setFilterList(responseData.jobs);
      } catch (err) {}
    };
    fetchJobs();
  }, [sendRequest]);

  const jobApplyHandler = (applyJobId) => {
    setLoadedJobs((prevJobs) =>
      prevJobs.filter((job) => job.id !== applyJobId)
    );
  };

  // const filterInterest =  [];

  function filterByCategory(category, filterInterest) {
    const filterSuc = [];
    const jobList = [];
    loadedJobs.forEach(el => {
      jobList.push({job:el,count: 0})
    })
    for (let i = 0; i < jobList.length; i++) {
      category.forEach(el => {
          if(jobList[i].job.categories.includes(el)){ jobList[i].count += 1}
      })
    }
    jobList.sort(function(a, b) {
       if (a.count < b.count) return -1;
       if (a.count > b.count) return 1;
       return 0;
    });
    jobList.forEach(el => filterSuc.push(el.job))
    setFilterList(filterSuc);
}

// function handleFilterChange(category) {
// // กด = มี
// // ไม่กด = ไม่มี
// //ถ้า fe ตรงกับ filterList  
// if(category ){

// }

// }

  const handleSearchChange = (event) => {
    let eventList = event.target.value; //ดึงค่าที่รับมาใส่ตัวแปร
    setSearchList(eventList);
    console.log("searchList: " + searchList);
    let jobFilted = []; //สร้างตัวแปรมารับชุดข้อมูลที่กรองได้
    let jobList = loadedJobs; //สร้างตัวมาที่ดึงข้อมูลมาจากชุดข้อมูล loadedJobs
    if (eventList !== "") {
      //ถ้าค่าที่รับมานั้นไม่ว่าง (หรือก็คือมีอะไรอยู่ในช่องค้นหา)
      jobFilted = jobList.filter(
        (
          item //นำชุดข้อมูลที่มีอยู่ มากรอง แล้วไปแทนค่า
        ) =>
          item.title.toLowerCase().includes(eventList.toLowerCase()) ||
          item.description.toLowerCase().includes(eventList.toLowerCase()) ||
          item.companyName.toLowerCase().includes(eventList.toLowerCase()) ||
          item.wage.toString().includes(eventList.toLowerCase()) ||
          item.expDate.toString().includes(eventList.toLowerCase()) ||
          item.companyAddress.toLowerCase().includes(eventList.toLowerCase()) //โดยเช็คค่าที่มีอยู่ว่ามันมีค่าที่เหมือนใน .includes() หรือไม่
      );
      setFilterList(jobFilted); //นำชุดข้อมูลที่กรองได้ไปใส่ในชุดข้อมูลที่ทำหน้าที่แสดงค่า
    } else {
      setFilterList(jobList); //ถ้าไม่มีก็ให้แสดงชุดข้อมูลทั้งหมดที่มี
    }
  };
  // TODO
  // 1. สร้างตัวแปร filter เป็น string[] เก็บในstate 
  // -- 2. change Link to Button => onclick to new Function handleFilterChange
  // 3. new function handleFilterChange => ถ้ามีอยู่ในarray pop ออก ถ้าไม่มี push เข้าไป แล้วเรียก filterByCategory(filter)
  // 4. change filterByCategory เป็น notepad


  return (
    <React.Fragment>
      <div>
      <div className="searchbutton">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous"/>
          <form className="searchbuttoform" action="">
            <input  type="search"
                    placeholder="Search"
                    value={filterList.title} //แสดงค่าที่กรอกให้เห็น
                    onChange={handleSearchChange}/>
            <i class="fa fa-search"></i>
          </form>
        </div>
        <div className="jobtype">
          <button type="button" class="btn btn-outline-primary">Primary</button>
          
          <Button class="up" to="" onClick={() => filterByCategory("Frontend")}>
            <span id="frontendbutton">Front-end</span>
          </Button>
          <Button to="" onClick={() => filterByCategory("Backend")}>
            <span id="backendbutton">Back-end</span>
          </Button>
          <Button to="" onClick={() => filterByCategory("Network")}>
            <span id="networkbutton">Network</span>
          </Button>
          <Button to="" onClick={() => filterByCategory("Database")}>
            <span id="dbbutton">Database</span>
          </Button>
          <Button to="" onClick={() => filterByCategory("UX&UI")}>
            <span id="uibutton">UX & UI</span>
          </Button>
          <Button to="" onClick={() => filterByCategory("Other")}>
            <span id="otherbutton">Other</span>
          </Button>
          <Button to="" onClick={() => filterByCategory("All")}>
            <span id="otherbutton">All Job</span>
          </Button>
        </div>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
        {!isLoading && loadedJobs && (
          <FreelanceList items={filterList} onApplyJob={jobApplyHandler} />
        )}
      </div>
    </React.Fragment>
  );
};

export default Freelance;
